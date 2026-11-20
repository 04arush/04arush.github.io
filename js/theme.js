/*
 * Site-wide theme. Loaded in <head> (not deferred) so the right theme is set
 * before the page paints.
 *
 * The preference is kept in three places so every page agrees:
 *  1. localStorage: normal case (served over http/https, e.g. GitHub Pages).
 *  2. window.name:  survives navigation, refresh and Back in the same tab.
 *  3. ?theme= on internal links: only when opened from disk (file://), where
 *     browsers like Firefox give each file its own separate localStorage.
 */
(function () {
    var KEY = 'portfolio_theme';
    var root = document.documentElement;
    var isFile = location.protocol === 'file:';

    function valid(t) { return t === 'light' || t === 'dark' ? t : null; }

    function fromName() {
        var m = /(?:^|;)portfolio_theme=(light|dark)(?:;|$)/.exec(window.name || '');
        return m ? m[1] : null;
    }

    function fromStorage() {
        try { return valid(localStorage.getItem(KEY)); } catch (e) { return null; }
    }

    function fromURL() {
        try {
            var url = new URL(location.href);
            var t = valid(url.searchParams.get('theme'));
            if (url.searchParams.has('theme')) {
                url.searchParams.delete('theme');
                history.replaceState(history.state, '', url.toString());
            }
            return t;
        } catch (e) { return null; }
    }

    function save(t) {
        try { localStorage.setItem(KEY, t); } catch (e) { /* ignore */ }
        try {
            var rest = (window.name || '').split(';').filter(function (p) {
                return p && p.indexOf(KEY + '=') !== 0;
            });
            rest.push(KEY + '=' + t);
            window.name = rest.join(';');
        } catch (e) { /* ignore */ }
    }

    function current() {
        return fromName() || fromStorage() || 'dark';
    }

    function apply(t) { root.setAttribute('data-theme', t); }

    function set(t) {
        t = valid(t) || 'dark';
        apply(t);
        save(t);
    }

    // Initial theme: a handed-over value wins, then this tab, then storage.
    set(fromURL() || current());

    // Back/Forward restores pages without re-running scripts.
    window.addEventListener('pageshow', function () { apply(current()); });

    // Other tabs changed it (only fires where storage is shared).
    window.addEventListener('storage', function (e) {
        if (e.key === KEY) set(fromStorage() || 'dark');
    });

    // From disk only: carry the theme across links to the site's own pages.
    if (isFile) {
        document.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a[href]');
            if (!a) return;
            try {
                var url = new URL(a.href, location.href);
                if (url.protocol !== 'file:' || !/\.html?$/i.test(url.pathname)) return;
                url.searchParams.set('theme', root.getAttribute('data-theme') || 'dark');
                a.href = url.toString();
            } catch (err) { /* ignore */ }
        }, true);
    }

    window.SiteTheme = { get: function () { return root.getAttribute('data-theme'); }, set: set };
})();
