export type Outcome = 'static' | 'cms' | 'wp' | 'platform' | 'vibe';

export type Option = { value: string; label: string; scores: Partial<Record<Outcome, number>>; why: Partial<Record<Outcome, string>> };
export type Question = { id: string; title: string; options: Option[] };

// A nudge, not a verdict: five answers, a few points each. Ties go to the first outcome in `priority`.
// Choosing "prototype" outweighs everything else on purpose: a throwaway is a throwaway.
export const priority: Outcome[] = ['platform', 'wp', 'cms', 'static', 'vibe'];

export const questions: Question[] = [
  { id: 'build', title: 'What are you building?', options: [
    { value: 'brochure', label: 'A brochure site, marketing pages, docs or a blog', scores: { static: 3, cms: 2, wp: 1 }, why: { static: 'Mostly pages is what static does best.', cms: 'Mostly pages suits a static front end.', wp: 'WordPress handles pages well, too.' } },
    { value: 'shop', label: 'A shop or a membership site', scores: { platform: 5, wp: 3 }, why: { platform: 'Shops and memberships need a server and a database.', wp: 'WordPress, with its ecosystem, covers shops and memberships.' } },
    { value: 'app', label: 'A portal or an app with user accounts', scores: { platform: 5 }, why: { platform: 'Accounts and app logic need a real backend.' } },
    { value: 'proto', label: 'A throwaway demo or a prototype', scores: { vibe: 20 }, why: { vibe: 'A throwaway only has to look done.' } },
  ] },
  { id: 'editors', title: 'Who will edit the content?', options: [
    { value: 'devs', label: 'Developers who are comfortable with git', scores: { static: 3 }, why: { static: 'Markdown in git is a fine editor for people who like git.' } },
    { value: 'team', label: 'A non-technical team, regularly', scores: { wp: 2, cms: 2 }, why: { wp: 'The WordPress admin is hard to beat for non-technical editors.', cms: 'A headless CMS gives your editors a friendly screen.', platform: 'Non-technical editors need a proper admin.' } },
    { value: 'one', label: 'One or two people, now and then', scores: { static: 1, cms: 2, wp: 1 }, why: { cms: 'A couple of occasional editors do well with a light CMS.', static: 'Occasional edits are fine in git.' } },
  ] },
  { id: 'cadence', title: 'How often does the content change?', options: [
    { value: 'rare', label: 'A few times a month or less', scores: { static: 2 }, why: { static: 'Content that rarely changes is cheap to rebuild and serve.' } },
    { value: 'weekly', label: 'About weekly', scores: { static: 1, cms: 1, wp: 1 }, why: { static: 'Weekly changes are easy with a rebuild per change.', cms: 'Weekly changes suit a CMS and a rebuild.', wp: 'Weekly changes are routine in WordPress.' } },
    { value: 'daily', label: 'Many times a day', scores: { wp: 3, platform: 1, cms: 1 }, why: { wp: 'Frequent publishing is what a CMS-first platform is built for.', platform: 'Constant change favours a live system.', cms: 'Frequent changes need a CMS and quick builds.' } },
  ] },
  { id: 'owner', title: 'Who owns updates and security after launch?', options: [
    { value: 'nobody', label: 'Nobody, honestly', scores: { static: 3, wp: -3, cms: -1, platform: -1 }, why: { static: 'With no owner, less to patch matters most. Static files decay more slowly than plugins do.' } },
    { value: 'host', label: 'A host or an agency, on a plan', scores: { wp: 1 }, why: { wp: 'A managed host or agency covers plugin patching and monitoring.', platform: 'A host or agency can own the updates.', cms: 'A host or agency can own the updates.', static: 'A host patches its own platform.' } },
    { value: 'me', label: 'Me or my own team', scores: { static: 1 }, why: { static: 'You can own a small toolchain, and the build is easy to reason about.', wp: 'You can own plugin patching if you plan for it.', cms: 'You can own the build and the CMS.', platform: 'You can own the stack if you plan for it.' } },
  ] },
  { id: 'logins', title: 'Do visitors need logins or personalised pages?', options: [
    { value: 'no', label: 'No', scores: { static: 2 }, why: { static: 'No logins means nothing needs a server.', cms: 'No logins keeps the front end simple.' } },
    { value: 'forms', label: 'Just a contact form or a newsletter signup', scores: { static: 1, cms: 1 }, why: { static: 'A form service covers a contact form or signup.', cms: 'A form service covers a contact form or signup.' } },
    { value: 'yes', label: 'Yes: accounts, orders or personalised content', scores: { platform: 4, wp: 2, static: -4, cms: -3 }, why: { platform: 'Accounts and orders need a server-side system.', wp: 'WordPress can run accounts, with plugins to keep patched.' } },
  ] },
];

export type Result = { title: string; summary: string; watch: string[]; links: { label: string; href: string }[] };
export const results: Record<Outcome, Result> = {
  static: { title: 'Static is a good fit.', summary: 'A static site covers the fourteen layers without running an application server of your own.', watch: ['Plan a form service for the contact form, and a consent library if marketing adds trackers.', 'Someone still has to bump the build dependencies. Budget about an hour a month.'], links: [{ label: 'The fourteen layers', href: '#waterline' }, { label: 'The receipts', href: '#receipt' }] },
  cms: { title: 'Static, with a CMS for your editors.', summary: 'Static gives you speed and a small attack surface, and a headless CMS gives your editors a friendly screen.', watch: ['The CMS is a subscription, or a server you maintain. See the third receipt.', 'Content kept in a SaaS CMS needs its own backups.'], links: [{ label: 'The receipts', href: '#receipt' }, { label: 'Static has its own risks', href: '#static-risks' }] },
  wp: { title: 'WordPress is probably the better fit.', summary: 'Regular edits by a non-technical team is exactly what WordPress is good at.', watch: ['Someone has to own plugin patching and monitoring: a managed host, an agency or you.', 'Keep the plugin count low. Each plugin is attack surface, as the vulnerability table shows.'], links: [{ label: 'The vulnerability table', href: '#plugins' }, { label: 'The receipts', href: '#receipt' }] },
  platform: { title: 'WordPress, or something else.', summary: 'Shops, memberships and accounts need a server and a database. A static site fights you here, and the original is right about that.', watch: ['Whatever you pick needs an owner for updates and security.', 'A static marketing site next to the app is a common split, if the public pages are mostly content.'], links: [{ label: 'The vulnerability table', href: '#plugins' }, { label: 'The receipts', href: '#receipt' }] },
  vibe: { title: 'Vibe it, and call it a prototype.', summary: 'For a throwaway demo, looking done is enough.', watch: ['It will not have the other 80%: sitemap, 404s, consent, forms, security.', 'If it ever ships, rebuild it as one of the other options first.'], links: [{ label: 'What the other 80% is', href: '#waterline' }] },
};

export const outcomeNames: Record<Outcome, string> = { static: 'a static site', cms: 'static with a CMS', wp: 'WordPress', platform: 'WordPress or another platform', vibe: 'a quick vibe-coded prototype' };
