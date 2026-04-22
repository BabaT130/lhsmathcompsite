(() => {
    const DURATION_MS = 550;

    function hideBanner(el) {
        if (getComputedStyle(el).display === "none") return;

        const cs = getComputedStyle(el);
        const h = el.offsetHeight;
        el.style.overflow = "hidden";
        el.style.maxHeight = h + "px";
        el.style.paddingTop = cs.paddingTop;
        el.style.paddingBottom = cs.paddingBottom;
        el.style.borderBottomWidth = cs.borderBottomWidth;
        el.style.borderBottomStyle = cs.borderBottomStyle;
        el.style.borderBottomColor = cs.borderBottomColor;
        el.style.transition =
            "max-height " + DURATION_MS / 1000 + "s ease, padding-top " +
            DURATION_MS / 1000 +
            "s ease, padding-bottom " +
            DURATION_MS / 1000 +
            "s ease, border-bottom-width " +
            DURATION_MS / 1000 +
            "s ease";

        void el.offsetHeight;

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                el.style.maxHeight = "0";
                el.style.paddingTop = "0";
                el.style.paddingBottom = "0";
                el.style.borderBottomWidth = "0";
            });
        });

        let finished = false;
        let fallback = null;
        function cleanup() {
            if (finished) return;
            finished = true;
            el.removeEventListener("transitionend", onEnd);
            if (fallback !== null) clearTimeout(fallback);
            el.style.display = "none";
            el.style.transition = "";
            el.style.maxHeight = "";
            el.style.overflow = "";
            el.style.paddingTop = "";
            el.style.paddingBottom = "";
            el.style.borderBottomWidth = "";
            el.style.borderBottomStyle = "";
            el.style.borderBottomColor = "";
        }

        function onEnd(e) {
            if (e.target !== el) return;
            if (e.propertyName !== "max-height") return;
            cleanup();
        }

        el.addEventListener("transitionend", onEnd);
        fallback = setTimeout(cleanup, DURATION_MS + 80);
    }

    function init() {
        setTimeout(function () {
            document.querySelectorAll(".dev-banner").forEach(hideBanner);
        }, 2000000);

        function dismissFromCloseEl(closeEl) {
            const banner = closeEl.closest(".dev-banner");
            if (banner) hideBanner(banner);
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
