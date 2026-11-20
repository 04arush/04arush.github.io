/*
 * Shared layout: header, mobile menu and footer, built from data/profile.js.
 * Include this as the first thing inside <body> (not deferred) so the header
 * is in place before the page paints. <body data-page="home|blog"> decides
 * how nav links are built.
 */
(() => {
    const P = window.PORTFOLIO;
    const I = window.ICONS;
    const page = document.body.dataset.page || 'home';
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    const navItems = P.sections.filter((s) => s.nav).map((s) => {
        const isCurrentPage = s.page && page !== 'home' && s.page.startsWith(page);
        const href = page === 'home' ? `#${s.id}` : (s.page && isCurrentPage ? s.page : `index.html#${s.id}`);
        return { label: s.nav, href, current: isCurrentPage };
    });

    const link = (n) => `<a href="${esc(n.href)}"${n.current ? ' class="active" aria-current="page"' : ''}>${esc(n.label)}</a>`;
    const homeHref = page === 'home' ? '#top' : 'index.html';

    const header = `
        <header class="site-header" id="siteHeader">
            <div class="nav-container">
                <a href="${homeHref}" class="logo">${esc(P.site.logo.text)}<span>${esc(P.site.logo.accent)}</span></a>
                <nav class="nav-links" aria-label="Main">${navItems.map(link).join('')}</nav>
                <div class="nav-right">
                    <div class="resume-dropdown-wrapper">
                        <button class="resume-btn" id="resumeToggleBtn" type="button" aria-haspopup="true" aria-expanded="false">
                            Resume ${I.chevron}
                        </button>
                        <div class="resume-popup" id="resumePopup">
                            ${P.site.resumes.map((r) => `<a href="${esc(r.file)}" target="_blank" rel="noopener">${esc(r.label)}</a>`).join('')}
                        </div>
                    </div>
                    <button class="icon-btn theme-switch" id="themeSwitch" type="button" aria-label="Toggle theme">${I.sun}${I.moon}</button>
                    <button class="icon-btn menu-toggle" id="menuToggle" type="button" aria-label="Toggle navigation menu"
                        aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span></button>
                </div>
            </div>
        </header>
        <nav class="mobile-menu" id="mobileMenu" aria-label="Mobile">${navItems.map(link).join('')}</nav>`;

    document.currentScript.insertAdjacentHTML('beforebegin', header);

    // Footer: rendered once the rest of the page has been parsed.
    document.addEventListener('DOMContentLoaded', () => {
        const year = new Date().getFullYear();
        const socials = P.socials.map((s) =>
            `<a href="${esc(s.url)}" class="social-icon-link" aria-label="${esc(s.label)}" ${s.id === 'email' ? '' : 'target="_blank" rel="noopener"'}>${I[s.id] || ''}</a>`).join('');
        document.body.insertAdjacentHTML('beforeend', `
            <footer class="site-footer">
                <div class="container footer-inner">
                    <div class="footer-brand">
                        <a href="${homeHref}" class="logo">${esc(P.site.logo.text)}<span>${esc(P.site.logo.accent)}</span></a>
                        <p>${esc(P.profile.roles.join(' · '))}</p>
                    </div>
                    <nav class="footer-nav" aria-label="Footer">${navItems.map(link).join('')}</nav>
                    <div class="social-links">${socials}</div>
                </div>
                <div class="container footer-base">© ${year} ${esc(P.profile.name)}</div>
            </footer>`);
    });
})();
