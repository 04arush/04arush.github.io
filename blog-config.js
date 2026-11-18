/*
 * Blog configuration
 * ------------------
 * Posts are fetched live from the dev.to API, so publishing on dev.to is enough
 * for a post to appear here. This file only holds what the API can't tell us.
 *
 *  - series:    keyed by the dev.to series id (the number in
 *               https://dev.to/<user>/series/<id>). Starting a new series?
 *               Add one entry here. A series that isn't listed still shows up,
 *               just with a generic name.
 *  - overrides: optional per-post tweaks keyed by dev.to article id
 *               (e.g. a nicer description than the auto-generated one).
 *  - fallback:  snapshot shown only if dev.to can't be reached.
 */
window.BLOG_CONFIG = {
    devtoUser: 'grandpaarush',
    githubUser: '04arush',

    series: {
        46898: {
            name: 'Zero-Knowledge from Zero Knowledge',
            slug: 'zk-from-zero-knowledge',
            blurb: 'A beginner-first series on zero-knowledge proofs: from the intuition behind "prove without revealing" to writing, testing and verifying real circuits in Noir and Circom. Every post ships with runnable code.',
            topics: ['Zero-Knowledge', 'Cryptography'],
            repo: 'ZK-from-Zero-Knowledge', // folders named "01-…", "02-…" are matched to parts
            planned: 15,
            status: 'ongoing' // 'ongoing' | 'complete'
        }
    },

    overrides: {
        5059358: {
            description: 'What a zero-knowledge proof actually proves, explained with two analogies, plus the three properties every ZK proof needs and interactive vs non-interactive proofs.'
        },
        5063679: {
            description: 'ZK proofs do two very different jobs: privacy (hide the data) and scaling (avoid redoing the work). Five real use cases and how to tell which job each one is doing.'
        }
    },

    fallback: [
        {
            id: 5063679,
            title: 'What is zero-knowledge actually used for?',
            url: 'https://dev.to/grandpaarush/what-is-zero-knowledge-actually-used-for-10l6',
            published_at: '2026-11-18T15:27:53Z',
            reading_time_minutes: 5,
            tag_list: ['zeroknowledge', 'blockchain', 'web3', 'cryptography'],
            collection_id: 46898,
            description: ''
        },
        {
            id: 5059358,
            title: 'How can I prove I know a secret without telling you the secret? — Zero-Knowledge Proofs!',
            url: 'https://dev.to/grandpaarush/how-can-i-prove-i-know-a-secret-without-telling-you-the-secret-zero-knowledge-proofs-78o',
            published_at: '2026-11-18T06:55:56Z',
            reading_time_minutes: 5,
            tag_list: ['zeroknowledge', 'cryptography', 'blockchain', 'zk'],
            collection_id: 46898,
            description: ''
        }
    ]
};
