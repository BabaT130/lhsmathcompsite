(() => {
    let balanceFrame = 0;

    function createLogoCard(entry, isMono) {
        const link = document.createElement('a');
        link.className = `sponsor-logo-card hover-card${isMono ? ' sponsor-logo-card--mono' : ''}`;
        link.href = entry.website || '#';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const logo = document.createElement('img');
        logo.className = 'sponsor-logo';
        logo.src = entry.logo || '';
        logo.alt = entry.name ? `${entry.name} logo` : 'Sponsor logo';
        logo.loading = 'lazy';

        link.appendChild(logo);
        return link;
    }

    function createDetailCard(entry) {
        const card = document.createElement('article');
        card.className = 'sponsor-card hover-card';

        const media = document.createElement('div');
        media.className = 'sponsor-card-media';

        const logo = document.createElement('img');
        logo.className = 'sponsor-logo';
        logo.src = entry.logo || '';
        logo.alt = entry.name ? `${entry.name} logo` : 'Sponsor logo';
        logo.loading = 'lazy';
        media.appendChild(logo);

        const body = document.createElement('div');
        body.className = 'sponsor-card-body';

        const title = document.createElement('h3');
        title.textContent = entry.name || '';
        body.appendChild(title);

        const tagline = document.createElement('p');
        tagline.className = 'sponsor-tagline';
        tagline.textContent = entry.tagline || '';
        body.appendChild(tagline);

        if (entry.website) {
            const link = document.createElement('a');
            link.href = entry.website;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = entry.displayUrl || entry.website;
            body.appendChild(link);
        }

        card.appendChild(media);
        card.appendChild(body);
        return card;
    }

    function getBalancedRowSizes(totalCards, maxPerRow) {
        const rowCount = Math.max(1, Math.ceil(totalCards / maxPerRow));
        const baseRowSize = Math.floor(totalCards / rowCount);
        let remainder = totalCards % rowCount;

        return Array.from({ length: rowCount }, () => {
            const size = baseRowSize + (remainder > 0 ? 1 : 0);
            if (remainder > 0) {
                remainder -= 1;
            }

            return size;
        });
    }

    function getSponsorCardWidth(target, cards) {
        const styles = getComputedStyle(target);
        const configuredWidth = Number.parseFloat(styles.getPropertyValue('--sponsor-logo-card-width'));
        if (Number.isFinite(configuredWidth) && configuredWidth > 0) {
            return configuredWidth;
        }

        const firstCard = cards[0];
        return firstCard ? firstCard.getBoundingClientRect().width : 170;
    }

    function balanceLogoGrid(target) {
        if (target.dataset.sponsorView !== 'logo') {
            return;
        }

        const cards = Array.from(target.querySelectorAll('.sponsor-logo-card'));
        if (!cards.length) {
            return;
        }

        const targetWidth = target.clientWidth || target.getBoundingClientRect().width;
        const styles = getComputedStyle(target);
        const gap = Number.parseFloat(styles.columnGap || styles.gap) || 18;
        const cardWidth = getSponsorCardWidth(target, cards);
        const maxPerRow = Math.max(1, Math.floor((targetWidth + gap) / (cardWidth + gap)));
        const rowSizes = getBalancedRowSizes(cards.length, maxPerRow);
        const fragment = document.createDocumentFragment();

        let cardIndex = 0;
        rowSizes.forEach((rowSize) => {
            const row = document.createElement('div');
            row.className = 'sponsor-logo-row';

            for (let index = 0; index < rowSize && cardIndex < cards.length; index += 1) {
                row.appendChild(cards[cardIndex]);
                cardIndex += 1;
            }

            fragment.appendChild(row);
        });

        target.replaceChildren(fragment);
    }

    function balanceLogoGrids() {
        document.querySelectorAll('[data-sponsor-view="logo"]').forEach(balanceLogoGrid);
    }

    function scheduleLogoGridBalance() {
        if (balanceFrame) {
            cancelAnimationFrame(balanceFrame);
        }

        balanceFrame = requestAnimationFrame(() => {
            balanceFrame = 0;
            balanceLogoGrids();
        });
    }

    function renderSponsors(entries) {
        const targets = document.querySelectorAll('[data-sponsor-view]');
        targets.forEach((target) => {
            target.innerHTML = '';
            const fragment = document.createDocumentFragment();
            const isDetailView = target.dataset.sponsorView === 'detail';
            const isMono = target.dataset.sponsorTone === 'mono';

            entries.forEach((entry) => {
                fragment.appendChild(isDetailView ? createDetailCard(entry) : createLogoCard(entry, isMono));
            });

            target.appendChild(fragment);
        });

        scheduleLogoGridBalance();
    }

    function showSponsorError() {
        const targets = document.querySelectorAll('[data-sponsor-view]');
        targets.forEach((target) => {
            target.innerHTML = '<p class="sponsor-loading">Unable to load sponsors right now.</p>';
        });
    }

    async function loadSponsors() {
        const targets = document.querySelectorAll('[data-sponsor-view]');
        if (!targets.length) {
            return;
        }

        try {
            const response = await fetch('/sponsors/sponsors_data.json', { cache: 'no-store' });
            if (!response.ok) {
                throw new Error('Failed to load sponsor data.');
            }

            const data = await response.json();
            const entries = Array.isArray(data.entries) ? data.entries : [];
            renderSponsors(entries);
        } catch (error) {
            console.error(error);
            showSponsorError();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSponsors);
    } else {
        loadSponsors();
    }

    window.addEventListener('resize', scheduleLogoGridBalance);
})();
