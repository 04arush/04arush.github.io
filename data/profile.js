/*
 * Portfolio content
 * -----------------
 * Everything shown on the site lives here. Edit this file to update the
 * portfolio; the page is rendered from it by js/home.js and js/layout.js.
 *
 * Text fields accept **bold** for emphasis. Everything else is plain text.
 */
window.PORTFOLIO = {
    site: {
        title: 'Arush Singh – Portfolio',
        logo: { text: 'Arush', accent: '.dev' },
        resumes: [
            { label: 'Smart Contracts Dev. Resume', file: 'sc_dev_resume.pdf' },
            { label: 'Protocol & ZK Eng. Resume', file: 'protocol_zk_eng_resume.pdf' }
        ]
    },

    // Order here = order on the page. `nav` is the menu label (omit to hide from the menu).
    sections: [
        { id: 'about', kicker: 'Background', title: 'About Me', nav: 'About' },
        { id: 'experience', kicker: 'Career', title: 'Experience', nav: 'Experience' },
        { id: 'projects', kicker: 'Portfolio', title: 'Projects & Hackathons', nav: 'Projects' },
        { id: 'skills', kicker: 'Expertise & Credentials', title: 'Skills & Certificates', nav: 'Skills' },
        { id: 'writing', kicker: 'Writing', title: 'Blog & Series', nav: 'Writing', page: 'blog.html' },
        { id: 'roadmap', kicker: 'Growth & Milestones', title: 'Roadmaps', nav: 'Roadmap' },
        { id: 'contact', kicker: 'Get in Touch', title: 'Contact Me', nav: 'Contact' }
    ],

    profile: {
        name: 'Arush Singh',
        greeting: '// Hello! I am',
        roles: ['Protocol & ZK Engineer', 'Smart Contract Developer'],
        rolesShort: ['Protocol & ZK Eng.', 'Smart Contract Dev.'], // used where space is tight (profile.json card)
        intro: 'Protocol engineer working on core architecture at Cubane, with a focus on Zero-Knowledge Cryptography and consensus. Also build Solidity smart contracts for DeFi protocols and on-chain automation, with rigorous testing.',
        about: 'Protocol Engineer at Cubane, working on critical components of its core architecture alongside the Kosh wallet and block explorer, with a focus on Zero-Knowledge Cryptography and consensus. Also a Solidity smart contract developer, with a comprehensive foundation in EVM architecture, advanced security, fuzz testing, and arithmetic circuits. Experienced in authoring ZK circuits in Noir and Circom, deploying automated protocols with Chainlink oracles, and building robust cryptographic verifiers across both smart contract and systems-level tracks. Passionate about secure protocol design, decentralized systems architecture, and advancing toward specialized global engineering opportunities.',
        location: 'New Delhi, India',
        education: {
            degree: "Bachelor's — Computer Application",
            school: 'IGNOU',
            period: 'Aug 2023 – Feb 2027',
            field: 'Computer Application' // shown as "studying" in the profile.json card
        }
    },

    socials: [
        { id: 'github', label: 'GitHub', handle: '04arush', url: 'https://github.com/04arush' },
        { id: 'linkedin', label: 'LinkedIn', handle: '04arush', url: 'https://linkedin.com/in/04arush' },
        { id: 'x', label: 'X (Twitter)', handle: '04arush', url: 'https://x.com/04arush' },
        { id: 'telegram', label: 'Telegram', handle: 'grandpaarush', url: 'https://t.me/grandpaarush' },
        { id: 'email', label: 'Email', handle: '04arush@gmail.com', url: 'mailto:04arush@gmail.com' }
    ],

    experience: [
        {
            role: 'Protocol Engineer',
            org: 'Cubane',
            orgUrl: 'https://cubane.space',
            start: 'Oct 2026',
            end: null, // null = Present
            meta: ['Delhi, India', 'Hybrid', 'Part-time'],
            points: [
                "Building experimental versions of critical components in Cubane's core architecture across the zero-knowledge and consensus layers, working directly with the founders.",
                "Worked on Cubane's Kosh wallet and its browser extension, from protocol-level integrations through to the user-facing product.",
                "Built the frontend of Cubane's block explorer alongside the product and design teams."
            ],
            stack: ['Go', 'Python', 'TypeScript', 'Shell', 'Cloud']
        }
    ],

    // Only the best few are listed below; this makes the counter read "6+"
    // and adds a "more on GitHub" link under the grid.
    moreProjects: { url: 'https://github.com/04arush?tab=repositories', label: 'More projects on GitHub' },

    projects: [
        {
            title: 'Zero-Knowledge: Proof of Solvency',
            date: 'Aug – Sep 2026',
            repo: 'https://github.com/04arush/ZK-Proof-of-Solvency',
            categories: ['Protocol'],
            desc: 'Proof-of-solvency protocol: a custodian proves liabilities coverage and honest per-user inclusion without exposing account data using a Noir circuit over a Merkle Sum Tree.',
            stack: ['Noir', 'Merkle Sum Trees', 'Poseidon', 'Barretenberg', 'Solidity', 'Foundry']
        },
        {
            title: 'Intent-Based Batch Auction Exchange',
            date: 'Oct 2026',
            repo: 'https://github.com/04arush/Batch-Auction-Exchange',
            categories: ['Smart Contracts'],
            desc: 'An on-chain spot-trading exchange where users submit signed EIP-712 trade intents during fixed epochs, settled atomically at a uniform clearing price via independent solvers.',
            stack: ['Solidity', 'Foundry', 'OpenZeppelin', 'Slither', 'CI Workflows']
        },
        {
            title: 'ZK Undercollateralized Lending Protocol',
            date: 'Mar – Apr 2026',
            repo: 'https://github.com/04arush/ZK-Powered-Uncollateralized-Lending-Protocol',
            categories: ['Protocol', 'Smart Contracts'],
            desc: 'Undercollateralised lending (50% collateral): a Noir circuit proves credit score and income exceed thresholds without revealing them, verified via Barretenberg verifier.',
            stack: ['Noir', 'Barretenberg', 'Solidity', 'Foundry', 'Next.js']
        },
        {
            title: 'ZKVote DApp',
            date: 'Sep 2026',
            repo: 'https://github.com/04arush/ZKVote',
            categories: ['Protocol', 'Smart Contracts'],
            desc: 'Commit-nullifier voting DApp: Circom circuit binds a Poseidon commitment to the vote and derives a per-proposal nullifier with Groth16 proof verification.',
            stack: ['Circom', 'Groth16', 'snarkjs', 'Poseidon', 'Solidity', 'Foundry']
        },
        {
            title: 'Provably Fair Raffle',
            date: 'Mar 2026',
            repo: 'https://github.com/04arush/Raffle-Contest',
            categories: ['Smart Contracts'],
            desc: 'Autonomous on-chain raffle with no admin intervention utilizing Chainlink VRF v2.5 for winner selection and Chainlink Automation for upkeep.',
            stack: ['Solidity', 'Foundry', 'Chainlink VRF', 'Chainlink Automation']
        },
        {
            title: 'StreamProof',
            date: 'Sep 2026',
            repo: 'https://github.com/04arush/StreamProof',
            categories: ['Protocol'],
            desc: 'A platform which commits streaming data for a track as a merkle root and artist claims payout tiers based on stream counts verified via a zero-knowledge circuit.',
            stack: ['Noir', 'Poseidon2', 'Barretenberg', 'ENSv2', 'Privy']
        }
    ],

    hackathons: [
        {
            name: 'ETHOnline 2026',
            org: 'ETHGlobal',
            date: 'Sep 2026',
            desc: 'Built **StreamProof**, a private royalty-tier verification protocol: a Noir circuit verified on-chain via UltraHonk on Arc Testnet.',
            result: 'Participation Award'
        },
        {
            name: 'Frostbyte Hackathon',
            org: 'Devpost',
            date: 'Mar 2026',
            desc: 'Qualified with the **Employee Payroll Manager** (Chainlink Automation), then advanced to the finale with the **ZK lending protocol**.',
            result: 'Finalist & Participant Award'
        }
    ],

    // Shown as a section under Projects once it has entries.
    openSource: [],

    // `core` items are highlighted.
    skills: [
        {
            group: 'Smart Contracts & Blockchain',
            short: 'Smart Contracts',
            core: ['Solidity', 'Foundry', 'TypeScript'],
            more: ['Viem / Wagmi', 'Fuzz / Invariant Testing', 'Slither', 'Echidna', 'DeFi', 'Chainlink VRF / Automation / Oracle', 'Tokenization']
        },
        {
            group: 'Protocol, ZK & Cryptography',
            short: 'Protocol & ZK',
            core: ['Rust', 'Go', 'Cosmos SDK', 'Noir (Barretenberg)', 'Circom', 'zkVMs'],
            more: ['arkworks', 'STARKs', 'PLONKs', 'Tokio', 'Alloy', 'Consensus', 'ECDSA / EdDSA', 'Merkle Sum Trees', 'Poseidon / Pedersen Hashing', 'P2P Architecture', 'Mempools']
        },
        {
            group: 'Tools & Libraries',
            short: 'Tools',
            core: ['Linux Bash / Shell', 'Git', 'Python'],
            more: ['Node.js', 'Vite', 'Next.js', 'Docker', 'Kubernetes', 'CI/CD Workflows', 'APIs', 'Cloud', 'SQL / PostgreSQL', 'NoSQL / MongoDB']
        }
    ],

    certifications: [
        { title: 'Noir Programming & ZK Circuits', issuer: 'Cyfrin Updraft', date: 'Apr 2026', url: 'https://profiles.cyfrin.io/u/arush/achievements/noir-programming-and-zk-circuits' },
        { title: 'Fundamentals of Zero-Knowledge Proofs', issuer: 'Cyfrin Updraft', date: 'Mar 2026', url: 'https://profiles.cyfrin.io/u/arush/achievements/fundamentals-of-zero-knowledge-proofs' },
        { title: 'Advanced Foundry', issuer: 'Cyfrin Updraft', date: 'Mar 2026', url: 'https://profiles.cyfrin.io/u/arush/achievements/advanced-foundry' },
        { title: 'Foundry Fundamentals', issuer: 'Cyfrin Updraft', date: 'Mar 2026', url: 'https://profiles.cyfrin.io/u/arush/achievements/foundry' },
        { title: 'Rust Programming Basics', issuer: 'Cyfrin Updraft', date: 'Feb 2026', url: 'https://profiles.cyfrin.io/u/arush/achievements/rust-programming-basics' },
        { title: 'Solidity Smart Contract Development', issuer: 'Cyfrin Updraft', date: 'Jan 2026', url: 'https://profiles.cyfrin.io/u/arush/achievements/solidity' },
        { title: 'Blockchain Basics', issuer: 'Cyfrin Updraft', date: 'Dec 2025', url: 'https://profiles.cyfrin.io/u/arush/achievements/blockchain-basics' }
    ],

    // status: 'done' | 'ongoing' | 'upcoming'
    roadmaps: [
        {
            track: 'Smart Contracts Development',
            short: 'Smart Contracts',
            phases: [
                { title: 'Cryptography & EVM Foundations', desc: 'Consensus mechanisms, Digital signatures, Hashing, Merkle trees, and EVM', status: 'done' },
                { title: 'Solidity & Foundry', desc: 'Solidity language, Foundry Framework, OOPs, Data Structures, Foundry Testing, Chainlink, and OpenZeppelin', status: 'done' },
                { title: 'DeFi & Tokenization', desc: 'Common Token Standards, Upgradability patterns, Mitigation techniques, AMM, Lending & Collaterals, Liquidation, and Flash Loans', status: 'done' },
                { title: 'TypeScript & Frontend Integration', desc: 'TypeScript language, Viem, Wagmi, and Asynchronous paradigms', status: 'done' },
                { title: 'Smart Contract Security', desc: 'Slither, Mythril, Aderyn, Echidna, Common vulnerabilities, and Audit reporting', status: 'done' },
                { title: 'Data Indexing & RPC Backend', desc: 'Event logs, Transaction receipts, Custom subgraphs, PostgreSQL, and WebSocket event streaming', status: 'done' }
            ]
        },
        {
            track: 'Protocol & ZK Engineering',
            short: 'Protocol & ZK',
            phases: [
                { title: 'Core Cryptography & P2P Networking', desc: 'Elliptic Curve Cryptography, Peer discovery, Data serialization, and State verification trees', status: 'done' },
                { title: 'Rust & P2P Architecture', desc: 'Rust language, Ownership, Concurrency, Async networking (Tokio), Abstraction, libp2p, Mempool, and Alloy', status: 'done' },
                { title: 'Consensus Synchronization', desc: 'State transitions, Block execution engine pipelines, Client synchronization paradigms, and reorgs', status: 'done' },
                { title: 'SNARKs & STARKs', desc: 'Noir, Barretenberg, ZK-Proofs, On-chain verification, Circom, Groth16, and scalar fields', status: 'done' },
                { title: 'Go & Cosmos SDK', desc: 'Go language, network daemons, Cosmos SDK framework, CometBFT consensus engine, and ABCI integration', status: 'done' },
                { title: 'Bridges, Interoperability, Arithmetic Circuits & Proving Systems', desc: 'Verification bridges architectures, Trusted vs Trustless protocols, IBC protocol, R1CS, Plonkish, and Arkworks', status: 'ongoing' },
                { title: 'zkVMs & Recursive Proofs', desc: 'zkVM architecture (RISC Zero & SP1), Recursive proofs, and Compression techniques', status: 'upcoming' }
            ]
        }
    ],

    contact: {
        heading: "Let's build together.",
        text: 'Whether you want to discuss zero-knowledge architecture, smart contract security, or potential collaboration, my inbox is always open.',
        formAction: 'https://formspree.io/f/xrpeladp',
        formSubject: 'New message from 04arush.github.io',
        placeholders: { name: 'Vitalik Buterin', email: 'vitalik@ethereum.org', message: "Let's talk about ZK circuits..." }
    }
};
