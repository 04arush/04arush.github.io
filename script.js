document.addEventListener('DOMContentLoaded', () => {
    // ── Theme toggle (state handled by theme.js) ──
    const themeSwitch = document.getElementById('themeSwitch');
    themeSwitch.addEventListener('click', () => {
        window.SiteTheme.set(window.SiteTheme.get() === 'dark' ? 'light' : 'dark');
    });

    // ── Resume Popup Dropdown ──
    const resumeToggleBtn = document.getElementById('resumeToggleBtn');
    const resumePopup = document.getElementById('resumePopup');

    resumeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resumePopup.classList.toggle('show');
    });

    window.addEventListener('click', () => {
        if (resumePopup.classList.contains('show')) {
            resumePopup.classList.remove('show');
        }
    });

    // ── Mobile Hamburger Menu (<= 900px) ──
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const header = document.querySelector('header');

    // Keep the menu pinned right under the header, whatever its height is
    const syncHeaderHeight = () => {
        document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    };
    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight);

    const setMenu = (open) => {
        mobileMenu.classList.toggle('open', open);
        menuToggle.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    };

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        resumePopup.classList.remove('show');
        syncHeaderHeight();
        setMenu(!mobileMenu.classList.contains('open'));
    });

    // Opening the resume dropdown closes the menu
    resumeToggleBtn.addEventListener('click', () => setMenu(false));

    // Close after tapping a link, tapping outside, pressing Esc, or widening past 900px
    mobileMenu.addEventListener('click', (e) => {
        if (e.target.closest('a')) setMenu(false);
    });
    window.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target)) setMenu(false);
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenu(false);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) setMenu(false);
    });

    // ── Header shadow once the page scrolls ──
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Highlight the nav link of the section in view (home page) ──
    const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]')];
    const spySections = [...new Set(navLinks.map((a) => a.getAttribute('href')))]
        .map((h) => document.querySelector(h)).filter(Boolean);
    if (spySections.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((en) => {
                if (!en.isIntersecting) return;
                const id = '#' + en.target.id;
                navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === id));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        spySections.forEach((sec) => spy.observe(sec));
    }

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── Contact Form (AJAX, no redirect) ──
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Sending...';
        formStatus.className = 'form-status';
        formStatus.textContent = '';

        try {
            const res = await fetch(contactForm.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(contactForm)
            });
            if (res.ok) {
                formStatus.textContent = "Message sent! I'll get back to you soon.";
                formStatus.classList.add('success');
                contactForm.reset();
            } else {
                throw new Error('Request failed');
            }
        } catch (err) {
            formStatus.textContent = 'Could not send. Please try again or email 04arush@gmail.com.';
            formStatus.classList.add('error');
        } finally {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    });
});