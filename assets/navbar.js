(() => {
    const navbarHtml = `
    <nav class="navbar fixed">
        <div class="logo">
            <a href="index.html"><img src="assets/logo.svg" alt="LMAO Logo"></a>
        </div>
        <ul class="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="about_us/">About Us</a></li>
            <li><a href="competition_resources/">Competition Resources</a></li>
            <li><a href="our_team/">Our Team</a></li>
            <li><a class="signup" href="/signup/">SIGN UP</a></li>
        </ul>
    </nav>
    <div class="nav-filler"></div>
    <div class="dev-banner">
        Website in progress: some pages may be incomplete.
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
