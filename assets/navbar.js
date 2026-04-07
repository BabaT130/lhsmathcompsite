(() => {
    const navbarHtml = `
    <nav class="navbar fixed">
        <div class="logo">
            <a href="/"><img src="/assets/logo.svg" alt="LMO Logo"></a>
        </div>
        <ul class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/competition_resources/">Resources</a></li>
            <li><a href="/about_us/">About Us</a></li>
            <li><a href="/sponsors/">Sponsors</a></li>
            <li><a href="/our_team/">Our Team</a></li>
            <li><a class="signup" href="/signup/">SIGN UP</a></li>
        </ul>
    </nav>
    <div class="nav-filler"></div>
    <div class="dev-banner">
        <span class="dev-banner-text">Website in progress: some pages may be incomplete.</span>
        <span class="dev-banner-close" role="button" tabindex="0">&times;</span>
    </div>
    `;

    function renderNavbar() {
        const mount = document.getElementById("site-navbar");
        if (!mount) return;
        mount.innerHTML = navbarHtml;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", renderNavbar);
    } else {
        renderNavbar();
    }
})();
