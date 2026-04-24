var modal = document.getElementById('team-role-modal');
var titleEl = document.getElementById('team-role-modal-title');
var bodyEl = modal ? modal.querySelector('.team-role-modal-body') : null;
var backdrop = modal ? modal.querySelector('.team-role-modal-backdrop') : null;
var closeBtn = modal ? modal.querySelector('.team-role-modal-close') : null;
var panel = modal ? modal.querySelector('.team-role-modal-panel') : null;
var container = document.getElementById('team-container');
var lastFocus = null;
var roleDescriptions = {};
var roleTypes = {};
var teamData = null;
var renderFrame = 0;
var TEAM_CARD_MIN_WIDTH = 300;
var lastRenderedColumnCount = 0;
var scrollRestoreKey = 'team-scroll:' + window.location.pathname;
var pendingScrollRestore = null;

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

try {
    var savedScroll = sessionStorage.getItem(scrollRestoreKey);
    pendingScrollRestore = savedScroll == null ? null : parseInt(savedScroll, 10);
    if (!Number.isFinite(pendingScrollRestore)) {
        pendingScrollRestore = null;
    }
} catch (error) {
    pendingScrollRestore = null;
}

function buildRoleOrderMap(priorityGroups) {
    var orderMap = {};
    if (!Array.isArray(priorityGroups)) {
        return orderMap;
    }
    var nextIndex = 0;
    priorityGroups.forEach(function (group) {
        if (Array.isArray(group)) {
            group.forEach(function (label) {
                orderMap[label] = nextIndex;
                nextIndex += 1;
            });
            return;
        }
        orderMap[group] = nextIndex;
        nextIndex += 1;
    });
    return orderMap;
}

function buildRoleGroupMap(priorityGroups) {
    var groupMap = {};
    if (!Array.isArray(priorityGroups)) {
        return groupMap;
    }
    priorityGroups.forEach(function (group, groupIndex) {
        if (Array.isArray(group)) {
            group.forEach(function (label) {
                groupMap[label] = groupIndex;
            });
            return;
        }
        groupMap[group] = groupIndex;
    });
    return groupMap;
}

function sortRoles(roleNames, orderMap) {
    return roleNames
        .map(function (roleName, index) {
            var roleType = roleTypes[roleName];
            if (!roleName || !roleType) {
                return null;
            }
            return {
                label: roleName,
                type: roleType,
                index: index
            };
        })
        .filter(Boolean)
        .sort(function (a, b) {
            var aPriority = Object.prototype.hasOwnProperty.call(orderMap, a.label) ? orderMap[a.label] : Number.MAX_SAFE_INTEGER;
            var bPriority = Object.prototype.hasOwnProperty.call(orderMap, b.label) ? orderMap[b.label] : Number.MAX_SAFE_INTEGER;
            if (aPriority !== bPriority) {
                return aPriority - bPriority;
            }
            return a.index - b.index;
        });
}

function getHighestRoleGroup(member, groupMap) {
    var roles = Array.isArray(member.roles) ? member.roles : [];
    var bestGroup = Number.MAX_SAFE_INTEGER;

    roles.forEach(function (roleName) {
        var groupIndex = Object.prototype.hasOwnProperty.call(groupMap, roleName) ? groupMap[roleName] : Number.MAX_SAFE_INTEGER;
        if (groupIndex < bestGroup) {
            bestGroup = groupIndex;
        }
    });

    return bestGroup;
}

function sortMembers(members, groupMap) {
    return members
        .map(function (member, index) {
            return {
                member: member,
                originalIndex: index,
                highestGroup: getHighestRoleGroup(member, groupMap)
            };
        })
        .sort(function (a, b) {
            if (a.highestGroup !== b.highestGroup) {
                return a.highestGroup - b.highestGroup;
            }
            return a.originalIndex - b.originalIndex;
        })
        .map(function (entry) {
            return entry.member;
        });
}

function applyRoleStyle(chip, styleDef) {
    if (!styleDef) {
        return;
    }
    if (styleDef.color) {
        chip.style.color = styleDef.color;
    }
    if (styleDef.background) {
        chip.style.background = styleDef.background;
    }
    if (styleDef.borderColor) {
        chip.style.borderColor = styleDef.borderColor;
    }
    if (styleDef.fontStyle) {
        chip.style.fontStyle = styleDef.fontStyle;
    }
}

function createImageStack(member) {
    var images = Array.isArray(member.images) ? member.images.filter(Boolean) : [];
    if (!images.length) {
        return null;
    }

    var stack = document.createElement('button');
    stack.type = 'button';
    stack.className = 'team-image-stack';

    var primaryImage = document.createElement('img');
    primaryImage.className = 'team-image is-visible';
    primaryImage.src = images[0];
    primaryImage.alt = member.name;
    stack.appendChild(primaryImage);

    var secondaryImage = document.createElement('img');
    secondaryImage.className = 'team-image';
    secondaryImage.alt = '';
    if (images.length > 1) {
        secondaryImage.src = images[1];
    } else {
        secondaryImage.src = images[0];
    }
    stack.appendChild(secondaryImage);

    if (images.length > 1) {
        var currentIndex = 0;
        var activeLayer = primaryImage;
        var inactiveLayer = secondaryImage;

        stack.addEventListener('click', function () {
            var nextIndex = (currentIndex + 1) % images.length;
            inactiveLayer.src = images[nextIndex];
            inactiveLayer.classList.add('is-visible');
            activeLayer.classList.remove('is-visible');
            currentIndex = nextIndex;

            var previousActive = activeLayer;
            activeLayer = inactiveLayer;
            inactiveLayer = previousActive;
        });
    }

    return stack;
}

function createRoleChip(role, roleStyles) {
    var chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'team-role-chip';
    chip.textContent = role.label;
    chip.dataset.roleLabel = role.label;
    chip.dataset.roleType = role.type;
    applyRoleStyle(chip, roleStyles[role.type]);
    return chip;
}

function createTeamCard(member, roleOrderMap, roleStyles) {
    var card = document.createElement('div');
    card.classList = 'team-card hover-card';

    var imageStack = createImageStack(member);
    if (imageStack) {
        card.appendChild(imageStack);
    }

    var name = document.createElement('h3');
    name.textContent = member.name;
    card.appendChild(name);

    var grade = document.createElement('div');
    grade.className = 'team-grade';
    grade.textContent = member.grade || '';
    card.appendChild(grade);

    var roles = Array.isArray(member.roles) ? sortRoles(member.roles, roleOrderMap) : [];
    if (roles.length) {
        var roleRow = document.createElement('div');
        roleRow.className = 'team-roles';
        roles.forEach(function (role) {
            roleRow.appendChild(createRoleChip(role, roleStyles));
        });
        card.appendChild(roleRow);
    }

    if (member.bio) {
        var bio = document.createElement('p');
        bio.className = 'team-bio';
        bio.textContent = member.bio;
        card.appendChild(bio);
    }

    return card;
}

function getColumnCount() {
    if (!container) {
        return 1;
    }

    var styles = window.getComputedStyle(container);
    var gap = parseFloat(styles.columnGap || styles.gap || '0');
    var availableWidth = container.clientWidth;
    var columnCount = Math.floor((availableWidth + gap) / (TEAM_CARD_MIN_WIDTH + gap));
    return Math.max(1, columnCount);
}

function createColumns(count) {
    var columns = [];
    for (var i = 0; i < count; i += 1) {
        var column = document.createElement('div');
        column.className = 'team-column';
        columns.push(column);
    }
    return columns;
}

function getShortestColumnIndex(columnHeights) {
    var shortestIndex = 0;
    for (var i = 1; i < columnHeights.length; i += 1) {
        if (columnHeights[i] < columnHeights[shortestIndex]) {
            shortestIndex = i;
        }
    }
    return shortestIndex;
}

function stretchLastCards(columns) {
    columns.forEach(function (column) {
        var cards = column.querySelectorAll('.team-card');
        if (!cards.length) {
            return;
        }
        cards[cards.length - 1].classList.add('team-card--stretch');
    });
}

function saveScrollPosition() {
    try {
        sessionStorage.setItem(scrollRestoreKey, String(window.scrollY || window.pageYOffset || 0));
    } catch (error) {
        // Ignore storage failures.
    }
}

function restoreScrollPosition() {
    if (pendingScrollRestore == null) {
        return;
    }

    var targetScroll = pendingScrollRestore;
    pendingScrollRestore = null;
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            window.scrollTo(0, targetScroll);
        });
    });
}

function openModal(label, description) {
    if (!modal || !titleEl || !bodyEl) {
        return;
    }
    lastFocus = document.activeElement;
    titleEl.textContent = label;
    bodyEl.textContent = description;
    modal.hidden = false;
    if (panel) {
        panel.classList.remove('is-closing');
    }
    requestAnimationFrame(function () {
        if (backdrop) {
            backdrop.classList.add('is-visible');
        }
    });
    if (closeBtn) {
        closeBtn.focus();
    }
}

function closeModal() {
    if (!modal) {
        return;
    }
    if (panel) {
        panel.classList.add('is-closing');
    }
    if (backdrop) {
        backdrop.classList.remove('is-visible');
    }
    var transitionMs = 300;
    setTimeout(function () {
        modal.hidden = true;
        if (panel) {
            panel.classList.remove('is-closing');
        }
    }, transitionMs);
    if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
    }
}

function renderTeam(data) {
    if (!container) {
        return;
    }

    roleTypes = data.roleTypes || {};
    roleDescriptions = data.roleDescriptions || {};
    var roleStyles = data.roleStyles || {};
    var rolePriority = data.rolePriority || [];
    var roleOrderMap = buildRoleOrderMap(rolePriority);
    var roleGroupMap = buildRoleGroupMap(rolePriority);
    var members = Array.isArray(data.members) ? sortMembers(data.members, roleGroupMap) : [];
    lastRenderedColumnCount = getColumnCount();
    container.innerHTML = '';
    var columns = createColumns(lastRenderedColumnCount);
    var columnFragment = document.createDocumentFragment();
    var gap = parseFloat(window.getComputedStyle(container).rowGap || window.getComputedStyle(container).gap || '0');
    var columnHeights = new Array(columns.length).fill(0);

    columns.forEach(function (column) {
        columnFragment.appendChild(column);
    });
    container.appendChild(columnFragment);

    members.forEach(function (member) {
        var card = createTeamCard(member, roleOrderMap, roleStyles);
        var columnIndex = getShortestColumnIndex(columnHeights);
        columns[columnIndex].appendChild(card);
        columnHeights[columnIndex] += card.offsetHeight;
        if (columns[columnIndex].children.length > 1) {
            columnHeights[columnIndex] += gap;
        }
    });

    stretchLastCards(columns);
    restoreScrollPosition();
}

function scheduleTeamRender() {
    if (!teamData || !container) {
        return;
    }
    var nextColumnCount = getColumnCount();
    if (nextColumnCount === lastRenderedColumnCount) {
        return;
    }
    if (renderFrame) {
        cancelAnimationFrame(renderFrame);
    }
    renderFrame = requestAnimationFrame(function () {
        renderFrame = 0;
        renderTeam(teamData);
    });
}

function showLoadError() {
    if (!container) {
        return;
    }
    container.innerHTML = '';
    var message = document.createElement('p');
    message.className = 'team-bio';
    message.textContent = 'Unable to load team members list.';
    container.appendChild(message);
}

async function loadTeamData() {
    try {
        var response = await fetch('./team_data.json', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Failed to load team members list.');
        }
        var data = await response.json();
        teamData = data;
        renderTeam(data);
    } catch (error) {
        console.error(error);
        showLoadError();
    }
}

if (container) {
    container.addEventListener('click', function (ev) {
        var chip = ev.target.closest('.team-role-chip');
        if (!chip) {
            return;
        }

        var roleType = chip.dataset.roleType;
        var description = roleDescriptions[roleType];
        if (!description) {
            return;
        }

        openModal(chip.dataset.roleLabel || chip.textContent.trim(), description);
    });
}

if (backdrop) {
    backdrop.addEventListener('click', closeModal);
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal && !modal.hidden) {
        closeModal();
    }
});

window.addEventListener('resize', scheduleTeamRender);
window.addEventListener('load', scheduleTeamRender);
window.addEventListener('scroll', saveScrollPosition, { passive: true });
window.addEventListener('pagehide', saveScrollPosition);

loadTeamData();
