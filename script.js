document.addEventListener('DOMContentLoaded', () => {
    // ── Theme Switcher with localStorage memory ──
    const themeSwitch = document.getElementById('themeSwitch');
    const htmlElement = document.documentElement;

    // Check saved theme preference or default to dark
    const savedTheme = localStorage.getItem('portfolio_theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
    }

    themeSwitch.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio_theme', newTheme);
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

    // ── Contact Form (AJAX, no redirect) ──
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async (e) => {
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