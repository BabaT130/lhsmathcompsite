(() => {
    function initHomeBackground() {
        const sponsorsSection = document.getElementById('sponsors-thanks');
        if (!sponsorsSection) {
            return;
        }

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
