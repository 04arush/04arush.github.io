/*
 * Blog renderer: pulls posts from dev.to, groups them by series, and renders
 *  - #blogHome    → the compact "Writing" section on the home page
 *  - #blogArchive → the full, filterable archive on blog.html
 * Config lives in blog-config.js.
 */
(() => {
    const CFG = window.BLOG_CONFIG || {};
    const CACHE_KEY = 'blog_cache_v1';
    const CACHE_TTL = 30 * 60 * 1000; // 30 min
    const HOME_LATEST = 3;
    const HOME_SERIES = 2;
    const SERIES_PREVIEW = 5; // parts shown per series before "show all"
    const STANDALONE = 'standalone';

    // ── Utilities ──────────────────────────────────────────────
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
    const pad = (n) => String(n).padStart(2, '0');
    const fmtDate = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const cleanDesc = (s) => String(s || '').replace(/^\s*TL;?DR:?\s*/i, '').replace(/\s+/g, ' ').trim();
    const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const storage = {
        get() {
            try { return JSON.parse(localStorage.getItem(CACHE_KEY)); } catch { return null; }
        },
        set(v) {
            try { localStorage.setItem(CACHE_KEY, JSON.stringify(v)); } catch { /* ignore */ }
        }
    };

    async function fetchJSON(url, ms = 7000) {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), ms);
        try {
            const res = await fetch(url, { signal: ctrl.signal, headers: { Accept: 'application/json' } });
            if (!res.ok) throw new Error(res.status);
            return await res.json();
        } finally {
            clearTimeout(t);
        }
    }

    // ── Data loading ──────────────────────────────────────────
    async function loadRaw() {
        const cached = storage.get();
        if (cached && Date.now() - cached.t < CACHE_TTL) return { ...cached, source: 'cache' };

        try {
            // dev.to's CDN can serve a day-old list for the same URL, and it ignores
            // unknown query params. per_page *is* part of its cache key, so rotate it
            // every 15 min (100–999) to pick up new posts quickly.
            const perPage = 100 + (Math.floor(Date.now() / 9e5) % 900);
            const articles = await fetchJSON(
                `https://dev.to/api/articles?username=${encodeURIComponent(CFG.devtoUser)}&per_page=${perPage}`
            );

            // Companion-code folders, one request per repo used by a series
            const repos = [...new Set(Object.values(CFG.series || {}).map((s) => s.repo).filter(Boolean))];
            const folders = {};
            await Promise.all(repos.map(async (repo) => {
                try {
                    const items = await fetchJSON(`https://api.github.com/repos/${CFG.githubUser}/${repo}/contents`);
                    folders[repo] = items.filter((i) => i.type === 'dir').map((i) => i.name);
                } catch {
                    folders[repo] = cached?.folders?.[repo] || [];
                }
            }));

            const fresh = { t: Date.now(), articles, folders };
            storage.set(fresh);
            return { ...fresh, source: 'live' };
        } catch {
            if (cached) return { ...cached, source: 'stale' };
            return { articles: CFG.fallback || [], folders: {}, source: 'fallback' };
        }
    }

    function buildModel({ articles, folders }) {
        const overrides = CFG.overrides || {};
        const posts = articles.map((a) => {
            const o = overrides[a.id] || {};
            return {
                id: a.id,
                title: o.title || a.title,
                url: a.url,
                date: new Date(a.published_at),
                readMin: a.reading_time_minutes || 1,
                tags: (a.tag_list || []).map((t) => String(t).toLowerCase()),
                desc: cleanDesc(o.description || a.description),
                seriesId: a.collection_id ? String(a.collection_id) : STANDALONE,
                part: null,
                codeUrl: o.codeUrl || null
            };
        }).sort((a, b) => b.date - a.date);

        const seriesMap = new Map();
        for (const p of posts) {
            if (!seriesMap.has(p.seriesId)) {
                const meta = CFG.series?.[p.seriesId] || {};
                const isStandalone = p.seriesId === STANDALONE;
                seriesMap.set(p.seriesId, {
                    id: p.seriesId,
                    standalone: isStandalone,
                    name: meta.name || (isStandalone ? 'Standalone posts' : 'Series'),
                    slug: meta.slug || (isStandalone ? STANDALONE : slugify(meta.name || `series-${p.seriesId}`)),
                    blurb: meta.blurb || '',
                    topics: meta.topics || [],
                    repo: meta.repo || null,
                    planned: meta.planned || null,
                    status: meta.status || null,
                    devtoUrl: isStandalone ? null : `https://dev.to/${CFG.devtoUser}/series/${p.seriesId}`,
                    posts: []
                });
                if (!isStandalone && !meta.name) {
                    console.info(`[blog] Unknown dev.to series ${p.seriesId}: add it to blog-config.js`);
                }
            }
            seriesMap.get(p.seriesId).posts.push(p);
        }

        for (const s of seriesMap.values()) {
            // Reading order inside a series: oldest first
            s.posts.sort((a, b) => a.date - b.date);
            if (!s.standalone) s.posts.forEach((p, i) => { p.part = i + 1; });
            s.latest = s.posts[s.posts.length - 1].date;
            s.readMin = s.posts.reduce((n, p) => n + p.readMin, 0);

            const dirs = (s.repo && folders?.[s.repo]) || [];
            for (const p of s.posts) {
                if (p.codeUrl || !p.part) continue;
                const dir = dirs.find((d) => d.startsWith(pad(p.part) + '-'));
                if (dir) p.codeUrl = `https://github.com/${CFG.githubUser}/${s.repo}/tree/HEAD/${dir}`;
            }
            s.repoUrl = s.repo ? `https://github.com/${CFG.githubUser}/${s.repo}` : null;
        }

        // Most recently active series first; standalone posts always last
        const series = [...seriesMap.values()].sort((a, b) =>
            (a.standalone - b.standalone) || (b.latest - a.latest));
        const byId = Object.fromEntries(series.map((s) => [s.id, s]));
        return { posts, series, byId };
    }

    // ── Shared fragments ──────────────────────────────────────
    const ICON_EXT = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function progressHTML(s) {
        if (s.standalone) return '';
        const n = s.posts.length;
        if (!s.planned) {
            return `<div class="series-progress-text">${n} post${n === 1 ? '' : 's'}${s.status === 'complete' ? ' · complete' : ''}</div>`;
        }
        const pct = Math.min(100, Math.round((n / s.planned) * 100));
        const done = s.status === 'complete' || n >= s.planned;
        return `
            <div class="series-progress" role="img" aria-label="${n} of ${s.planned} parts published">
                <div class="series-progress-bar"><span style="width:${pct}%"></span></div>
                <div class="series-progress-text">${n} / ${s.planned} parts${done ? ' · complete' : ' · ongoing'}</div>
            </div>`;
    }

    function seriesLinksHTML(s) {
        const links = [];
        if (s.devtoUrl) links.push(`<a href="${esc(s.devtoUrl)}" target="_blank" rel="noopener">Series on dev.to ${ICON_EXT}</a>`);
        if (s.repoUrl) links.push(`<a href="${esc(s.repoUrl)}" target="_blank" rel="noopener">Companion code ${ICON_EXT}</a>`);
        return links.length ? `<div class="series-links">${links.join('')}</div>` : '';
    }

    function postRowHTML(p, { showSeries = false, model } = {}) {
        const s = model.byId[p.seriesId];
        const marker = p.part
            ? `<div class="post-part" aria-label="Part ${p.part}">${pad(p.part)}</div>`
            : `<div class="post-part post-part-dot" aria-hidden="true"></div>`;
        const seriesTag = showSeries && !s.standalone
            ? `<span class="post-series">${esc(s.name)} · Part ${p.part}</span>` : '';
        const tags = p.tags.slice(0, 4).map((t) => `<span class="post-tag">#${esc(t)}</span>`).join('');
        const code = p.codeUrl
            ? `<a class="post-code" href="${esc(p.codeUrl)}" target="_blank" rel="noopener" aria-label="Code for ${esc(p.title)}">Code ${ICON_EXT}</a>` : '';

        return `
            <article class="post-row">
                ${marker}
                <div class="post-body">
                    ${seriesTag}
                    <h4 class="post-title"><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a></h4>
                    ${p.desc ? `<p class="post-desc">${esc(p.desc)}</p>` : ''}
                    <div class="post-meta">
                        <time datetime="${p.date.toISOString()}">${fmtDate(p.date)}</time>
                        <span>${p.readMin} min read</span>
                        ${tags ? `<span class="post-tags">${tags}</span>` : ''}
                    </div>
                </div>
                ${code ? `<div class="post-actions">${code}</div>` : ''}
            </article>`;
    }

    function statusNote(source) {
        if (source === 'fallback') return '<p class="blog-note">Couldn\'t reach dev.to, showing a saved list. Some posts may be missing.</p>';
        if (source === 'stale') return '<p class="blog-note">Couldn\'t reach dev.to, showing the last loaded list.</p>';
        return '';
    }

    // ── Home page section ─────────────────────────────────────
    function renderHome(root, model, source) {
        if (!model.posts.length) {
            root.innerHTML = '<p class="blog-empty">Posts are on the way.</p>';
            return;
        }
        const named = model.series.filter((s) => !s.standalone);
        const shownSeries = named.slice(0, HOME_SERIES);
        const moreSeries = named.length - shownSeries.length;

        const seriesCards = shownSeries.map((s) => `
            <a class="series-card" href="blog.html?series=${encodeURIComponent(s.slug)}">
                <div class="series-card-label">Series</div>
                <h3 class="series-card-title">${esc(s.name)}</h3>
                ${s.blurb ? `<p class="series-card-blurb">${esc(s.blurb)}</p>` : ''}
                ${progressHTML(s)}
                <span class="series-card-cta">Read the series →</span>
            </a>`).join('');

        root.innerHTML = `
            ${statusNote(source)}
            <div class="blog-home-grid">
                <div class="blog-home-series">
                    ${seriesCards}
                    ${moreSeries > 0 ? `<a class="blog-more-link" href="blog.html">+${moreSeries} more series →</a>` : ''}
                </div>
                <div class="blog-home-latest">
                    <h3 class="blog-col-heading">Latest posts</h3>
                    <div class="post-list">
                        ${model.posts.slice(0, HOME_LATEST).map((p) => postRowHTML(p, { showSeries: true, model })).join('')}
                    </div>
                </div>
            </div>
            <div class="blog-home-footer">
                <a href="blog.html" class="btn btn-secondary">Browse all writing →</a>
                <span class="blog-home-count">${model.posts.length} post${model.posts.length === 1 ? '' : 's'} · ${named.length} series</span>
            </div>`;
    }

    // ── Archive page ──────────────────────────────────────────
    function renderArchive(root, model, source) {
        const params = new URLSearchParams(location.search);
        const state = {
            view: params.get('view') === 'all' ? 'all' : 'series',
            series: params.get('series') || '',
            tag: params.get('tag') || '',
            q: params.get('q') || '',
            expanded: new Set()
        };
        if (state.series && !model.series.some((s) => s.slug === state.series)) state.series = '';

        // Stats
        const stats = document.getElementById('blogStats');
        if (stats) {
            const mins = model.posts.reduce((n, p) => n + p.readMin, 0);
            const named = model.series.filter((s) => !s.standalone).length;
            stats.innerHTML = `
                <div class="blog-stat"><b>${model.posts.length}</b><span>posts</span></div>
                <div class="blog-stat"><b>${named}</b><span>series</span></div>
                <div class="blog-stat"><b>${mins}</b><span>min of reading</span></div>`;
        }

        // Tag counts, most used first
        const tagCount = {};
        model.posts.forEach((p) => p.tags.forEach((t) => { tagCount[t] = (tagCount[t] || 0) + 1; }));
        const tags = Object.entries(tagCount).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

        root.innerHTML = `
            ${statusNote(source)}
            <div class="blog-controls">
                <div class="blog-controls-row">
                    <div class="view-toggle" role="tablist" aria-label="View">
                        <button type="button" role="tab" data-view="series">By series</button>
                        <button type="button" role="tab" data-view="all">All posts</button>
                    </div>
                    <label class="blog-search">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="m20 20-3.5-3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                        <input type="search" id="blogSearch" placeholder="Search posts…" aria-label="Search posts" value="${esc(state.q)}">
                    </label>
                </div>
                <div class="chip-row" aria-label="Filter by series">
                    <span class="chip-label">Series</span>
                    <button type="button" class="chip" data-series="">All</button>
                    ${model.series.map((s) => `<button type="button" class="chip" data-series="${esc(s.slug)}">${esc(s.name)}</button>`).join('')}
                </div>
                ${tags.length ? `
                <div class="chip-row" aria-label="Filter by tag">
                    <span class="chip-label">Tags</span>
                    ${tags.map(([t, n]) => `<button type="button" class="chip chip-tag" data-tag="${esc(t)}">#${esc(t)} <span>${n}</span></button>`).join('')}
                </div>` : ''}
            </div>
            <div id="blogResults" aria-live="polite"></div>`;

        const results = root.querySelector('#blogResults');
        const search = root.querySelector('#blogSearch');

        const matches = (p) => {
            const s = model.byId[p.seriesId];
            if (state.series && s.slug !== state.series) return false;
            if (state.tag && !p.tags.includes(state.tag)) return false;
            if (state.q) {
                const hay = `${p.title} ${p.desc} ${p.tags.join(' ')} ${s.name}`.toLowerCase();
                return state.q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
            }
            return true;
        };
        const filtering = () => Boolean(state.tag || state.q);

        function syncURL() {
            const p = new URLSearchParams();
            if (state.view === 'all') p.set('view', 'all');
            if (state.series) p.set('series', state.series);
            if (state.tag) p.set('tag', state.tag);
            if (state.q) p.set('q', state.q);
            const qs = p.toString();
            history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
        }

        function syncControls() {
            root.querySelectorAll('[data-view]').forEach((b) => {
                const on = b.dataset.view === state.view;
                b.classList.toggle('active', on);
                b.setAttribute('aria-selected', String(on));
            });
            root.querySelectorAll('[data-series]').forEach((b) => b.classList.toggle('active', b.dataset.series === state.series));
            root.querySelectorAll('[data-tag]').forEach((b) => b.classList.toggle('active', b.dataset.tag === state.tag));
        }

        function draw() {
            syncControls();
            syncURL();
            const visible = model.posts.filter(matches);

            if (!visible.length) {
                results.innerHTML = `
                    <div class="blog-empty">
                        No posts match${state.q ? ` “${esc(state.q)}”` : ''}${state.tag ? ` in #${esc(state.tag)}` : ''}.
                        <button type="button" class="link-btn" data-clear>Clear filters</button>
                    </div>`;
                return;
            }

            if (state.view === 'all') {
                results.innerHTML = `
                    <div class="post-list post-list-boxed">
                        ${visible.map((p) => postRowHTML(p, { showSeries: true, model })).join('')}
                    </div>`;
                return;
            }

            const visibleIds = new Set(visible.map((p) => p.id));
            results.innerHTML = model.series.map((s) => {
                const ps = s.posts.filter((p) => visibleIds.has(p.id));
                if (!ps.length) return '';
                const collapsible = !filtering() && !state.expanded.has(s.id) && ps.length > SERIES_PREVIEW;
                const shown = collapsible ? ps.slice(0, SERIES_PREVIEW) : ps;
                return `
                    <section class="series-block" id="${esc(s.slug)}">
                        <div class="series-block-head">
                            <div>
                                <div class="series-card-label">${s.standalone ? 'Posts' : 'Series'}</div>
                                <h2 class="series-block-title">${esc(s.name)}</h2>
                                ${s.blurb ? `<p class="series-block-blurb">${esc(s.blurb)}</p>` : ''}
                                ${s.topics.length ? `<div class="series-topics">${s.topics.map((t) => `<span class="project-badge">${esc(t)}</span>`).join('')}</div>` : ''}
                            </div>
                            <div class="series-block-side">
                                ${progressHTML(s)}
                                <div class="series-progress-text">${s.readMin} min total</div>
                                ${seriesLinksHTML(s)}
                            </div>
                        </div>
                        <div class="post-list">
                            ${shown.map((p) => postRowHTML(p, { model })).join('')}
                        </div>
                        ${collapsible ? `<button type="button" class="series-expand" data-expand="${esc(s.id)}">Show all ${ps.length} parts</button>` : ''}
                    </section>`;
            }).join('');
        }

        root.addEventListener('click', (e) => {
            const b = e.target.closest('button');
            if (!b) return;
            if (b.dataset.view) state.view = b.dataset.view;
            else if (b.hasAttribute('data-series')) state.series = b.dataset.series;
            else if (b.dataset.tag) state.tag = state.tag === b.dataset.tag ? '' : b.dataset.tag;
            else if (b.dataset.expand) state.expanded.add(b.dataset.expand);
            else if (b.hasAttribute('data-clear')) {
                state.tag = ''; state.q = ''; state.series = ''; search.value = '';
            } else return;
            draw();
        });

        let debounce;
        search.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => { state.q = search.value.trim(); draw(); }, 120);
        });

        draw();
        if (state.series) {
            document.getElementById(state.series)?.scrollIntoView({ block: 'start' });
        }
    }

    // ── Boot ──────────────────────────────────────────────────
    // Start loading straight away; other modules (e.g. the home page stats)
    // can await window.BlogStore for the same data.
    window.BlogStore = loadRaw().then((raw) => ({ model: buildModel(raw), source: raw.source }));

    async function boot() {
        const home = document.getElementById('blogHome');
        const archive = document.getElementById('blogArchive');
        if (!home && !archive) return;
        const { model, source } = await window.BlogStore;
        if (home) renderHome(home, model, source);
        if (archive) renderArchive(archive, model, source);
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
})();
