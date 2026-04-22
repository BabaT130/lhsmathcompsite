(() => {
    const sponsorRevealIntroSelector = '.home-sponsor-heading, .home-sponsor-copy, .home-sponsor-grid-shell';
    const sponsorRevealTriggerRatio = 0.82;

    let sponsorRevealFrame = 0;
    let lastScrollY = window.scrollY;

    function getSponsorRevealTargets(section) {
        return Array.from(section.querySelectorAll(`${sponsorRevealIntroSelector}, .sponsor-logo-card`));
    }

    function applySponsorVisibility(section) {
        const isVisible = section.dataset.sponsorVisible === 'true';
        requestAnimationFrame(() => {
            getSponsorRevealTargets(section).forEach((item) => {
                item.classList.toggle('is-visible', isVisible);
            });
        });
    }

    function syncSponsorReveal(section) {
        const introItems = Array.from(section.querySelectorAll(sponsorRevealIntroSelector));
        introItems.forEach((item, index) => {
            item.classList.add('sponsor-fly-in');
            item.style.setProperty('--sponsor-reveal-delay', `${index * 110}ms`);
        });

        const logoCards = Array.from(section.querySelectorAll('.sponsor-logo-card'));
        logoCards.forEach((card, index) => {
            const delay = 220 + Math.min(index * 65, 585);
            card.style.setProperty('--sponsor-reveal-delay', `${delay}ms`);
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

    function updateSponsorReveal(section, forcedDirection = 0) {
        const currentScrollY = window.scrollY;
        const scrollDirection = forcedDirection || Math.sign(currentScrollY - lastScrollY);
        const triggerY = window.innerHeight * sponsorRevealTriggerRatio;
        const sectionTop = section.getBoundingClientRect().top;
        const hasPassedTrigger = sectionTop <= triggerY;

        lastScrollY = currentScrollY;

        if (scrollDirection === 0) {
            setSponsorsVisible(section, hasPassedTrigger);
            return;
        }

        if (scrollDirection > 0 && hasPassedTrigger) {
            setSponsorsVisible(section, true);
            return;
        }

        if (scrollDirection < 0 && !hasPassedTrigger) {
            setSponsorsVisible(section, false);
        }
    }

    function scheduleSponsorRevealUpdate(section, forcedDirection = 0) {
        if (sponsorRevealFrame) {
            cancelAnimationFrame(sponsorRevealFrame);
        }

        sponsorRevealFrame = requestAnimationFrame(() => {
            sponsorRevealFrame = 0;
            updateSponsorReveal(section, forcedDirection);
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
