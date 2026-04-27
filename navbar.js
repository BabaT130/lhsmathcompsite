(() => {
    const links = [
        { href: '/', label: 'Home' },
        {
            label: 'About',
            items: [
                { href: '/about_lmo/', label: 'About LMO' },
                { href: '/our_team/', label: 'Our Team' },
                { href: '/sponsors/', label: 'Sponsors' }
            ]
        },
        { href: '/logistics/', label: 'Logistics' },
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

    function itemContainsCurrent(item, currentPath) {
        if (item.href && isCurrentLink(item.href, currentPath)) {
            return true;
        }

        if (!item.items) {
            return false;
        }

        return item.items.some((child) => itemContainsCurrent(child, currentPath));
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function renderItems(items, currentPath, depth = 0) {
        return items.map((item) => renderItem(item, currentPath, depth)).join('');
    }

    function renderItem(item, currentPath, depth) {
        const isCurrent = itemContainsCurrent(item, currentPath);
        const classNames = [];

        if (item.className) {
            classNames.push(item.className);
        }
        if (isCurrent) {
            classNames.push('current');
        }

        if (item.items?.length) {
            classNames.push('nav-folder');
            const folderButtonClasses = ['nav-folder-toggle'];
            if (item.className) {
                folderButtonClasses.push(item.className);
            }
            if (isCurrent) {
                folderButtonClasses.push('current');
            }

            const levelAttr = ` data-nav-level="${depth}"`;
            const itemClassAttr = classNames.length ? ` class="${classNames.join(' ')}"` : '';
            const buttonClassAttr = ` class="${folderButtonClasses.join(' ')}"`;
            const expandedAttr = isCurrent ? 'true' : 'false';

            return `
                <li${itemClassAttr}${levelAttr}>
                    <button type="button"${buttonClassAttr} aria-expanded="${expandedAttr}">
                        <span>${escapeHtml(item.label)}</span>
                        <span class="nav-folder-arrow" aria-hidden="true"></span>
                    </button>
                    <ul class="nav-submenu">
                        ${renderItems(item.items, currentPath, depth + 1)}
                    </ul>
                </li>
            `;
        }

        const classAttr = classNames.length ? ` class="${classNames.join(' ')}"` : '';
        return `
            <li data-nav-level="${depth}">
                <a href="${item.href}"${classAttr}>${escapeHtml(item.label)}</a>
            </li>
        `;
    }

    function renderNavbar() {
        const mount = document.getElementById('site-navbar');
        if (!mount) {
            return;
        }

        const currentPath = normalizePath(window.location.pathname);
        const linkHtml = renderItems(links, currentPath);

        mount.innerHTML = `
            <nav class="navbar fixed">
                <a class="logo" href="/">
                    <img src="/assets/logo.svg" alt="LMO Logo">
                </a>
                <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-links">
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

        const folderItems = Array.from(navLinks.querySelectorAll('.nav-folder'));
        const mobileQuery = window.matchMedia('(max-width: 820px)');

        function setOpen(isOpen) {
            if (mobileQuery.matches) {
                navLinks.classList.remove('scroll-ready');
            }
            navLinks.classList.toggle('is-open', isOpen);
            toggle.setAttribute('aria-expanded', String(isOpen));
        }

        navLinks.addEventListener('transitionend', (event) => {
            if (!mobileQuery.matches || event.target !== navLinks || event.propertyName !== 'max-height') {
                return;
            }

            navLinks.classList.toggle('scroll-ready', navLinks.classList.contains('is-open'));
        });

        function setFolderOpen(folder, isOpen, options = {}) {
            const { animate = true } = options;
            const button = folder.querySelector('.nav-folder-toggle');
            const submenu = folder.querySelector(':scope > .nav-submenu');
            if (!button || !submenu) {
                return;
            }

            const isMobile = mobileQuery.matches;
            const isAlreadyOpen = folder.classList.contains('is-open');

            if (!isMobile) {
                submenu.style.height = '';
                submenu.style.overflow = '';
                submenu.style.transition = '';
                folder.classList.toggle('is-open', isOpen);
                button.setAttribute('aria-expanded', String(isOpen));
                return;
            }

            button.setAttribute('aria-expanded', String(isOpen));

            if (!animate) {
                folder.classList.toggle('is-open', isOpen);
                submenu.style.overflow = 'hidden';
                submenu.style.transition = '';
                submenu.style.height = isOpen ? 'auto' : '0px';
                return;
            }

            if (isOpen === isAlreadyOpen) {
                submenu.style.height = isOpen ? 'auto' : '0px';
                return;
            }

            submenu.style.overflow = 'hidden';
            submenu.style.transition = 'height 220ms ease';

            if (isOpen) {
                folder.classList.add('is-open');
                submenu.style.height = '0px';
                const endHeight = submenu.scrollHeight;
                submenu.offsetHeight;
                requestAnimationFrame(() => {
                    submenu.style.height = `${endHeight}px`;
                });
                return;
            }

            const startHeight = submenu.scrollHeight;
            submenu.style.height = `${startHeight}px`;
            submenu.offsetHeight;
            requestAnimationFrame(() => {
                submenu.style.height = '0px';
            });
            folder.classList.remove('is-open');
        }

        folderItems.forEach((folder) => {
            const submenu = folder.querySelector(':scope > .nav-submenu');
            if (!submenu) {
                return;
            }

            submenu.addEventListener('transitionend', (event) => {
                if (event.propertyName !== 'height' || !mobileQuery.matches) {
                    return;
                }

                if (folder.classList.contains('is-open')) {
                    submenu.style.height = 'auto';
                }
            });
        });

        function closeFolders(exceptFolder = null) {
            folderItems.forEach((folder) => {
                if (folder !== exceptFolder) {
                    setFolderOpen(folder, false);
                }
            });
        }

        function closeUnrelatedFolders(activeFolder) {
            folderItems.forEach((folder) => {
                const shouldKeepOpen =
                    folder === activeFolder ||
                    folder.contains(activeFolder) ||
                    activeFolder.contains(folder);

                if (!shouldKeepOpen) {
                    setFolderOpen(folder, false);
                }
            });
        }

        function syncFolderStateForViewport() {
            if (mobileQuery.matches) {
                folderItems.forEach((folder) => {
                    const shouldOpen = folder.classList.contains('current');
                    setFolderOpen(folder, shouldOpen, { animate: false });
                });
                return;
            }

            navLinks.classList.remove('scroll-ready');
            folderItems.forEach((folder) => {
                const submenu = folder.querySelector(':scope > .nav-submenu');
                if (submenu) {
                    submenu.style.height = '';
                    submenu.style.overflow = '';
                    submenu.style.transition = '';
                }
            });
            closeFolders();
        }

        toggle.addEventListener('click', () => {
            const isOpen = !navLinks.classList.contains('is-open');
            setOpen(isOpen);
            if (!isOpen) {
                closeFolders();
            } else {
                syncFolderStateForViewport();
            }
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                setOpen(false);
                closeFolders();
            });
        });

        folderItems.forEach((folder) => {
            const button = folder.querySelector('.nav-folder-toggle');
            if (!button) {
                return;
            }

            button.addEventListener('click', (event) => {
                event.stopPropagation();
                const isMobile = mobileQuery.matches;
                const nextOpenState = !folder.classList.contains('is-open');

                if (!isMobile) {
                    if (nextOpenState) {
                        closeUnrelatedFolders(folder);
                    }
                }

                setFolderOpen(folder, nextOpenState);
            });
        });

        document.addEventListener('click', (event) => {
            if (!mount.contains(event.target)) {
                setOpen(false);
                closeFolders();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
                closeFolders();
            }
        });

        window.addEventListener('resize', syncFolderStateForViewport);
        syncFolderStateForViewport();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNavbar);
    } else {
        renderNavbar();
    }
})();
