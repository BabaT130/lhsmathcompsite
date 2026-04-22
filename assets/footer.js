(() => {
    const footerHtml = `
    <style>
        .lmo-footer {
            width: min(var(--page-width), calc(100% - 32px));
            margin: 0 auto 24px;
            padding: 26px 28px;
            border-radius: 28px;
            border: 1px solid rgba(49, 55, 140, 0.08);
            background:
                radial-gradient(circle at top right, rgba(217, 39, 46, 0.08), transparent 30%),
                radial-gradient(circle at bottom left, rgba(49, 55, 140, 0.1), transparent 28%),
                rgba(255, 255, 255, 0.84);
            box-shadow: 0 18px 40px rgba(30, 35, 80, 0.1);
            -webkit-backdrop-filter: blur(14px);
            backdrop-filter: blur(14px);
        }

        .lmo-footer-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            flex-wrap: wrap;
        }

        .lmo-footer-left {
            display: flex;
            align-items: center;
            gap: 14px;
            min-width: 0;
        }

        .lmo-footer-logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.94);
            border: 1px solid rgba(49, 55, 140, 0.08);
        }

        .lmo-footer-logo img {
            width: 42px;
            height: 42px;
            display: block;
        }

        .lmo-footer-text {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .lmo-footer-name {
            font-size: 1rem;
            font-weight: 800;
            color: #161b45;
        }

        .lmo-footer-hosted {
            font-size: 0.92rem;
            color: rgba(33, 38, 93, 0.76);
        }

        .lmo-footer-right {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .lmo-footer-icon-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border-radius: 999px;
            border: 1px solid rgba(49, 55, 140, 0.1);
            background: rgba(255, 255, 255, 0.92);
            color: var(--accent-red);
            text-decoration: none;
            transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
        }

        .lmo-footer-icon-btn svg {
            width: 24px;
            height: 24px;
            display: block;
            stroke: currentColor;
        }

        .lmo-footer-icon-btn:hover {
            transform: translateY(-2px);
            color: var(--accent-blue);
            border-color: rgba(217, 39, 46, 0.2);
            box-shadow: 0 14px 28px rgba(49, 55, 140, 0.12);
        }

        .lmo-footer-sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        @media (max-width: 820px) {
            .lmo-footer {
                width: min(100%, calc(100% - 20px));
                padding: 22px 20px;
                border-radius: 24px;
            }
        }

        @media (max-width: 560px) {
            .lmo-footer-inner {
                align-items: flex-start;
            }

            .lmo-footer-right {
                width: 100%;
            }
        }
    </style>

    <footer class="lmo-footer">
        <div class="lmo-footer-inner">
            <div class="lmo-footer-left">
                <a class="lmo-footer-logo" href="/">
                    <img src="/assets/logo.svg" alt="LMO logo">
                </a>
                <div class="lmo-footer-text">
                    <a href="/" style="text-decoration: none;">
                        <span class="lmo-footer-name">Lynbrook Math Open</span>
                    </a>
                    <span class="lmo-footer-hosted">Hosted by the Lynbrook Math Club</span>
                </div>
            </div>
            <div class="lmo-footer-right">
                <a class="lmo-footer-icon-btn" href="mailto:lynbrookmath@gmail.com">
                    <span class="lmo-footer-sr-only">Email</span>
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 7.5h16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" stroke-width="1.5" stroke-linejoin="round"></path>
                        <path d="M4 8.5 12 13.5 20 8.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </a>
                <a class="lmo-footer-icon-btn" href="https://discord.gg/wjQ6ejfmvm">
                    <span class="lmo-footer-sr-only">Discord</span>
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M8.3 7.2A13.8 13.8 0 0 1 12 6.7a13.8 13.8 0 0 1 3.7.5" stroke-width="1.5" stroke-linecap="round"></path>
                        <path d="M8.2 17.1a18.8 18.8 0 0 1-1.3 1.5c-3-.3-4.4-2.4-4.4-2.4A18.7 18.7 0 0 1 4.7 7.3 8.7 8.7 0 0 1 9.1 5.6l.5 1.2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M15.8 17.1a18.8 18.8 0 0 0 1.3 1.5c3-.3 4.4-2.4 4.4-2.4a18.7 18.7 0 0 0-2.2-8.9 8.7 8.7 0 0 0-4.4-1.7l-.5 1.2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="M9.1 11.4a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6ZM14.9 11.4a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6Z" stroke-width="1.5" stroke-linejoin="round"></path>
                        <path d="M6.5 15.4a13.3 13.3 0 0 0 5.5 1.2 13.3 13.3 0 0 0 5.5-1.2" stroke-width="1.5" stroke-linecap="round"></path>
                    </svg>
                </a>
            </div>
        </div>
    </footer>
    `;

    function renderFooter() {
        const mount = document.getElementById('site-footer');
        if (!mount) {
            return;
        }

        mount.innerHTML = footerHtml;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderFooter);
    } else {
        renderFooter();
    }
})();
