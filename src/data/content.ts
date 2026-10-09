export type Layer = { name: string; static: string; without: string; needs?: string; tryIt?: { label: string; href: string } };
export type LayerGroup = { name: string; cost: 'low' | 'medium' | 'high' | 'existential'; layers: Layer[] };

// The original's four groups, in its order, with its cost-to-miss labels (checked against the live page, 2026-10-09).
export const layerGroups: LayerGroup[] = [
  { name: 'Getting found', cost: 'low', layers: [
    { name: 'SEO foundations', static: 'Sitemap, meta tags, canonical and JSON-LD come from one layout file and the build. A missing title fails the build.', without: 'Pages search engines cannot read, rank or index properly.', tryIt: { label: 'Open the sitemap', href: '/sitemap-index.xml' } },
    { name: 'Social share previews', static: 'An Open Graph image is rendered at build time for every page. No plugin, no runtime image service.', without: 'A grey box when the CEO shares the link on LinkedIn.', tryIt: { label: 'Open the share image', href: '/og/index.png' } },
    { name: 'Redirects & 404s', static: 'A plain-text redirects file at the host edge, plus a 404 page that is just a file. Versioned and reviewable in a diff.', without: 'Broken links, lost traffic and a blank page for a mistyped URL.', tryIt: { label: 'Try /prodcuts', href: '/prodcuts' } },
  ]},
  { name: 'Running the site', cost: 'medium', layers: [
    { name: 'Editorial workflow', static: 'Content lives as Markdown files in git, and pull requests are your review and revision history. That suits people comfortable with git. Editors who are not will want a headless CMS, which is a separate product with its own cost (see the receipts).', without: 'No review step and no history: nobody can tell who changed what, or undo it.', needs: 'Git comfort, or a CMS for editors who have none' },
    { name: 'Roles & permissions', static: 'A static site has no users. Who can publish is set in your Git host and, if you add one, your CMS.', without: 'Everyone, or nobody, can publish.', needs: 'Git host and CMS settings' },
    { name: 'Media pipeline', static: 'Images are resized, converted to AVIF or WebP and given dimensions at build time.', without: 'A 14 MB hero photo and a slow page.' },
    { name: 'Forms & lead capture', static: 'A host-level form service such as Netlify Forms, or a serverless function behind a bot check.', without: 'A flooded inbox, or leads that vanish.', needs: 'A form service or a function', tryIt: { label: 'Try the form', href: '/demo/form' } },
  ]},
  { name: 'Managing risk', cost: 'high', layers: [
    { name: 'Security & updates', static: 'A static site has no application of its own running for visitors: no database, no plugins, no login page. What remains to patch is the build toolchain (npm dependencies, see the risks section) and the accounts that can deploy. The host patches its own platform. A CMS or serverless functions, if you add them, are separate systems with their own patching.', without: 'Little reaches visitors. The risk moves to you: an outdated toolchain, or a compromised dependency or deploy account, can put bad code into the next build.', tryIt: { label: 'Knock on /wp-login.php', href: '/wp-login.php' } },
    { name: 'Accessibility', static: 'Semantic HTML, a visible keyboard focus ring and an automated axe-core check you can run with npm run a11y. Our first run found real bugs, which we fixed and re-tested (details in the checklist). Automated tools catch only part of the problems, so keyboard and screen-reader testing is still on you.', without: 'Visitors who use a keyboard or screen reader get locked out, and there can be legal exposure.' },
    { name: 'Privacy & consent', static: 'A small open-source consent library gates trackers until a visitor accepts. Astro has no built-in one, but an integration exists.', without: 'Trackers load before anyone has said yes.', needs: 'A consent library, or a hosted platform', tryIt: { label: 'Try the consent demo', href: '/demo/consent' } },
    { name: 'Backups & rollback', static: 'The site is a git repo plus a build, and most hosts keep earlier deploys, so rollback is a click.', without: 'No way back from a bad release.', needs: 'Separate backups for any SaaS CMS content' },
  ]},
  { name: 'Staying alive', cost: 'existential', layers: [
    { name: 'Maintainability', static: 'The site is plain files in a repo, so anyone with access can read it, build it and change it. The cost is dependencies: a lockfile pins them, but they age, and framework upgrades (an Astro major version, for example) need migration work.', without: 'In a year the author has moved on, the dependencies are stale and nobody dares touch the build.', needs: 'Someone who owns updates' },
    { name: 'Integrations', static: 'Not where static shines. Anything that needs a server-side secret or a login, such as CRM sync, payments or personalisation, needs a serverless function or a third-party service. Each one is code you maintain or a vendor you depend on. WordPress has a far larger ecosystem of ready-made integrations.', without: 'Leads, newsletter and analytics sit in separate tools that do not talk to each other.', needs: 'A function or a service for each one' },
    { name: 'Scale & uptime', static: 'Plain files on a CDN. A front-page mention is a non-event.', without: 'A traffic spike takes the site down.' },
  ]},
];

export type Option = { name: string; text: string; href: string };
export type Incident = {
  time: string; title: string;
  vibe: string; wp: string; static: string;
  vibeCode: string; wpCode: string; staticCode: string;
  note?: string;
  tryIt?: { label: string; href: string };
  options?: { heading: string; items: Option[] };
};

// The original's eight incidents, in its order and at its times (checked against the live page, 2026-10-09).
// The vibe and WordPress artifacts follow what the original shows. The static column and the notes are ours,
// and our artifacts are illustrative unless a "Try it" link says otherwise.
export const incidents: Incident[] = [
  {
    time: '9:02 AM', title: 'Googlebot shows up',
    vibe: 'No sitemap. The crawler leaves with nothing.', wp: 'A sitemap exists, with every page listed.', static: 'Generated by the build. Already there.',
    vibeCode: 'GET /sitemap.xml\n← 404 Not Found', wpCode: 'GET /sitemap_index.xml\n← 200 OK · every page listed', staticCode: 'GET /sitemap-index.xml\n← 200 OK · rebuilt every deploy',
    tryIt: { label: 'Open this site\'s sitemap', href: '/sitemap-index.xml' },
  },
  {
    time: '9:40 AM', title: 'Your CEO shares it on LinkedIn',
    vibe: 'No preview card: there is no og:image and no og:title.', wp: 'A rich preview card with an image, a headline and the site name.', static: 'OG tags and an image are generated at build for every page.',
    vibeCode: 'no preview available\n← no og:image, no og:title', wpCode: 'preview card: "Coffee, but brighter."\nLumen & Co. · lumenandco.com', staticCode: '<meta property="og:image"\n  content="/og/index.png">  ← built, 1200×630',
    tryIt: { label: 'Open this site\'s share image', href: '/og/index.png' },
  },
  {
    time: '10:15 AM', title: 'Someone types /prodcuts',
    vibe: 'A blank page, and the visitor bounces.', wp: 'A redirect sends them to the homepage.', static: 'One line in a redirects file does the same.',
    vibeCode: 'GET /prodcuts\n← blank page · bounce', wpCode: 'GET /prodcuts\n← 301 → /', staticCode: 'GET /prodcuts\n← 301 → /',
    tryIt: { label: 'Try /prodcuts on this site', href: '/prodcuts' },
  },
  {
    time: '11:30 AM', title: 'A spam bot finds your contact form',
    vibe: 'No validation: the inbox floods.', wp: 'The honeypot blocks the bot, and the two real entries are saved.', static: 'A form service, or a bot check in front of one function.',
    vibeCode: 'POST /api/contact × 4,112\n→ inbox: 4,114 new', wpCode: 'spam: blocked by honeypot\nentries: 2 saved · team notified', staticCode: 'POST /contact × 4,112\n→ spam: blocked by honeypot\n→ entries: 2 saved',
    note: 'A honeypot stops simple bots. Smarter ones that only fill visible fields need more, which is what the services below add.',
    tryIt: { label: 'Try the form, then play the bot', href: '/demo/form' },
    options: {
      heading: 'Your host can already do this',
      items: [
        { name: 'Netlify Forms', text: 'Every submission goes through Akismet. Add a honeypot field, a reCAPTCHA 2, or both, with a couple of attributes on your <form>.', href: 'https://docs.netlify.com/forms/spam-filters/' },
        { name: 'Vercel BotID', text: 'An invisible bot check for the routes you pick, with no visible CAPTCHA. It needs the form sent with fetch, not a plain HTML form action.', href: 'https://vercel.com/docs/botid' },
        { name: 'Cloudflare Turnstile', text: 'A free CAPTCHA alternative. The widget alone does nothing: a function has to verify the token server-side.', href: 'https://developers.cloudflare.com/use-cases/solutions/protect-sensitive-forms-fraud-abuse/' },
      ],
    },
  },
  {
    time: '1:05 PM', title: 'Marketing uploads a 14 MB hero photo',
    vibe: 'Served as-is, and the page crawls.', wp: 'Resized and converted: 182 KB in 6 sizes.', static: 'Optimised at build; the original never ships.',
    vibeCode: 'hero.png 14.2 MB\nLCP 9.4s', wpCode: 'hero.webp 182 KB · 6 sizes\nLCP 1.1s', staticCode: 'hero.png 14.2 MB\n→ hero.avif 96 KB · 5 widths\n← at build, never shipped',
  },
  {
    time: '2:20 PM', title: 'A visitor arrives from Berlin',
    vibe: 'Trackers load before anyone has said yes.', wp: 'Both scripts wait for consent.', static: 'Nothing loads by default. If marketing wants trackers, a consent library gates them.',
    vibeCode: 'gtag.js loaded · consent: none\npixel.js loaded · consent: none', wpCode: 'gtag.js → awaiting consent\npixel.js → awaiting consent', staticCode: 'analytics.js blocked · consent: none\n← unlocks only on "Accept"',
    note: 'On WordPress this is typically a consent plugin, which is one more plugin to keep patched.',
    tryIt: { label: 'Open the consent + tracking demo', href: '/demo/consent' },
    options: {
      heading: 'Most businesses will want a banner, and Astro has no built-in one',
      items: [
        { name: 'astro-cookieconsent', text: 'A ready Astro integration that wraps vanilla-cookieconsent. One `astro add` and a config object.', href: 'https://github.com/jop-software/astro-cookieconsent' },
        { name: 'vanilla-cookieconsent', text: 'The open-source library underneath, no framework needed. This is what the demo uses. Scripts marked with a category stay inert until accepted.', href: 'https://github.com/orestbida/cookieconsent' },
        { name: 'Hosted consent platforms', text: 'Cookie-Script, CookieChimp and ConsentPro publish Astro setup guides, for teams that need their own dashboard or Google Consent Mode v2 handling.', href: 'https://cookie-script.com/guides/cookie-consent-for-astro' },
        { name: 'Cookieless analytics', text: 'Tools like Plausible or Umami set no cookies. Whether that removes the need for consent depends on your jurisdiction, so ask your lawyer.', href: 'https://plausible.io/data-policy' },
      ],
    },
  },
  {
    time: '3:45 PM', title: 'Someone spots a typo on the homepage',
    vibe: 'Filed as a ticket and queued for a developer.', wp: 'An editor fixes it in the admin.', static: 'Edit the Markdown, push, deploy. Editors who do not use git need a CMS (see the receipts).',
    vibeCode: 'ticket #212 \'pls fix typo\'\nstatus: in dev queue', wpCode: 'editor@lumen → Save\n← live in 8s', staticCode: 'edit hero.md → git push\n← live after the next build',
    note: 'This is the honest soft spot for static sites: a non-technical editor is happiest in the WordPress admin.',
  },
  {
    time: '4:58 PM', title: 'A security advisory drops. It\'s Friday',
    vibe: 'A dependency you did not know you had is vulnerable.', wp: 'The security release is applied automatically.', static: 'The host serves files; there is no application server of yours to exploit. Build-time dependencies still need updating, and a self-hosted CMS or serverless functions would add some risk back.',
    vibeCode: '$ npm audit\n3 high · 1 critical', wpCode: 'security release applied\n5:03 PM · no action needed', staticCode: '$ npm audit\nfound 0 vulnerabilities\n← this site, when built',
    note: 'The original\'s "no action needed" holds for core on sites with automatic updates on. Plugin vulnerabilities are a separate question: see the table below.',
  },
];

export const costs = {
  wp: {
    title: 'WORDPRESS, MONTH 1+',
    items: [
      { item: 'Managed WordPress hosting', range: '$15–$100 / mo' },
      { item: 'Premium licences (SEO, forms add-ons, consent, backup/migration)', range: '$150–$800 / yr' },
      { item: 'Someone to own plugin updates, monitoring and incident response', range: '2–6 hrs / mo' },
      { item: 'Initial build', range: 'Agency quote' },
    ],
    total: 'ask who patches',
  },
  static: {
    title: 'STATIC, MARKDOWN IN GIT',
    items: [
      { item: 'Static hosting + CDN (free tiers exist; check plan terms)', range: '$0–$20 / mo' },
      { item: 'Hosted form endpoint', range: '$0–$20 / mo' },
      { item: 'Cookieless analytics (optional)', range: '$0–$15 / mo' },
      { item: 'Build-time dependency updates (PRs)', range: 'about 1 hr / mo' },
      { item: 'Initial build', range: 'Agency quote' },
    ],
    total: 'the host runs the server',
  },
  cms: {
    title: 'STATIC + HEADLESS CMS',
    items: [
      { item: 'Everything in the static receipt', range: 'see left' },
      { item: 'SaaS CMS plan (seats, content limits)', range: '$0–$300+ / mo' },
      { item: 'or self-hosted CMS: server + database', range: '$5–$50 / mo' },
      { item: 'self-hosted: updates, backups, security', range: 'yours again' },
    ],
    total: 'SaaS: a bill · self-hosted: patching',
  },
  note: 'Illustrative ranges, not quotes. Check your own stack. The point is that "$0.00" leaves out hosting, licences and the person doing the patching, and that adding a CMS to a static site adds a bill or a server to maintain. It is a trade-off, not a free lunch.',
};

export type Vuln = { category: string; finding: string; access: string; open: boolean; source: string; href: string };
// A hand-picked list of the most notable vulnerabilities of the last twelve months, from Patchstack's database
// and articles, read on 2026-10-09. Wording follows Patchstack; "known to be exploited" is Patchstack's own flag.
// Patchstack is a security vendor and the author's employer.
export const vulns: Vuln[] = [
  { category: 'WP core', finding: 'WordPress up to 7.0.1: broken access control in the REST API (CVE-2026-63030, CVSS 9.1), part of the "wp2shell" remote code execution chain. Patchstack flags it as known to be exploited.', access: 'Anyone, no login needed', open: true, source: 'Patchstack', href: 'https://patchstack.com/database/wordpress/wordpress/wordpress/vulnerability/wordpress-core-7-0-1-unauthenticated-remote-code-execution-vulnerability' },
  { category: 'Page builder', finding: 'Bricksforge up to 3.1.8.9: arbitrary file upload that leads to remote code execution (CVE-2026-85097, CVSS 10.0). Patchstack saw the first exploitation attempts on 7 October 2026.', access: 'Anyone, no login needed', open: true, source: 'Patchstack', href: 'https://patchstack.com/articles/critical-unauthenticated-arbitrary-file-upload-vulnerability-exploited-in-bricksforge-plugin/' },
  { category: 'Forms', finding: 'Ninja Forms up to 3.15.3 (500,000+ installs, per Patchstack): stored cross-site scripting through a form submission (CVE-2026-94504, CVSS 7.1). Attackers have used it since 5 October 2026 to plant backdoors and a hidden administrator account.', access: 'Anyone can plant it; it runs when an admin views the submission', open: true, source: 'Patchstack', href: 'https://patchstack.com/articles/four-ways-back-in-the-wordpress-xss-campaign-that-hides-its-own-admin-account/' },
  { category: 'Page builder', finding: 'Elementor Pro up to 4.2.1: arbitrary file upload in the Forms module, which lets an attacker write a PHP file to the server (CVE-2026-32475, CVSS 9.0). Patchstack flags it as known to be exploited.', access: 'Anyone, no login needed', open: true, source: 'Patchstack', href: 'https://patchstack.com/database/wordpress/plugin/elementor-pro/vulnerability/wordpress-elementor-pro-plugin-4-2-1-arbitrary-file-upload-vulnerability' },
  { category: 'Backups', finding: 'All-in-One WP Migration up to 7.109: second-order SQL injection via archive restore, leading to remote code execution (CVE-2026-19949, CVSS 8.8). Patchstack flags it as known to be exploited.', access: 'Anyone, no login needed', open: true, source: 'Patchstack', href: 'https://patchstack.com/database/wordpress/plugin/all-in-one-wp-migration/vulnerability/wordpress-all-in-one-wp-migration-and-backup-plugin-7-109-unauthenticated-second-order-sql-injection-via-archive-restore-to-remote-code-execution-vulnerability' },
  { category: 'SEO', finding: 'Rank Math up to 1.0.276: remote code execution (CVE-2026-81757, CVSS 7.2). Patchstack rates it high priority.', access: 'An Author account', open: false, source: 'Patchstack', href: 'https://patchstack.com/database/wordpress/plugin/seo-by-rank-math/vulnerability/wordpress-rank-math-seo-plugin-1-0-276-remote-code-execution-rce-vulnerability' },
];

export const wpSupply = [
  { title: 'EssentialPlugin, 2025 to 2026.', text: 'The vendor sold its plugin portfolio on Flippa in 2025. The buyer\'s first commit planted a backdoor in September 2025, and it was first used on 5 April 2026, which let it write arbitrary files on affected sites. Patchstack counts 20+ plugins. WordPress.org closed the plugins and pushed a forced security update.', href: 'https://patchstack.com/articles/critical-supply-chain-compromise-on-20-plugins-by-essentialplugin/', source: 'Patchstack' },
  { title: 'Smart Slider 3 Pro, April 2026.', text: 'An unauthorized party got into the vendor\'s update infrastructure and shipped a backdoored build, 3.5.1.35, through the official update channel. It was available for about six hours, and sites that updated received a remote access toolkit, including a hidden administrator account. The free version on WordPress.org was not affected.', href: 'https://patchstack.com/articles/critical-supply-chain-compromise-in-smart-slider-3-pro-full-malware-analysis/', source: 'Patchstack' },
];

export const fairPoints = [
  { title: 'Core was solid in 2025. 2026 has been different.', text: 'Patchstack counted six core vulnerabilities in 2025, all low priority. In 2026 came wp2shell in July, and in September WordPress 7.1.1 patched 11 security issues, including an unauthenticated stored XSS in wpautop(). The core team still pushed the wp2shell fix out within days, as forced updates on sites with auto-updates enabled. That response is what the "dedicated security team" claim is worth, and it is real.' },
{ title: 'Patches exist.', text: 'Every one of these has a fixed release, and a site that applied it is fine. The Rank Math one also needs an Author account to exploit.' },
  { title: 'Core updates itself.', text: 'Minor security releases apply automatically. Plugin and theme auto-updates are opt-in, though many hosts turn them on, and since WordPress 6.6 an update that fatals the homepage is rolled back.' },
  { title: 'A managed host changes the picture.', text: 'With a host that patches plugins and monitors the site, much of the cost above becomes someone else\'s job. That is a real service, and it costs money.' },
];

export const staticRisks = [
  { title: 'The npm supply chain is real.', text: 'In September 2025 the Shai-Hulud worm poisoned more than 500 npm packages, and a second wave followed that November. A build that installs a poisoned package can leak tokens. Static hosting does not protect the build.', href: 'https://flashpoint.io/blog/shai-hulud-worm-targeting-npm-supply-chains/', source: 'Flashpoint' },
  { title: '"npm audit: 0" is not "safe".', text: 'The audit only knows about advisories that have been published. It said nothing about a package that was compromised and not yet reported.', href: '', source: '' },
  { title: 'Your build and hosting accounts are the new target.', text: 'Whoever controls your Git repo, CI or hosting login controls your site. Use 2FA, short-lived tokens and least privilege.', href: '', source: '' },
  { title: 'Every service you add is a dependency.', text: 'Forms, analytics, consent and a CMS are other companies\' software. Their outages, price changes and security incidents are yours too.', href: '', source: '' },
];

export const stats = [
  { n: '11,334', label: 'new WordPress vulnerabilities in 2025, up 42%' },
  { n: '91%', label: 'of them in plugins. Only six in core.' },
  { n: '5 h', label: 'median time to first mass exploitation' },
  { n: '46%', label: 'had no patch available at disclosure' },
];

export type Check = { title: string; ask: string; kind: 'links' | 'og' | 'source' | 'term'; links?: { label: string; href: string }[]; code?: string; note?: string };
export const checklist: { group: string; items: Check[] }[] = [
  { group: 'The original six, run against this site', items: [
    { title: 'Sitemap', ask: 'Does it exist and list every page?', kind: 'links', links: [{ label: 'Open /sitemap-index.xml', href: '/sitemap-index.xml' }] },
    { title: '404s & redirects', ask: 'Does a mistyped URL land somewhere useful?', kind: 'links', links: [{ label: 'Try /prodcuts (redirects)', href: '/prodcuts' }, { label: 'Try /no-such-page (404)', href: '/no-such-page' }] },
    { title: 'Open Graph', ask: 'What does the link look like when pasted?', kind: 'og' },
    { title: 'Meta tags', ask: 'Title, description, canonical: are they really in the HTML?', kind: 'source' },
    { title: 'Consent', ask: 'Does anything track before you say yes?', kind: 'links', links: [{ label: 'Open the consent + tracking demo', href: '/demo/consent' }], note: 'This page loads no trackers, so there is nothing to gate here. The demo shows a gated one.' },
    { title: 'Forms', ask: 'Does it reject empty input and bots?', kind: 'links', links: [{ label: 'Try the form, then play the bot', href: '/demo/form' }] },
  ]},
  { group: 'What the original does not check', items: [
    { title: 'Is it patched?', ask: 'Run the audit on what actually ships.', kind: 'term', code: '$ npm audit\nfound 0 vulnerabilities', note: 'Real output from this site, when it was built. It only covers published advisories, so it is a floor, not a guarantee. On WordPress the equivalent is a list of plugins, each with its own vendor and update cadence.' },
    { title: 'Is it accessible?', ask: 'Run an automated audit, then remember it is only part of the job.', kind: 'term', code: '$ npm run a11y\naxe-core 4.14.0: no violations across 4 pages at 2 widths', note: 'Real output from this site. The first run was not clean: content outside landmarks, a skipped heading level on both demo pages, and scrolling code blocks and tables that a keyboard could not reach. A hand calculation also caught white badge text failing contrast on the pink end of the gradient. We fixed all of it and re-ran the audit. axe cannot judge contrast over gradients, so we calculated it: the lowest text pair is 5.1 to 1. Automated checks do not replace testing with a keyboard and a screen reader, which we have not done.' },
    { title: 'What can a stranger reach?', ask: 'Knock on the doors every WordPress site has.', kind: 'links', links: [{ label: 'GET /wp-login.php', href: '/wp-login.php' }, { label: 'GET /xmlrpc.php', href: '/xmlrpc.php' }, { label: 'GET /wp-admin/', href: '/wp-admin/' }], note: 'Static files have no login page, no database and no PHP to attack, so each is a plain 404. The host still has an account and a CDN that someone must secure.' },
  ]},
];
