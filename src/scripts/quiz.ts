type Outcome = 'static' | 'cms' | 'wp' | 'platform' | 'vibe';
type Option = { value: string; label: string; scores: Partial<Record<Outcome, number>>; why: Partial<Record<Outcome, string>> };
type Question = { id: string; title: string; options: Option[] };
type Result = { title: string; summary: string; watch: string[]; links: { label: string; href: string }[] };
type Data = { questions: Question[]; priority: Outcome[]; results: Record<Outcome, Result>; names: Record<Outcome, string> };

const form = document.getElementById('line-quiz') as HTMLFormElement | null;
const dataEl = document.getElementById('line-data');
const box = document.getElementById('quiz-result');
const progress = document.getElementById('quiz-progress');

if (form && dataEl && box && progress) {
  const data = JSON.parse(dataEl.textContent ?? '{}') as Data;
  const el = (tag: string, text?: string, cls?: string) => {
    const e = document.createElement(tag);
    if (text) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  };

  const picked = () => data.questions.map((q) => {
    const v = (form.elements.namedItem(q.id) as RadioNodeList | null)?.value;
    return q.options.find((o) => o.value === v);
  });

  const render = () => {
    const answers = picked();
    const done = answers.filter(Boolean).length;
    progress.textContent = `${done} of ${data.questions.length} answered`;
    if (done < data.questions.length) { box.hidden = true; box.replaceChildren(); return; }

    const score: Record<Outcome, number> = { static: 0, cms: 0, wp: 0, platform: 0, vibe: 0 };
    answers.forEach((a) => Object.entries(a!.scores).forEach(([k, v]) => { score[k as Outcome] += v ?? 0; }));
    const ranked = [...data.priority].sort((a, b) => score[b] - score[a] || data.priority.indexOf(a) - data.priority.indexOf(b));
    const win = ranked[0];
    const second = ranked[1];
    const r = data.results[win];
    const ids = Object.fromEntries(data.questions.map((q, i) => [q.id, answers[i]!.value]));

    const reasons = answers.map((a) => a!.why[win]).filter((t): t is string => Boolean(t));
    const watch = [...r.watch];
    if (win === 'wp' && ids.owner === 'nobody') watch.unshift('You said nobody owns updates. Unpatched WordPress decays, so pick a managed host or think again.');
    if (win === 'platform' && ids.owner === 'nobody') watch.unshift('Having no owner for updates is the riskiest combination for an app or a shop.');
    if (win === 'static' && ids.editors === 'team') watch.unshift('Your editors are not git users, so you will probably want a CMS.');
    if ((win === 'static' || win === 'cms') && ids.cadence === 'daily') watch.unshift('Content that changes many times a day means a build per change. Check your build times.');

    box.replaceChildren();
    box.append(el('p', 'Your line', 'result-kicker'), el('h3', r.title, 'display result-title'), el('p', r.summary, 'result-summary'));
    if (reasons.length) {
      box.append(el('h4', 'Why', 'result-head'));
      const ul = el('ul', undefined, 'points');
      reasons.forEach((t) => ul.append(el('li', t)));
      box.append(ul);
    }
    box.append(el('h4', 'Watch out for', 'result-head'));
    const wl = el('ul', undefined, 'points');
    watch.forEach((t) => wl.append(el('li', t)));
    box.append(wl);
    if (score[win] - score[second] <= 1 && score[second] > 0) {
      box.append(el('p', `Close call: ${data.names[second]} came a very near second. If it matters, read both columns of the receipts.`, 'small close'));
    }
    const links = el('p', undefined, 'result-links');
    r.links.forEach((l) => { const a = el('a', `${l.label} →`) as HTMLAnchorElement; a.href = l.href; links.append(a); });
    const again = el('button', 'Start over', 'btn plain again') as HTMLButtonElement;
    again.type = 'button';
    again.addEventListener('click', () => { form.reset(); render(); (form.querySelector('input') as HTMLInputElement | null)?.focus(); });
    box.append(links, again);
    box.hidden = false;
  };

  form.addEventListener('change', render);
  form.addEventListener('submit', (e) => e.preventDefault());
  form.hidden = false;
  render();
}
