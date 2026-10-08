const form = document.getElementById('demo-form') as HTMLFormElement;
const log = document.getElementById('form-log') as HTMLElement;
const trap = form.elements.namedItem('bot-field') as HTMLInputElement;

const line = (left: string, right: string, cls: string) => {
  const row = document.createElement('div');
  row.className = 'row';
  const a = document.createElement('span');
  a.textContent = left;
  const b = document.createElement('span');
  b.textContent = right;
  b.className = cls;
  row.append(a, b);
  log.append(row);
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (trap.value) {
    line('POST /contact', 'rejected: honeypot filled', 'zero');
  } else {
    line('POST /contact', 'saved · team notified', 'ok');
  }
  form.reset();
});

document.getElementById('bot')?.addEventListener('click', () => {
  (form.elements.namedItem('name') as HTMLInputElement).value = 'Totally Real Person';
  (form.elements.namedItem('email') as HTMLInputElement).value = 'bot@example.com';
  (form.elements.namedItem('message') as HTMLTextAreaElement).value = 'Buy my SEO services, click here now.';
  trap.value = 'http://spam.example';
  form.requestSubmit();
});
