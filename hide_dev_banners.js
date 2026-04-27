(() => {
    const CONFIG_URL = "/assets/dev_banners.json";
    const DEFAULT_CONFIG = {
        enabled: true,
        animationMs: 550,
        hideAfterMs: 0,
        hideAfterDate: 0,
        color: "#2e9ad9"
    };

    const DEFAULT_BANNER = {
        enabled: true,
        messageText: "",
        color: DEFAULT_CONFIG.color,
        animationMs: DEFAULT_CONFIG.animationMs,
        hideAfterMs: DEFAULT_CONFIG.hideAfterMs,
        hideAfterDate: DEFAULT_CONFIG.hideAfterDate,
        pages: null
    };

    function parsePositiveNumber(value) {
        if (value === null || value === undefined || value === "") {
            return 0;
        }

        const n = Number(value);
        if (!Number.isFinite(n) || n <= 0) {
            return 0;
        }

        return n;
    }

    function parseOptionalDateMs(value) {
        if (value === null || value === undefined || value === "" || value === 0 || value === "0") {
            return 0;
        }

        const ms = new Date(value).getTime();
        if (!Number.isFinite(ms)) {
            return 0;
        }

        return ms;
    }

    function normalizePath(path) {
        if (typeof path !== "string") {
            return "";
        }

        const trimmed = path.trim();
        if (!trimmed) {
            return "";
        }

        const withoutQuery = trimmed.split(/[?#]/, 1)[0] || "";
        if (!withoutQuery) {
            return "";
        }

        const withLeadingSlash = withoutQuery.startsWith("/") ? withoutQuery : "/" + withoutQuery;
        if (withLeadingSlash === "/") {
            return "/";
        }

        return withLeadingSlash.replace(/\/+$/, "");
    }

    function matchesCurrentPage(pages) {
        if (pages === null || pages === undefined || pages === "") {
            return true;
        }

        const currentPath = normalizePath(window.location.pathname);
        const pageList = Array.isArray(pages) ? pages : [pages];

        return pageList.some(function (page) {
            return normalizePath(page) === currentPath;
        });
    }

    function hideBanner(el, durationMs) {
        if (getComputedStyle(el).display === "none") return;

        const cs = getComputedStyle(el);
        const h = el.offsetHeight;
        const easing = "cubic-bezier(0.22, 1, 0.36, 1)";
        const fadeMs = Math.max(180, Math.round(durationMs * 0.58));
        const collapseMs = Math.max(180, durationMs - fadeMs);
        el.style.overflow = "hidden";
        el.style.maxHeight = h + "px";
        el.style.paddingTop = cs.paddingTop;
        el.style.paddingBottom = cs.paddingBottom;
        el.style.borderBottomWidth = cs.borderBottomWidth;
        el.style.borderBottomStyle = cs.borderBottomStyle;
        el.style.borderBottomColor = cs.borderBottomColor;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        el.style.filter = "blur(0)";
        el.style.transformOrigin = "center top";
        el.style.willChange = "max-height, padding-top, padding-bottom, border-bottom-width, opacity, transform, filter";
        el.style.transition =
            "opacity " + fadeMs / 1000 + "s ease-out, transform " +
            fadeMs / 1000 +
            "s " + easing + ", filter " +
            fadeMs / 1000 +
            "s ease-out";

        void el.offsetHeight;

        requestAnimationFrame(function () {
            el.style.opacity = "0";
            el.style.transform = "translateY(-14px)";
            el.style.filter = "blur(2px)";
        });

        let finished = false;
        let fallback = null;
        let collapseTimer = null;
        function cleanup() {
            if (finished) return;
            finished = true;
            el.removeEventListener("transitionend", onEnd);
            if (fallback !== null) clearTimeout(fallback);
            if (collapseTimer !== null) clearTimeout(collapseTimer);
            el.style.display = "none";
            el.style.transition = "";
            el.style.maxHeight = "";
            el.style.overflow = "";
            el.style.paddingTop = "";
            el.style.paddingBottom = "";
            el.style.borderBottomWidth = "";
            el.style.borderBottomStyle = "";
            el.style.borderBottomColor = "";
            el.style.opacity = "";
            el.style.transform = "";
            el.style.filter = "";
            el.style.transformOrigin = "";
            el.style.willChange = "";
        }

        function collapseBanner() {
            if (finished) return;
            el.style.transition =
                "max-height " + collapseMs / 1000 + "s " + easing + ", padding-top " +
                collapseMs / 1000 +
                "s " + easing + ", padding-bottom " +
                collapseMs / 1000 +
                "s " + easing + ", border-bottom-width " +
                collapseMs / 1000 +
                "s " + easing;

            void el.offsetHeight;

            requestAnimationFrame(function () {
                el.style.maxHeight = "0";
                el.style.paddingTop = "0";
                el.style.paddingBottom = "0";
                el.style.borderBottomWidth = "0";
            });
        }

        function onEnd(e) {
            if (e.target !== el) return;
            if (e.propertyName !== "max-height") return;
            cleanup();
        }

        el.addEventListener("transitionend", onEnd);
        collapseTimer = setTimeout(collapseBanner, fadeMs);
        fallback = setTimeout(cleanup, fadeMs + collapseMs + 120);
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function parseHexColor(hex) {
        if (typeof hex !== "string") return null;
        const clean = hex.trim().replace(/^#/, "");
        if (clean.length !== 3 && clean.length !== 6) return null;

        const expanded = clean.length === 3
            ? clean.split("").map(function (ch) { return ch + ch; }).join("")
            : clean;

        const n = Number.parseInt(expanded, 16);
        if (!Number.isFinite(n)) return null;

        return {
            r: (n >> 16) & 255,
            g: (n >> 8) & 255,
            b: n & 255
        };
    }

    function parseRgbColor(rgbLike) {
        if (typeof rgbLike !== "string") return null;
        const match = rgbLike.trim().match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i);
        if (!match) return null;

        return {
            r: clamp(Number(match[1]), 0, 255),
            g: clamp(Number(match[2]), 0, 255),
            b: clamp(Number(match[3]), 0, 255)
        };
    }

    function parseBaseColor(value) {
        return parseHexColor(value) || parseRgbColor(value);
    }

    function mixRgb(a, b, t) {
        return {
            r: Math.round(a.r + (b.r - a.r) * t),
            g: Math.round(a.g + (b.g - a.g) * t),
            b: Math.round(a.b + (b.b - a.b) * t)
        };
    }

    function toRgba(rgb, alpha) {
        return "rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + alpha + ")";
    }

    function getBannerConfigs(config) {
        if (Array.isArray(config.banners) && config.banners.length > 0) {
            return config.banners
                .filter(function (entry) {
                    return entry && typeof entry === "object";
                })
                .map(function (entry) {
                    return {
                        ...DEFAULT_BANNER,
                        ...entry
                    };
                });
        }

        return [DEFAULT_BANNER];
    }

    function ensureBannerStack(existingBanners) {
        if (!existingBanners.length) {
            return null;
        }

        const first = existingBanners[0];
        let stack = first.parentElement && first.parentElement.classList.contains("dev-banner-stack")
            ? first.parentElement
            : null;

        if (!stack) {
            stack = document.createElement("div");
            stack.className = "dev-banner-stack";
            stack.style.display = "flex";
            stack.style.flexDirection = "column";
            stack.style.gap = "2px";
            stack.style.alignItems = "stretch";
            first.parentNode.insertBefore(stack, first);
        }

        return stack;
    }

    function applyConfigToBanner(banner, config) {
        const textEl = banner.querySelector(".dev-banner-text");
        const closeEl = banner.querySelector(".dev-banner-close");
        const base = parseBaseColor(config.color || DEFAULT_CONFIG.color);
        const white = { r: 255, g: 255, b: 255 };
        const dark = base ? mixRgb(base, { r: 25, g: 25, b: 25 }, 0.25) : null;
        const soft = base ? mixRgb(base, white, 0.84) : null;
        const soft2 = base ? mixRgb(base, white, 0.92) : null;
        const closeBg = base ? mixRgb(base, white, 0.88) : null;
        const closeBgHover = base ? mixRgb(base, { r: 70, g: 70, b: 70 }, 0.28) : null;

        if (typeof config.messageHtml === "string" && textEl) {
            textEl.innerHTML = config.messageHtml;
        } else if (typeof config.messageText === "string" && textEl) {
            textEl.textContent = config.messageText;
        }

        if (!base || !textEl || !closeEl) {
            return;
        }

        banner.style.color = toRgba(dark, 0.96);
        textEl.style.color = toRgba(dark, 0.96);
        textEl.style.background = "linear-gradient(180deg, " + toRgba(soft, 0.95) + ", " + toRgba(soft2, 0.95) + ")";
        textEl.style.borderColor = toRgba(base, 0.4);

        closeEl.style.color = toRgba(mixRgb(base, { r: 90, g: 90, b: 90 }, 0.45), 0.95);
        closeEl.style.background = toRgba(closeBg, 0.95);
        closeEl.style.borderColor = toRgba(base, 0.4);

        closeEl.addEventListener("mouseenter", function () {
            closeEl.style.color = "rgba(255, 250, 249, 0.98)";
            closeEl.style.background = toRgba(closeBgHover, 0.5);
            closeEl.style.borderColor = toRgba(base, 0.9);
        });

        closeEl.addEventListener("mouseleave", function () {
            closeEl.style.color = toRgba(mixRgb(base, { r: 90, g: 90, b: 90 }, 0.45), 0.95);
            closeEl.style.background = toRgba(closeBg, 0.9);
            closeEl.style.borderColor = toRgba(base, 0.4);
        });

        closeEl.addEventListener("focus", function () {
            closeEl.style.color = "rgba(255, 250, 249, 0.98)";
            closeEl.style.background = toRgba(closeBgHover, 0.5);
            closeEl.style.borderColor = toRgba(base, 0.9);
        });

        closeEl.addEventListener("blur", function () {
            closeEl.style.color = toRgba(mixRgb(base, { r: 90, g: 90, b: 90 }, 0.45), 0.95);
            closeEl.style.background = toRgba(closeBg, 0.9);
            closeEl.style.borderColor = toRgba(base, 0.4);
        });
    }

    function scheduleHideAtDate(banner, hideAtMs, durationMs) {
        const delay = hideAtMs - Date.now();
        if (delay <= 0) {
            hideBanner(banner, durationMs);
            return;
        }

        const MAX_DELAY = 2147483647;
        if (delay > MAX_DELAY) {
            setTimeout(function () {
                scheduleHideAtDate(banner, hideAtMs, durationMs);
            }, MAX_DELAY);
            return;
        }

        setTimeout(function () {
            hideBanner(banner, durationMs);
        }, delay);
    }

    async function loadConfig() {
        try {
            const response = await fetch(CONFIG_URL, { cache: "no-store" });
            if (!response.ok) {
                return DEFAULT_CONFIG;
            }

            const fileConfig = await response.json();
            if (!fileConfig || typeof fileConfig !== "object") {
                return DEFAULT_CONFIG;
            }

            return {
                ...DEFAULT_CONFIG,
                ...fileConfig
            };
        } catch (_err) {
            return DEFAULT_CONFIG;
        }
    }

    async function init() {
        const config = await loadConfig();
        const existingBanners = Array.from(document.querySelectorAll(".dev-banner"));
        const stack = ensureBannerStack(existingBanners);

        if (!stack || !existingBanners.length) {
            return;
        }

        const template = existingBanners[0].cloneNode(true);
        existingBanners.forEach(function (banner) {
            banner.remove();
        });

        if (config.enabled === false) {
            stack.style.display = "none";
            return;
        }

        stack.style.display = "flex";

        const bannerConfigs = getBannerConfigs(config);
        stack.innerHTML = "";

        let renderedBannerCount = 0;

        bannerConfigs.forEach(function (bannerConfig) {
            if (bannerConfig.enabled === false) {
                return;
            }

            if (!matchesCurrentPage(bannerConfig.pages)) {
                return;
            }

            const hideAfterDateMs = parseOptionalDateMs(bannerConfig.hideAfterDate);
            if (hideAfterDateMs > 0 && hideAfterDateMs <= Date.now()) {
                return;
            }

            const banner = template.cloneNode(true);
            const durationMs = parsePositiveNumber(bannerConfig.animationMs) || DEFAULT_CONFIG.animationMs;
            const hideAfterMs = parsePositiveNumber(bannerConfig.hideAfterMs);

            applyConfigToBanner(banner, bannerConfig);
            banner.setAttribute("data-animation-ms", String(durationMs));
            stack.appendChild(banner);
            renderedBannerCount += 1;

            if (hideAfterMs > 0) {
                setTimeout(function () {
                    hideBanner(banner, durationMs);
                }, hideAfterMs);
            }

            if (hideAfterDateMs > 0) {
                scheduleHideAtDate(banner, hideAfterDateMs, durationMs);
            }
        });

        if (renderedBannerCount === 0) {
            stack.style.display = "none";
        }

        function dismissFromCloseEl(closeEl) {
            const banner = closeEl.closest(".dev-banner");
            if (!banner) return;
            const bannerDuration = parsePositiveNumber(banner.getAttribute("data-animation-ms")) || DEFAULT_CONFIG.animationMs;
            hideBanner(banner, bannerDuration);
        }

        document.addEventListener("click", function (e) {
            const closeEl = e.target.closest(".dev-banner-close");
            if (!closeEl) return;
            dismissFromCloseEl(closeEl);
        });

        document.addEventListener("keydown", function (e) {
            if (e.key !== "Enter" && e.key !== " ") return;
            const closeEl = e.target.closest(".dev-banner-close");
            if (!closeEl) return;
            e.preventDefault();
            dismissFromCloseEl(closeEl);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
