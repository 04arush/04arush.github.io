/* Site-wide behaviour shared by every page. Loaded at the end of <body>. */
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('siteHeader');
    const resumeBtn = document.getElementById('resumeToggleBtn');
    const resumePopup = document.getElementById('resumePopup');
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    // ── Theme toggle (state handled by theme.js) ──
    document.getElementById('themeSwitch').addEventListener('click', () => {
        window.SiteTheme.set(window.SiteTheme.get() === 'dark' ? 'light' : 'dark');
    });

    // ── Resume dropdown ──
    const setResume = (open) => {
        resumePopup.classList.toggle('show', open);
        resumeBtn.setAttribute('aria-expanded', String(open));
    };
    resumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setMenu(false);
        setResume(!resumePopup.classList.contains('show'));
    });

    // ── Mobile menu (<= 900px) ──
    const syncHeaderHeight = () =>
        document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight);

    function setMenu(open) {
        mobileMenu.classList.toggle('open', open);
        menuToggle.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    }
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        setResume(false);
        syncHeaderHeight();
        setMenu(!mobileMenu.classList.contains('open'));
    });
    mobileMenu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

    window.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target)) setMenu(false);
        if (!resumePopup.contains(e.target)) setResume(false);
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { setMenu(false); setResume(false); }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) setMenu(false); });

    // ── Header shadow once scrolled ──
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Highlight the nav link for the section in view (same-page links only) ──
    const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]')];
    const sections = [...new Set(navLinks.map((a) => a.getAttribute('href')))]
        .map((h) => document.querySelector(h)).filter(Boolean);
    if (sections.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (!en.isIntersecting) return;
                const id = '#' + en.target.id;
                navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((s) => spy.observe(s));
    }

    // ── Contact form (AJAX, no redirect) ──
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if (form) form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const label = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Sending...';
        status.className = 'form-status';
        status.textContent = '';
        try {
            const res = await fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form)
            });
            if (!res.ok) throw new Error('Request failed');
            status.textContent = "Message sent! I'll get back to you soon.";
            status.classList.add('success');
            form.reset();
        } catch {
            const email = (window.PORTFOLIO?.socials || []).find((s) => s.id === 'email')?.handle || '';
            status.textContent = `Could not send. Please try again${email ? ` or email ${email}` : ''}.`;
            status.classList.add('error');
        } finally {
            btn.disabled = false;
            btn.textContent = label;
        }
    });
});
