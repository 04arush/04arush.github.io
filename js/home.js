/*
 * Home page renderer. Builds every section from data/profile.js.
 * Each section is one function in SECTIONS, keyed by its id in
 * PORTFOLIO.sections; order and numbering follow that list.
 */
(() => {
    const P = window.PORTFOLIO;
    const I = window.ICONS;
    const root = document.getElementById('home');
    if (!P || !root) return;

    // ── Helpers ───────────────────────────────────────────
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
    const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>'); // **bold** only
    const pad = (n) => String(n).padStart(2, '0');
    const ext = (url, label, cls = '') =>
        `<a href="${esc(url)}" class="${cls}" target="_blank" rel="noopener">${label}</a>`;
    const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
    const current = P.experience.find((e) => !e.end) || null;

    // Tab strip + panels; behaviour is wired up in initTabs().
    function tabs(name, items) {
        return `
            <div class="tabs" data-tabs="${name}">
                <div class="tab-list" role="tablist" aria-label="${esc(name)}">
                    ${items.map((t, i) => `
                        <button type="button" role="tab" id="${name}-tab-${i}" aria-controls="${name}-panel-${i}"
                            aria-selected="${t.selected ? 'true' : 'false'}" tabindex="${t.selected ? 0 : -1}">
                            ${esc(t.label)}${t.badge != null ? `<span class="tab-badge">${esc(t.badge)}</span>` : ''}
                        </button>`).join('')}
                </div>
                ${items.map((t, i) => `
                    <div class="tab-panel" role="tabpanel" id="${name}-panel-${i}" aria-labelledby="${name}-tab-${i}"
                        ${t.selected ? '' : 'hidden'}>${t.body}</div>`).join('')}
            </div>`;
    }

    // ── Hero ──────────────────────────────────────────────
    function hero() {
        const p = P.profile;
        const studying = p.education.field || p.education.degree;
        const json = [
            ['name', p.name],
            current && ['role', current.role],
            current && ['company', current.org],
            ['roles', p.rolesShort || p.roles],
            ['based_in', p.location],
            ['studying', studying],
            ['latest_post', '…', 'latestPost']
        ].filter(Boolean);

        const val = (v, id) => Array.isArray(v)
            ? `[${v.map((x) => `<span class="j-str">"${esc(x)}"</span>`).join(', ')}]`
            : `<span class="j-str"${id ? ` id="${id}"` : ''}>"${esc(v)}"</span>`;
        const body = json.map(([k, v, id], i) =>
            `  <span class="j-key">"${k}"</span>: ${val(v, id)}${i < json.length - 1 ? ',' : ''}`).join('\n');

        const stats = [
            { n: `${P.projects.length}${P.moreProjects ? '+' : ''}`, label: 'Projects', href: '#projects' },
            { n: P.hackathons.length, label: 'Hackathons', href: '#projects' },
            { n: P.certifications.length, label: 'Certifications', href: '#skills' },
            { n: '—', label: 'Blog posts', href: '#writing', id: 'statPosts' }
        ];

        return `
            <section class="hero" id="top">
                <div class="container hero-grid">
                    <div class="hero-content">
                        <div class="hero-greeting">${esc(p.greeting)}</div>
                        <h1 class="hero-name">${esc(p.name)}</h1>
                        <div class="hero-roles">${p.roles.map((r) => `<span class="role-badge">${esc(r)}</span>`).join('')}</div>
                        <p class="hero-desc">${md(p.intro)}</p>
                        <div class="hero-actions">
                            <a href="#projects" class="btn btn-primary">See My Work</a>
                            <a href="#contact" class="btn btn-secondary">Contact Me</a>
                        </div>
                        <div class="social-links">
                            ${P.socials.map((s) => `<a href="${esc(s.url)}" class="social-icon-link" aria-label="${esc(s.label)}" ${s.id === 'email' ? '' : 'target="_blank" rel="noopener"'}>${I[s.id] || ''}</a>`).join('')}
                        </div>
                    </div>
                    <div class="hero-card" aria-label="Profile summary">
                        <div class="hero-card-bar">
                            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                            <span class="hero-card-file">~/arush/profile.json</span>
                        </div>
                        <pre class="hero-code"><code>{\n${body}\n}</code></pre>
                    </div>
                </div>
                <div class="container">
                    <div class="hero-stats">
                        ${stats.map((s) => `
                            <a class="hero-stat" href="${s.href}">
                                <b${s.id ? ` id="${s.id}"` : ''}>${esc(s.n)}</b><span>${esc(s.label)}</span>
                            </a>`).join('')}
                    </div>
                </div>
            </section>`;
    }

    // ── Sections ──────────────────────────────────────────
    const SECTIONS = {
        about() {
            const p = P.profile;
            const facts = [
                current && { icon: 'briefcase', label: 'Currently', value: `${current.role}`, sub: `${current.org} · since ${current.start}` },
                { icon: 'pin', label: 'Based in', value: p.location },
                { icon: 'cap', label: 'Studying', value: p.education.degree, sub: `${p.education.school} (${p.education.period})` }
            ].filter(Boolean);
            return `
                <div class="about-grid">
                    <div class="card about-card"><p class="about-text">${md(p.about)}</p></div>
                    <ul class="fact-list">
                        ${facts.map((f) => `
                            <li class="card fact">
                                <span class="fact-icon">${I[f.icon]}</span>
                                <div>
                                    <div class="fact-label">${esc(f.label)}</div>
                                    <div class="fact-value">${esc(f.value)}</div>
                                    ${f.sub ? `<div class="fact-sub">${esc(f.sub)}</div>` : ''}
                                </div>
                            </li>`).join('')}
                    </ul>
                </div>`;
        },

        experience() {
            return `
                <ol class="xp-list">
                    ${P.experience.map((x) => `
                        <li class="card xp">
                            <div class="xp-when">
                                <span class="xp-date">${esc(x.start)} – ${esc(x.end || 'Present')}</span>
                                ${!x.end ? '<span class="pill pill-live"><i></i>Current</span>' : ''}
                                <span class="xp-meta">${x.meta.map(esc).join(' · ')}</span>
                            </div>
                            <div class="xp-body">
                                <h3 class="xp-role">${esc(x.role)}
                                    ${x.orgUrl ? ext(x.orgUrl, `<span>@ ${esc(x.org)}</span> ${I.ext}`, 'xp-org') : `<span class="xp-org">@ ${esc(x.org)}</span>`}
                                </h3>
                                <ul class="xp-points">${x.points.map((pt) => `<li>${md(pt)}</li>`).join('')}</ul>
                                <div class="chips">${x.stack.map((t) => `<span class="chip-static">${esc(t)}</span>`).join('')}</div>
                            </div>
                        </li>`).join('')}
                </ol>`;
        },

        projects() {
            const cats = {};
            P.projects.forEach((p) => p.categories.forEach((c) => { cats[c] = (cats[c] || 0) + 1; }));
            const project = (p) => `
                <article class="card project-card" data-cats="${esc(p.categories.join('|'))}" data-stack="${esc(p.stack.join('|'))}">
                    <div class="project-top">
                        <div class="project-cats">${p.categories.map((c) => `<span class="project-badge">${esc(c)}</span>`).join('')}</div>
                        ${p.repo ? `<a href="${esc(p.repo)}" class="github-svg-link" target="_blank" rel="noopener" aria-label="${esc(p.title)} on GitHub">${I.github}</a>` : ''}
                    </div>
                    <h3 class="project-title">${p.repo ? ext(p.repo, esc(p.title)) : esc(p.title)}</h3>
                    ${p.date ? `<div class="card-date">${esc(p.date)}</div>` : ''}
                    <p class="project-desc">${md(p.desc)}</p>
                    <div class="chips">${p.stack.map((t) => `<button type="button" class="stack-chip" data-tech="${esc(t)}" title="Show projects using ${esc(t)}">${esc(t)}</button>`).join('')}</div>
                </article>`;

            const hack = (h) => `
                <article class="card hack-card">
                    <h4>${esc(h.name)}</h4>
                    ${h.org || h.date ? `<div class="card-date">${[h.org, h.date].filter(Boolean).map(esc).join(' · ')}</div>` : ''}
                    <p>${md(h.desc)}</p>
                    <span class="pill">${esc(h.result)}</span>
                </article>`;

            const os = (o) => `
                <article class="card hack-card">
                    <h4>${o.url ? ext(o.url, esc(o.title)) : esc(o.title)}</h4>
                    <p>${md(o.desc || '')}</p>
                    ${o.repo ? `<span class="pill">${esc(o.repo)}</span>` : ''}
                </article>`;

            return `
                <div class="filter-bar" id="projectFilters">
                    <div class="chip-row" role="group" aria-label="Filter projects by category">
                        <button type="button" class="chip active" data-cat="">All <span>${P.projects.length}</span></button>
                        ${Object.entries(cats).map(([c, n]) => `<button type="button" class="chip" data-cat="${esc(c)}">${esc(c)} <span>${n}</span></button>`).join('')}
                    </div>
                    <div class="filter-status" aria-live="polite">
                        <span id="projectCount"></span>
                        <button type="button" class="chip chip-clear" id="techClear" hidden></button>
                    </div>
                </div>
                <div class="projects-grid" id="projectGrid">${P.projects.map(project).join('')}</div>
                <p class="blog-empty" id="projectEmpty" hidden>No projects match this filter.</p>
                ${P.moreProjects ? `
                    <div class="more-row">
                        ${ext(P.moreProjects.url, `${I.github} ${esc(P.moreProjects.label)} ${I.ext}`, 'btn btn-secondary more-btn')}
                    </div>` : ''}

                ${P.hackathons.length ? `
                    <h3 class="sub-heading">Hackathons</h3>
                    <div class="hack-grid">${P.hackathons.map(hack).join('')}</div>` : ''}
                ${P.openSource?.length ? `
                    <h3 class="sub-heading">Open Source</h3>
                    <div class="hack-grid">${P.openSource.map(os).join('')}</div>` : ''}`;
        },

        skills() {
            const skillTabs = P.skills.map((g, i) => ({
                label: g.short || g.group,
                badge: g.core.length + g.more.length,
                selected: i === 0,
                body: `
                    <h3 class="panel-title">${esc(g.group)}</h3>
                    <div class="skill-tags-flex">
                        ${g.core.map((t) => `<span class="skill-tag highlight">${esc(t)}</span>`).join('')}
                        ${g.more.map((t) => `<span class="skill-tag">${esc(t)}</span>`).join('')}
                    </div>
                    <p class="legend"><span class="skill-tag highlight">core</span> primary stack</p>`
            }));
            return `
                <div class="skills-grid">
                    <div class="card skills-card">${tabs('skills', skillTabs)}</div>
                    <div class="card cert-card-wrap">
                        <div class="cert-head">
                            <h3 class="panel-title">Certifications</h3>
                            <span class="muted-mono">${plural(P.certifications.length, 'credential')}</span>
                        </div>
                        <ol class="cert-list">
                            ${P.certifications.map((c) => `
                                <li class="cert-row">
                                    <span class="cert-date">${esc(c.date)}</span>
                                    <div class="cert-info">
                                        <h4>${esc(c.title)}</h4>
                                        <span>${esc(c.issuer)}</span>
                                    </div>
                                    ${c.url ? ext(c.url, `Verify ${I.ext}`, 'cert-link') : ''}
                                </li>`).join('')}
                        </ol>
                    </div>
                </div>`;
        },

        writing() {
            return `
                <div id="blogHome" class="blog-home">
                    <div class="blog-loading" aria-hidden="true">
                        <div class="skeleton skeleton-card"></div>
                        <div class="skeleton-stack">
                            <div class="skeleton skeleton-row"></div>
                            <div class="skeleton skeleton-row"></div>
                            <div class="skeleton skeleton-row"></div>
                        </div>
                    </div>
                </div>`;
        },

        roadmap() {
            const STATUS = { done: 'Completed', ongoing: 'In progress', upcoming: 'Up next' };
            const active = Math.max(0, P.roadmaps.findIndex((r) => r.phases.some((ph) => ph.status === 'ongoing')));
            const items = P.roadmaps.map((r, i) => {
                const done = r.phases.filter((ph) => ph.status === 'done').length;
                const pct = Math.round((done / r.phases.length) * 100);
                return {
                    label: r.short || r.track,
                    badge: `${done}/${r.phases.length}`,
                    selected: i === active,
                    body: `
                        <div class="road-head">
                            <h3 class="panel-title">${esc(r.track)}</h3>
                            <div class="road-progress">
                                <div class="series-progress-bar"><span style="width:${pct}%"></span></div>
                                <span class="muted-mono">${done} of ${r.phases.length} phases complete</span>
                            </div>
                        </div>
                        <ol class="phase-grid">
                            ${r.phases.map((ph, j) => `
                                <li class="phase phase-${esc(ph.status)}">
                                    <div class="phase-top">
                                        <span class="phase-no">Phase ${j + 1}</span>
                                        <span class="phase-status"><i></i>${STATUS[ph.status] || ''}</span>
                                    </div>
                                    <h4>${esc(ph.title)}</h4>
                                    <p>${esc(ph.desc)}</p>
                                </li>`).join('')}
                        </ol>`
                };
            });
            return `<div class="card road-card">${tabs('roadmap', items)}</div>`;
        },

        contact() {
            const c = P.contact;
            return `
                <div class="contact-grid">
                    <div class="contact-info-side">
                        <h3>${esc(c.heading)}</h3>
                        <p>${md(c.text)}</p>
                        <div class="contact-direct-links">
                            ${P.socials.map((s) => `
                                <a href="${esc(s.url)}" class="contact-direct-item" ${s.id === 'email' ? '' : 'target="_blank" rel="noopener"'}>
                                    <span class="contact-icon">${I[s.id] || ''}</span>
                                    <span><small>${esc(s.label)}</small>${esc(s.handle)}</span>
                                </a>`).join('')}
                        </div>
                    </div>
                    <div class="card contact-form-card">
                        <form id="contactForm" action="${esc(c.formAction)}" method="POST">
                            <input type="hidden" name="_subject" value="${esc(c.formSubject)}">
                            <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="name">Your Name</label>
                                    <input type="text" id="name" name="name" class="form-control" required placeholder="${esc(c.placeholders.name)}">
                                </div>
                                <div class="form-group">
                                    <label for="email">Your Email</label>
                                    <input type="email" id="email" name="email" class="form-control" required placeholder="${esc(c.placeholders.email)}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="message">Your Message</label>
                                <textarea id="message" name="message" class="form-control" required placeholder="${esc(c.placeholders.message)}"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Send Message</button>
                            <div id="formStatus" class="form-status" role="status"></div>
                        </form>
                    </div>
                </div>`;
        }
    };

    // ── Render ────────────────────────────────────────────
    const shell = (s, n, body) => `
        <section id="${esc(s.id)}" class="section">
            <div class="container">
                <div class="section-head">
                    <div class="section-title">${pad(n)}. ${esc(s.kicker)}</div>
                    <h2 class="section-heading">${esc(s.title)}</h2>
                </div>
                ${body}
            </div>
        </section>`;

    let n = 0;
    root.innerHTML = hero() + P.sections
        .filter((s) => SECTIONS[s.id])
        .map((s) => shell(s, ++n, SECTIONS[s.id]()))
        .join('');

    // ── Behaviour ─────────────────────────────────────────
    function initTabs() {
        root.querySelectorAll('[data-tabs]').forEach((box) => {
            const tabsEls = [...box.querySelectorAll('[role="tab"]')];
            const panels = [...box.querySelectorAll('[role="tabpanel"]')];
            const select = (i, focus) => {
                tabsEls.forEach((t, j) => {
                    t.setAttribute('aria-selected', String(i === j));
                    t.tabIndex = i === j ? 0 : -1;
                });
                panels.forEach((p, j) => { p.hidden = i !== j; });
                if (focus) tabsEls[i].focus();
            };
            tabsEls.forEach((t, i) => {
                t.addEventListener('click', () => select(i));
                t.addEventListener('keydown', (e) => {
                    const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
                    if (!k) return;
                    e.preventDefault();
                    select((i + k + tabsEls.length) % tabsEls.length, true);
                });
            });
        });
    }

    function initProjectFilter() {
        const bar = document.getElementById('projectFilters');
        if (!bar) return;
        const cards = [...document.querySelectorAll('#projectGrid .project-card')];
        const count = document.getElementById('projectCount');
        const clear = document.getElementById('techClear');
        const empty = document.getElementById('projectEmpty');
        const state = { cat: '', tech: '' };

        const draw = () => {
            let shown = 0;
            cards.forEach((c) => {
                const ok = (!state.cat || c.dataset.cats.split('|').includes(state.cat))
                    && (!state.tech || c.dataset.stack.split('|').includes(state.tech));
                c.hidden = !ok;
                if (ok) shown++;
                c.querySelectorAll('.stack-chip').forEach((b) => b.classList.toggle('active', b.dataset.tech === state.tech));
            });
            bar.querySelectorAll('[data-cat]').forEach((b) => b.classList.toggle('active', b.dataset.cat === state.cat));
            count.textContent = shown === cards.length ? `${plural(cards.length, 'project')}` : `${shown} of ${cards.length} projects`;
            clear.hidden = !state.tech;
            clear.innerHTML = state.tech ? `Stack: ${esc(state.tech)} <span aria-hidden="true">✕</span>` : '';
            clear.setAttribute('aria-label', `Clear stack filter ${state.tech}`);
            empty.hidden = shown > 0;
        };

        bar.addEventListener('click', (e) => {
            const b = e.target.closest('button');
            if (!b) return;
            if (b.hasAttribute('data-cat')) state.cat = b.dataset.cat;
            if (b === clear) state.tech = '';
            draw();
        });
        document.getElementById('projectGrid').addEventListener('click', (e) => {
            const b = e.target.closest('.stack-chip');
            if (!b) return;
            state.tech = state.tech === b.dataset.tech ? '' : b.dataset.tech;
            draw();
        });
        draw();
    }

    // Live numbers from the blog (dev.to): post count + latest post in the hero card.
    function initBlogStats() {
        const stat = document.getElementById('statPosts');
        const latest = document.getElementById('latestPost');
        if (!window.BlogStore) return;
        window.BlogStore.then(({ model }) => {
            if (stat) stat.textContent = model.posts.length;
            const p = model.posts[0];
            if (latest) {
                if (!p) { latest.closest('code') && (latest.textContent = '"coming soon"'); return; }
                latest.outerHTML = `<a class="j-str j-link" href="${esc(p.url)}" target="_blank" rel="noopener">"${esc(p.title)}"</a>`;
            }
        }).catch(() => { /* leave placeholders */ });
    }

    initTabs();
    initProjectFilter();
    initBlogStats();
})();
