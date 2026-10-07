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

    // ── Contact Form Interaction Support ──
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        // Form submits directly via Web3Forms/Formspree action configured in HTML
    });
});
