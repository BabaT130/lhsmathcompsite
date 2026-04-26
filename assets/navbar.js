(() => {
    const links = [
        { href: '/', label: 'Home' },
        { href: '/about_us/', label: 'About' },
        { href: '/logistics/', label: 'Logistics' },
        { href: '/sponsors/', label: 'Sponsors' },
        { href: '/our_team/', label: 'Team' },
        { href: '/resources/', label: 'Resources' },
        { href: '/faq/', label: 'FAQ' },
        { href: '/signup/', label: 'Sign Up', className: 'signup' }
    ];

    function normalizePath(path) {
        if (!path) {
            return '/';
        }

        return path.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
    }

    function isCurrentLink(href, currentPath) {
        const normalizedHref = normalizePath(href);
        if (normalizedHref === '/') {
            return currentPath === '/';
        }

        return currentPath === normalizedHref || currentPath.startsWith(normalizedHref + '/');
    }

    function renderNavbar() {
        const mount = document.getElementById('site-navbar');
        if (!mount) {
            return;
        }

        const currentPath = normalizePath(window.location.pathname);
        const linkHtml = links.map((link) => {
            const classes = [];
            if (link.className) {
                classes.push(link.className);
            }
            if (isCurrentLink(link.href, currentPath)) {
                classes.push('current');
            }

            const classAttr = classes.length ? ` class="${classes.join(' ')}"` : '';
            return `<li><a href="${link.href}"${classAttr}>${link.label}</a></li>`;
        }).join('');

        mount.innerHTML = `
            <nav class="navbar fixed">
                <a class="logo" href="/">
                    <img src="/assets/logo.svg" alt="LMO Logo">
                </a>
                <button class="nav-toggle" type="button">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 6h16"></path>
                        <path d="M4 12h16"></path>
                        <path d="M4 18h16"></path>
                    </svg>
                    <span class="nav-toggle-label">Menu</span>
                </button>
                <ul id="primary-links" class="nav-links">
                    ${linkHtml}
                </ul>
            </nav>
            <div class="nav-filler"></div>
            <div class="dev-banner">
                <span class="dev-banner-text"><strong>Notice:</strong> Website in progress, some pages may be incomplete, and information is subject to change.</span>
                <span class="dev-banner-close" tabindex="0">&times;</span>
            </div>
        `;

        const toggle = mount.querySelector('.nav-toggle');
        const navLinks = mount.querySelector('.nav-links');
        if (!toggle || !navLinks) {
            return;
        }

        function setOpen(isOpen) {
            navLinks.classList.toggle('is-open', isOpen);
        }

        toggle.addEventListener('click', () => {
            setOpen(!navLinks.classList.contains('is-open'));
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => setOpen(false));
        });

        document.addEventListener('click', (event) => {
            if (!mount.contains(event.target)) {
                setOpen(false);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNavbar);
    } else {
        renderNavbar();
    }
})();
