(() => {
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
})();
