(() => {
    const sponsorRevealIntroSelector = '.home-sponsor-heading, .home-sponsor-copy';
    const sponsorRevealVisibleViewportRatio = 0.5;
    const sponsorRevealBottomTolerance = 2;
    const sponsorCardSelector = '.sponsor-logo-card';

    let sponsorRevealFrame = 0;

    function getSponsorIntroTargets(section) {
        return Array.from(section.querySelectorAll(sponsorRevealIntroSelector));
    }

    function getSponsorCardTargets(section) {
        return Array.from(section.querySelectorAll(sponsorCardSelector));
    }

    function getSponsorPreviousTargets(section) {
        const targets = [];
        let current = section.previousElementSibling;

        while (current) {
            targets.unshift(current);

            if (current.tagName.toLowerCase() === 'section') {
                return targets;
            }

            current = current.previousElementSibling;
        }

        return [];
    }

    function applySponsorVisibility(section) {
        const isVisible = section.dataset.sponsorVisible === 'true';
        requestAnimationFrame(() => {
            getSponsorIntroTargets(section).forEach((item) => {
                item.classList.toggle('is-visible', isVisible);
            });

            getSponsorCardTargets(section).forEach((item) => {
                item.classList.toggle('is-visible', isVisible);
            });

            getSponsorPreviousTargets(section).forEach((item) => {
                item.classList.toggle('is-hidden', isVisible);
            });
        });
    }

    function syncSponsorReveal(section) {
        const introItems = getSponsorIntroTargets(section);
        introItems.forEach((item, index) => {
            item.classList.add('sponsor-fly-in');
            item.style.setProperty('--sponsor-reveal-delay', `${index * 110}ms`);
        });

        const logoCards = getSponsorCardTargets(section);
        logoCards.forEach((card, index) => {
            const delay = 220 + Math.min(index * 65, 585);
            card.style.setProperty('--sponsor-reveal-delay', `${delay}ms`);
        });

        getSponsorPreviousTargets(section).forEach((item, index) => {
            item.classList.add('sponsor-previous-fly-away');
            item.style.setProperty('--sponsor-hide-delay', `${index * 45}ms`);
        });

        applySponsorVisibility(section);
    }

    function setSponsorsVisible(section, isVisible) {
        const nextState = isVisible ? 'true' : 'false';
        if (section.dataset.sponsorVisible === nextState) {
            return;
        }

        section.dataset.sponsorVisible = nextState;
        applySponsorVisibility(section);
    }

    function shouldRevealSponsors(section) {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const visibleViewportHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
        const hasVisibleViewportTrigger = visibleViewportHeight >= viewportHeight * sponsorRevealVisibleViewportRatio;
        const reachedScrollBottom = window.scrollY + viewportHeight >= document.documentElement.scrollHeight - sponsorRevealBottomTolerance;

        return hasVisibleViewportTrigger || reachedScrollBottom;
    }

    function updateSponsorReveal(section) {
        setSponsorsVisible(section, shouldRevealSponsors(section));
    }

    function scheduleSponsorRevealUpdate(section) {
        if (sponsorRevealFrame) {
            cancelAnimationFrame(sponsorRevealFrame);
        }

        sponsorRevealFrame = requestAnimationFrame(() => {
            sponsorRevealFrame = 0;
            updateSponsorReveal(section);
        });
    }

    function initHomeBackground() {
        const sponsorsSection = document.getElementById('sponsors-thanks');
        if (!sponsorsSection) {
            return;
        }

        sponsorsSection.classList.add('home-sponsor-animate');
        sponsorsSection.dataset.sponsorVisible = 'false';
        syncSponsorReveal(sponsorsSection);
        document.addEventListener('sponsors:updated', () => {
            syncSponsorReveal(sponsorsSection);
        });

        window.addEventListener('scroll', () => {
            scheduleSponsorRevealUpdate(sponsorsSection);
        }, { passive: true });

        window.addEventListener('resize', () => {
            scheduleSponsorRevealUpdate(sponsorsSection);
        });

        scheduleSponsorRevealUpdate(sponsorsSection);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const isActive = entry.isIntersecting && entry.intersectionRatio >= 0.18;
                document.body.classList.toggle('home-sponsor-mode', isActive);
            });
        }, {
            threshold: [0, 0.18, 0.45]
        });

        observer.observe(sponsorsSection);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHomeBackground);
    } else {
        initHomeBackground();
    }
})();
