var ROLE_DESCRIPTIONS = {
    'role-pw': {
        title: 'Problem Writer',
        body: 'Writes original contest problems for all divisions, checks them for accuracy and fairness, and puts together complete solution sets. Problems go through internal review and testing before the competition.'
    },
    'role-ops': {
        title: 'Operations',
        body: 'Takes care of the practical side of running the contes, such as rooms, timing, materials, registration check-in, and day-of coordination. Also handles sponsor outreach and serves as the main point of contact when issues come up during the event.'
    },
    'role-pr': {
        title: 'Public Relations',
        body: 'Promotes the competition to schools, clubs, and the broader community through announcements, social media, and outreach materials. Keeps branding consistent across platforms and works with Web Dev to keep the website visuals up to date.'
    },
    'role-webdev': {
        title: 'Web Developer',
        body: 'Builds and maintains the competition website, including event info, registration, and submission systems. Makes sure everything is accessible, clear, and works on mobile. Coordinates with PR on branding and with Operations on logistics updates.'
    },
    'role-activities': {
        title: 'Activities',
        body: 'Plans additional functions on the competition day that make the event more welcoming, enriching, and enjoyable for all competitors.'
    },
};

function findRoleClass(el) {
    if (!el || !el.classList) {
        return null;
    }
    var list = el.classList;
    for (var i = 0; i < list.length; i++) {
        if (list[i].indexOf('role-') === 0) {
            return list[i];
        }
    }
    return null;
}

function getRoleContent(chip) {
    var roleClass = findRoleClass(chip);
    if (!roleClass || !ROLE_DESCRIPTIONS[roleClass]) {
        return null;
    }
    var def = ROLE_DESCRIPTIONS[roleClass];
    var label = chip.textContent.trim();
    var title = def.title != null ? def.title : label;
    return { title: title, body: def.body };
}

var modal = document.getElementById('team-role-modal');
var titleEl = document.getElementById('team-role-modal-title');
var bodyEl = modal ? modal.querySelector('.team-role-modal-body') : null;
var backdrop = modal ? modal.querySelector('.team-role-modal-backdrop') : null;
var closeBtn = modal ? modal.querySelector('.team-role-modal-close') : null;

var lastFocus = null;

function openModal(content) {
    if (!modal || !titleEl || !bodyEl) {
        return;
    }
    lastFocus = document.activeElement;
    titleEl.textContent = content.title;
    bodyEl.textContent = content.body;
    modal.hidden = false;
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
    if (backdrop) {
        backdrop.classList.remove('is-visible');
    }
    var TRANSITION_MS = 300;
    setTimeout(function () {
        modal.hidden = true;
    }, TRANSITION_MS);
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
    }
}

document.querySelectorAll('.team-image-stack').forEach(function (stack) {
    stack.addEventListener('click', function () {
        stack.classList.toggle('team-image-stack--overlay-visible');
    });
    stack.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            stack.classList.toggle('team-image-stack--overlay-visible');
        }
    });
});

document.querySelectorAll('.team-roles [class^="role-"]').forEach(function (chip) {
    chip.setAttribute('role', 'button');
    chip.setAttribute('tabindex', '0');
});

var container = document.querySelector('.team-container');
if (container) {
    container.addEventListener('click', function (ev) {
        var chip = ev.target.closest('.team-roles [class^="role-"]');
        if (!chip) {
            return;
        }
        var content = getRoleContent(chip);
        if (!content) {
            return;
        }
        ev.preventDefault();
        openModal(content);
    });

    container.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter' && ev.key !== ' ') {
            return;
        }
        var chip = ev.target.closest('.team-roles [class^="role-"]');
        if (!chip || !container.contains(chip)) {
            return;
        }
        var content = getRoleContent(chip);
        if (!content) {
            return;
        }
        ev.preventDefault();
        openModal(content);
    });
}

if (backdrop) {
    backdrop.addEventListener('click', closeModal);
}
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) {
        closeModal();
    }
});