/* ============================================================
   Arush Singh — portfolio
   Content lives here as data so the site is easy to keep up to
   date: add a project or roadmap stage by adding an object below,
   nothing else needs to change.
   ============================================================ */

/* ---------- Data: certifications ---------- */
const CERTS = [
  { name: "Noir Programming & ZK Circuits", date: "Apr 2026" },
  { name: "Fundamentals of Zero-Knowledge Proofs", date: "Mar 2026" },
  { name: "Advanced Foundry", date: "Mar 2026" },
  { name: "Foundry Fundamentals", date: "Mar 2026" },
  { name: "Rust Programming Basics", date: "Feb 2026" },
  { name: "Advanced Web3 Wallet Security", date: "Feb 2026" },
  { name: "Web3 Wallet Security Basics", date: "Feb 2026" },
  { name: "Solidity Smart Contract Development", date: "Jan 2026" },
  { name: "Blockchain Basics", date: "Dec 2025" },
];

/* ---------- Data: ZK study roadmap ----------
   status: "done" | "current" | "upcoming" */
const ROADMAP = [
  {
    title: "Prerequisites",
    status: "done",
    subtopics: [
      "Programming languages — JavaScript / TypeScript",
      "Math — sets, functions, arithmetic, calculas",
      "Version control — Git",
    ],
  },
  {
    title: "Blockchain & smart contracts",
    status: "done",
    subtopics: [
      "Blockchain fundamentals — consensus, state",
      "EVM — accounts, transactions, gas",
      "Language — Solidity",
      "Framework — Foundry",
    ],
    applied: "Certified: Blockchain Basics, Solidity Smart Contract Development, Foundry Fundamentals, &amp; Advanced Foundry",
  },
  {
    title: "Cryptography",
    status: "done",
    subtopics: [
      "Modular arithmetic & finite fields",
      "Elliptic curve groups",
      "Bilinear pairings",
      "Hash functions & digital signatures (ECDSA / EdDSA)",
      "ZK-friendly hashes (Poseidon, Pedersen) — and why they exist",
    ],
  },
  {
    title: "Zero-knowledge fundamentals",
    status: "done",
    subtopics: [
      "Completeness & soundness",
      "Interactive vs. non-interactive proofs",
      "Fiat–Shamir transform",
    ],
    applied: "Certified: Fundamentals of Zero-Knowledge Proofs",
  },
  {
    title: "Arithmetization",
    status: "done",
    subtopics: [
      "Arithmetic circuits",
      "R1CS (Rank-1 Constraint System)",
    ],
  },
  {
    title: "SNARKs",
    status: "done",
    subtopics: [
      "Groth16",
      "Polynomial commitments",
      "QAPs (Quadratic Arithmetic Programs)",
      "Groth16 conversion",
      "The Powers of Tau ceremony",
    ],
  },
  {
    title: "Noir — Domain-Specific Lang.",
    status: "done",
    subtopics: [
      "Noir syntax",
      "Barretenberg — integrating the verifier on-chain",
    ],
    applied: "Certified: Noir Programming & ZK Circuits",
  },
  {
    title: "PLONK family",
    status: "done",
    subtopics: [
      "PLONKish arithmetization",
      "KZG polynomial commitments",
      "Why its setup is universal",
      "Proving systems built on it — Noir, halo2",
    ],
    applied: "UltraHonk (Barretenberg's PLONK-based backend) verifies both ZK projects on-chain",
  },
  {
    title: "On-chain verification",
    status: "done",
    subtopics: [
      "UltraHonk Verifier (bb.js)",
      "Reading generated Solidity verifier contracts",
      "What the pairing checks / polynomial evaluations actually do",
      "Gas costs of verification and how to reduce them",
    ],
  },
  {
    title: "STARKs",
    status: "current",
    subtopics: [
      "FRI (Fast Reed–Solomon IOP)",
      "Transparent setup vs. SNARKs' trusted setup",
      "Trade-offs — proof size, verification cost, post-quantum considerations",
    ],
  },
  {
    title: "Rust",
    status: "upcoming",
    subtopics: [
      "arkworks — implementing circuit primitives",
      "halo2 — building a circuit, the base for several <u>zkEVMs</u>",
      "plonky2 — reading the codebase, FRI-based, used in production by <u>Polygon</u>",
    ],
  },
  {
    title: "zkEVM / rollup architecture",
    status: "upcoming",
    subtopics: [
      "How L2s work",
      "Sequencer, prover, verifier, data availability",
      "L1 ↔ L2 bridging — validity proofs vs. fraud proofs",
      "Reading Scroll / Polygon zkEVM docs",
    ],
  },
  {
    title: "zkVMs",
    status: "upcoming",
    subtopics: [
      "RISC Zero, SP1 (Succinct) — proving arbitrary program execution",
      "Trade-offs against circuit-specific proving from stages 4–8",
    ],
  },
];

/* ---------- Data: projects, strongest to weakest ----------
   Ranked by technical depth: full ZK-circuit + contract + test
   rigor first, down to an in-progress security-practice repo. */
const PROJECTS = [
  {
    title: "Zero-Knowledge Proof of Solvency",
    tagline: "Proves a custodian's reserves cover every user's balance, without showing a single balance.",
    tags: ["Noir", "Merkle Sum Trees", "Poseidon", "Barretenberg", "Solidity"],
    description:
      "Lets a custodian prove reserves cover liabilities — and that every individual balance is honestly represented — without revealing any account's balance. Built on a Merkle Sum Tree where each node commits to a Poseidon hash and a running balance sum, so an operator can't forge sibling balances or mask a reserve deficit by injecting a fake negative-balance account, closed off by Noir's native range checks constraining every balance to [0, 2^64). Design inspired by Summa (PSE)'s open-source proof-of-reserves reference.",
    stats: ["100% coverage", "Merkle Sum Tree", "Negative-balance attack closed", "Full Noir → bb → Solidity pipeline"],
    github: "https://github.com/04arush/ZK-Proof-of-Solvency",
  },
  {
    title: "ZK-Powered Undercollateralized Lending Protocol",
    tagline: "50% collateral loans, verified by a Noir credit-score circuit instead of a bank statement.",
    tags: ["Noir", "Barretenberg", "Solidity", "Foundry", "Next.js"],
    description:
      "A DeFi lending protocol that needs only 50% collateral instead of the usual 150%, enabled by a Noir circuit that proves credit_score and income clear set thresholds without revealing either on-chain. The proof runs entirely in-browser via Barretenberg WASM, so private financial data never leaves the user's device. A three-layer Foundry suite backs it: unit tests, 256-run fuzz tests, and invariant tests covering 128,000 actions per invariant, with 100% line, statement, branch and function coverage. ReentrancyGuard and SafeERC20 throughout.",
    stats: ["23/23 tests passing", "100% coverage", "128K invariant actions", "10–30s in-browser proving", "Frostbyte finalist"],
    github: "https://github.com/04arush/ZK-Powered-Uncollateralized-Lending-Protocol",
  },
  {
    title: "Decentralized Provably Fair Raffle",
    tagline: "A raffle that runs itself — Chainlink VRF picks the winner, Automation calls the shot.",
    tags: ["Solidity", "Chainlink VRF v2.5", "Chainlink Automation", "Foundry"],
    description:
      "A fully autonomous raffle with no admin steps from entry to payout. Chainlink VRF v2.5 sources unpredictable, verifiable randomness; Chainlink Automation watches checkUpkeep (time elapsed, raffle open, balance present) and triggers performUpkeep on its own. A chain-aware HelperConfig deploys mocks on Anvil and wires live Chainlink contracts on Sepolia from the same script, with subscription creation, funding, and consumer registration all automated.",
    stats: ["12 unit tests", "256-run fuzz test", "skipFork-gated VRF mocks", "Chain-aware deploy script"],
    github: "https://github.com/04arush/Raffle-Contest",
  },
  {
    title: "AMM DEX",
    tagline: "A constant-product exchange for two custom tokens, with a wallet-connected frontend.",
    tags: ["Solidity", "Foundry", "Constant-Product AMM"],
    description:
      "A constant-product (x·y=k) automated market maker for swapping two custom ERC-20 tokens, with a lightweight vanilla-JS frontend for connecting a wallet and trading directly. Deployed to Sepolia. Ten passing tests cover liquidity provisioning, swaps, and slippage handling, including a fuzz test confirming a swap can never drain the pool.",
    stats: ["10 tests passing", "87.5% line coverage", "Sepolia deployed", "Wallet-connected frontend"],
    github: "https://github.com/04arush/AMM-DEX",
  },
  {
    title: "Ethernaut Solutions",
    tagline: "Write-ups and exploits for OpenZeppelin's security wargame — 16 levels down, more in progress.",
    tags: ["Solidity", "Security", "OpenZeppelin"],
    description:
      "Exploit contracts and write-ups for OpenZeppelin's Ethernaut wargame, each documenting the vulnerability and the exact steps to break it: reentrancy, delegatecall storage collisions, tx.origin spoofing, forced-ether via selfdestruct, gas-limit gatekeeping, and more. An ongoing log of vulnerability patterns rather than a single build — still adding levels.",
    stats: ["16 of 40 levels solved", "Ongoing", "Vulnerability + write-up per level"],
    github: "https://github.com/04arush/Ethernaut-Solutions",
  },
];

/* ---------- Data: hackathons ---------- */
const HACKATHONS = [
  {
    title: "ETHOnline 2026",
    organizer: "ETHGlobal",
    status: "upcoming", 
    result: "-",
    project: "TBD",
    description: "",
    github: "-",
    link: "https://ethglobal.com/events/ethonline2026",
    timeline: [
      { label: "Winner Announcement", date: "Sep 16th", status: "upcoming" },
      { label: "Judging", date: "Sep 14th", status: "upcoming" },
      { label: "Submission", date: "Sep 13th", status: "upcoming" },
      { label: "Starts", date: "Sep 4th", status: "upcoming" },
    ]
  },
  {
    title: "Frostbyte Hackathon Finale",
    organizer: "Devpost",
    status: "done", 
    result: "Participation Award",
    project: "ZK-Powered Undercollateralized Lending Protocol",
    description: "A Noir + Barretenberg + Solidity stack enabling privacy-preserving credit verification on-chain for undercollateralised loans without revealing user credit scores.",
    github: "https://github.com/04arush/ZK-Powered-Uncollateralized-Lending-Protocol",
    link: "https://frostbyte-hackathon.devpost.com/",
    timeline: [
      { label: "Winner Announcement", date: "Jun 20th", status: "done" },
      { label: "Judging", date: "Apr 15th - Jun 11th", status: "done" },
      { label: "Submission", date: "Apr 04th - Apr 13th", status: "done" },
    ]
  },
  {
    title: "Frostbyte Hackathon",
    organizer: "Devpost",
    status: "done",
    result: "Participation & Completion — Moved to Finale",
    project: "Employee Payroll Manager",
    description: "A Chainlink Automation-powered on-chain payroll system designed to autonomously trigger and manage recurring payments.",
    github: "https://github.com/04arush/Employee-Payroll-Manager",
    link: "https://frostbyte.devpost.com/",
    timeline: [
      { label: "Winner Announcement", date: "Apr 07th", status: "done" },
      { label: "Judging", date: "Mar 18th - Apr 06th", status: "done" },
      { label: "Submission", date: "Jan 27th - Mar 18th", status: "done" },
    ]
  }
];

/* ---------- Render: certifications ---------- */
function renderCerts() {
  const list = document.getElementById("certs-list");
  list.innerHTML = CERTS.map(
    (c) => `<li><span>${c.name}</span><span class="cert-date">${c.date}</span></li>`
  ).join("");
}

/* ---------- Render: roadmap ---------- */
const STATUS_LABEL = { done: "Done", current: "Studying now", upcoming: "Upcoming" };

function renderRoadmap() {
  const doneCount = ROADMAP.filter((s) => s.status === "done").length;
  const pct = Math.round((doneCount / ROADMAP.length) * 100);

  document.getElementById("roadmap-progress").innerHTML = `
    <span>${doneCount} of ${ROADMAP.length} stages complete</span>
    <div class="roadmap-progress-bar"><div class="roadmap-progress-fill" style="width:${pct}%"></div></div>
    <span>${pct}%</span>
  `;

  const timeline = document.getElementById("roadmap-timeline");
  timeline.innerHTML = ROADMAP.map((stage, i) => {
    const num = String(i + 1).padStart(2, "0");
    const subtopics = stage.subtopics.map((s) => `<li>${s}</li>`).join("");
    const applied = stage.applied ? `<p class="stage-applied">${stage.applied}</p>` : "";
    return `
      <li class="stage stage--${stage.status}" data-index="${i}">
        <span class="stage-node" aria-hidden="true"></span>
        <div class="stage-card">
          <button class="stage-header" aria-expanded="false">
            <span class="stage-num">${num}</span>
            <span class="stage-title">${stage.title}</span>
            <span class="stage-status">${STATUS_LABEL[stage.status]}</span>
            <svg class="stage-chevron" width="16" height="16"><use href="#icon-chevron"/></svg>
          </button>
          <div class="stage-details">
            <ul class="stage-subtopics">${subtopics}</ul>
            ${applied}
          </div>
        </div>
      </li>
    `;
  }).join("");

  timeline.addEventListener("click", (e) => {
    const header = e.target.closest(".stage-header");
    if (!header) return;
    const stage = header.closest(".stage");
    const isOpen = stage.classList.toggle("is-open");
    header.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ---------- Render: projects ---------- */
function renderProjects() {
  const grid = document.getElementById("project-grid");
  grid.innerHTML = PROJECTS.map((p) => {
    const tags = p.tags.map((t) => `<li>${t}</li>`).join("");
    const stats = p.stats.map((s) => {
      if (s === "Ongoing") {
        return `<li class="stat-ongoing">${s}</li>`;
      }
      return `<li>${s}</li>`;
    }).join("");
    return `
      <article class="project-card">
        <div class="project-card-top">
          <h3>${p.title}</h3>
          <a class="project-github" href="${p.github}" target="_blank" rel="noopener" aria-label="View ${p.title} on GitHub">
            <svg width="20" height="20"><use href="#icon-github"/></svg>
          </a>
        </div>
        <p class="project-tagline">${p.tagline}</p>
        <ul class="tag-list">${tags}</ul>
        <div class="project-reveal">
          <p class="project-desc">${p.description}</p>
          <ul class="project-stats">${stats}</ul>
        </div>
        <button class="project-toggle" aria-expanded="false">
          <span>Details</span>
          <svg width="14" height="14"><use href="#icon-chevron"/></svg>
        </button>
      </article>
    `;
  }).join("");

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".project-toggle");
    if (!btn) return;
    const card = btn.closest(".project-card");
    const isOpen = card.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ---------- Render: hackathons ---------- */
function renderHackathons() {
  const container = document.getElementById("hackathon-timeline");
  if (!container) return;
  
  container.innerHTML = HACKATHONS.map((h, i) => {
    // Build the dashed sub-timeline
    const subTimeline = h.timeline.map(t => `
      <div class="sub-stage sub-stage--${t.status}">
        <span class="sub-node"></span>
        <strong>${t.label}:</strong> ${t.date}
      </div>
    `).join("");
    
    // Build the "applied" style project block if a project exists
    const projectHTML = h.project !== "-" ? `
      <div class="stage-applied" style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
          <div style="font-size: 14.5px; line-height: 1.4;">
            <span style="color: var(--accent); font-weight: 600;">Project:</span> 
            <span style="color: var(--text); font-weight: 500;">${h.project}</span>
          </div>
          ${h.github !== "-" ? `
          <a href="${h.github}" target="_blank" rel="noopener" class="project-github" aria-label="View on GitHub" style="margin-top: 2px;">
            <svg width="18" height="18"><use href="#icon-github"/></svg>
          </a>` : ''}
        </div>
        ${h.description ? `<p style="color: var(--text-dim); font-size: 13px; line-height: 1.55; margin: 0;">${h.description}</p>` : ''}
      </div>
    ` : '';

    return `
      <li class="stage stage--${h.status}" data-index="${i}">
        <span class="stage-node" aria-hidden="true"></span>
        <div class="stage-card">
          <button class="stage-header" aria-expanded="false">
            <div style="flex:1; text-align:left;">
              <div class="stage-title">${h.title} <span style="font-size:12px; color:var(--text-faint); font-weight:normal;">(${h.organizer})</span></div>
              ${h.result !== "-" ? `<div style="font-size:12.5px; color:var(--text-dim); margin-top:4px;">Result: ${h.result}</div>` : ''}
            </div>
            <span class="stage-status">${h.status === "done" ? "Completed" : "Upcoming"}</span>
            <svg class="stage-chevron" width="16" height="16" style="margin-left:12px;"><use href="#icon-chevron"/></svg>
          </button>
          <div class="stage-details">
            <div class="sub-timeline">
              ${subTimeline}
            </div>
            ${projectHTML}
          </div>
        </div>
      </li>
    `;
  }).join("");

  // Add expand/collapse functionality
  container.addEventListener("click", (e) => {
    const header = e.target.closest(".stage-header");
    if (!header) return;
    const stage = header.closest(".stage");
    const isOpen = stage.classList.toggle("is-open");
    header.setAttribute("aria-expanded", String(isOpen));
  });
}

/* ---------- Nav: mobile toggle ---------- */
function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.innerHTML = isOpen
      ? '<svg width="22" height="22"><use href="#icon-close"/></svg>'
      : '<svg width="22" height="22"><use href="#icon-menu"/></svg>';
  });
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = '<svg width="22" height="22"><use href="#icon-menu"/></svg>';
    })
  );
}

/* ---------- Nav: scroll-spy ---------- */
function initScrollSpy() {
  const navLinks = document.querySelectorAll("[data-nav]");
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        navLinks.forEach((link) =>
          link.classList.toggle("is-active", link.getAttribute("href") === id)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Contact form: compose a mailto ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");

  const formEndpoint = "https://formspree.io/f/xdeoegzw";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      note.textContent = "Fill in every field so the message makes sense on my end.";
      note.style.color = "#e8b24d";
      return;
    }

    note.textContent = "Sending your message...";
    note.style.color = "#e8b24d";
    
    fetch(formEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    })
    .then(response => {
      if (response.ok) {
        note.textContent = "Message sent successfully! I'll get back to you soon.";
        note.style.color = "#4fd1ae"; 
        form.reset(); 
      } else {
        note.textContent = "Oops! There was a problem submitting your form.";
        note.style.color = "#e8b24d";
      }
    })
    .catch(error => {
      note.textContent = "Network error. Please try again later.";
      note.style.color = "#e8b24d";
    });
  });
}

/* ---------- Init ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
renderCerts();
renderRoadmap();
renderProjects();
renderHackathons();
initNavToggle();
initScrollSpy();
initContactForm();
