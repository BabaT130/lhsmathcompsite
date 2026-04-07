(() => {
    const footerHtml = `
    <style>
        .lmo-footer {
            margin-top: 40px;
            padding: 20px 16px 22px;
            background: rgba(0, 0, 0, 0.08);
            border-top: 1px solid rgba(0, 0, 0, 0.08);
        }

        .lmo-footer-inner {
            max-width: 1000px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            box-sizing: border-box;
            flex-wrap: wrap;
        }

        .lmo-footer-left {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
        }

        .lmo-footer-logo {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 54px;
            height: 54px;
            border-radius: 12px;
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
            overflow: hidden;
        }

        .lmo-footer-logo img {
            width: 45px;
            height: 45px;
            display: block;
        }

        .lmo-footer-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
            font-size: 13px;
            color: #111111;
        }

        .lmo-footer-name {
            font-weight: 700;
            letter-spacing: 0.02em;
        }

        .lmo-footer-hosted {
            color: rgba(0, 0, 0, 0.7);
        }

        .lmo-footer-right {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-left: auto;
        }

        .lmo-footer-icon-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 52px;
            height: 52px;
            border-radius: 999px;
            border: 1px solid rgba(0, 0, 0, 0.15);
            background: #ffffff;
            color: #ff0000;
            text-decoration: none;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
            transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
        }

        .lmo-footer-icon-btn svg {
            width: 32px;
            height: 32px;
            display: block;
        }

        .lmo-footer-icon-btn:hover {
            transform: scale(1.06);
            background-color: rgba(255, 0, 0, 0.05);
            border-color: rgba(255, 0, 0, 0.35);
            box-shadow: 0 10px 22px rgba(0, 0, 0, 0.16);
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

        @media (max-width: 520px) {
            .lmo-footer-inner {
                justify-content: center;
            }

            .lmo-footer-right {
                margin-left: 0;
            }
        }
    </style>

    <footer class="lmo-footer">
        <div class="lmo-footer-inner">
            <div class="lmo-footer-left">
                <div class="lmo-footer-logo">
                    <a href="/"><img src="/assets/logo.svg" alt="LMO logo"></a>
                </div>
                <div class="lmo-footer-text">
                    <a href="/" style="text-decoration: none; color: inherit;"><span class="lmo-footer-name">Lynbrook Math Open</span></a>
                    <a href="/" style="text-decoration: none; color: inherit;"><span class="lmo-footer-hosted">Hosted by the Lynbrook Math Club</span></a>
                </div>
            </div>
            <div class="lmo-footer-right">
                <a class="lmo-footer-icon-btn" href="mailto:lynbrookmath@gmail.com">
                    <span class="lmo-footer-sr-only">Email</span>
                    <svg viewBox="0 0 24 24" focusable="false">
                        <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z" fill="none" stroke=#ff0000 stroke-width="1" stroke-linejoin="round"/>
                        <path d="M4 7l8 6 8-6" fill="none" stroke=#ff0000 stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
                <a class="lmo-footer-icon-btn" href="https://discord.gg/wjQ6ejfmvm">
                    <span class="lmo-footer-sr-only">Discord</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24">
                        <defs>
                            <style>
                            .a{fill:none;stroke:#ff0000;stroke-linecap:round;stroke-linejoin:round;}
                            </style>
                        </defs>

                        <path class="a" d="M8.77,17.11A23.71,23.71,0,0,1,7.34,19C3.65,18.895,2.25,16.5,2.25,16.5A22.415,22.415,0,0,1,4.655,6.74A8.235,8.235,0,0,1,9.345,5l0.5,1.155"/>

                        <path class="a" d="M8.925,11.335a1.74,1.74,0,0,0-1.685,1.95a1.69,1.69,0,0,0,1.655,1.61a1.765,1.765,0,0,0,1.715-1.95A1.725,1.725,0,0,0,8.925,11.335Z"/>

                        <path class="a" d="M6.1,7.185a14.095,14.095,0,0,1,4.08-1.09A11.63,11.63,0,0,1,12,6a11.63,11.63,0,0,1,1.82,0.105a14.095,14.095,0,0,1,4.08,1.09m-3.735-1.045l0.5-1.155a8.235,8.235,0,0,1,4.69,1.755A22.415,22.415,0,0,1,21.75,16.5S20.35,18.895,16.66,19a23.71,23.71,0,0,1-1.43-1.905m3.23-1.45a14.815,14.815,0,0,1-4.32,1.745,10.625,10.625,0,0,1-2.14,0.2h0a10.625,10.625,0,0,1-2.14-0.2a14.815,14.815,0,0,1-4.32-1.745"/>

                        <path class="a" d="M15.075,11.335a1.74,1.74,0,0,1,1.685,1.95a1.69,1.69,0,0,1-1.655,1.61a1.765,1.765,0,0,1-1.715-1.95A1.725,1.725,0,0,1,15.075,11.335Z"/>
                    </svg>
                </a>
            </div>
        </div>
    </footer>
    `;

    function renderFooter() {
        const mount = document.getElementById("site-footer");
        if (!mount) return;
        mount.innerHTML = footerHtml;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderFooter);
    } else {
        renderFooter();
    }
})();

