import * as CookieConsent from 'vanilla-cookieconsent';

const tracker = document.getElementById('s-tracker');
const cookie = document.getElementById('s-cookie');

const paint = () => {
  const accepted = CookieConsent.acceptedCategory('analytics');
  const loaded = Boolean((window as unknown as { __trackerLoaded?: boolean }).__trackerLoaded);
  const decided = CookieConsent.validConsent();
  if (tracker) {
    tracker.textContent = loaded ? 'loaded · consent: analytics' : accepted ? 'loading…' : `blocked · consent: ${decided ? 'declined' : 'none'}`;
    tracker.className = loaded ? 'ok' : 'zero';
  }
  if (cookie) {
    cookie.textContent = decided ? 'set (cc_cookie)' : 'not set';
    cookie.className = decided ? 'ok' : 'zero';
  }
};

CookieConsent.run({
  guiOptions: { consentModal: { layout: 'box', position: 'bottom right' } },
  categories: {
    necessary: { enabled: true, readOnly: true },
    analytics: {},
  },
  onConsent: paint,
  onChange: paint,
  language: {
    default: 'en',
    translations: {
      en: {
        consentModal: {
          title: 'Nothing has loaded yet.',
          description: 'Allow analytics and the tracker script below will load. Decline and it never does.',
          acceptAllBtn: 'Allow analytics',
          acceptNecessaryBtn: 'No thanks',
          showPreferencesBtn: 'Choose',
        },
        preferencesModal: {
          title: 'Privacy settings',
          acceptAllBtn: 'Allow analytics',
          acceptNecessaryBtn: 'Decline all',
          savePreferencesBtn: 'Save choice',
          closeIconLabel: 'Close',
          sections: [
            { title: 'Necessary', description: 'Remembers your choice. Always on.', linkedCategory: 'necessary' },
            { title: 'Analytics', description: 'A stand-in tracker. It sends nothing anywhere.', linkedCategory: 'analytics' },
          ],
        },
      },
    },
  },
});

document.addEventListener('tracker:loaded', paint);
document.getElementById('open-prefs')?.addEventListener('click', () => CookieConsent.showPreferences());
document.getElementById('reset')?.addEventListener('click', () => {
  CookieConsent.reset(true);
  window.location.reload();
});
paint();
