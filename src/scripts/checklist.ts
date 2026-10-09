const boxes = document.querySelectorAll<HTMLInputElement>('.check input');
const out = document.getElementById('score');
const stamp = document.getElementById('passed');
const update = () => {
  const done = [...boxes].filter((b) => b.checked).length;
  if (out) out.textContent = `${done} / ${boxes.length} verified`;
  stamp?.classList.toggle('show', done === boxes.length && boxes.length > 0);
};
boxes.forEach((b) => b.addEventListener('change', update));

// Opening an example (a link, the source toggle, the share card or a code block) ticks its box.
// It only ever ticks; the box can still be changed by hand.
document.querySelectorAll<HTMLElement>('.check li').forEach((li) => {
  const box = li.querySelector<HTMLInputElement>('input');
  li.querySelector('.artifact')?.addEventListener('click', () => {
    if (box && !box.checked) {
      box.checked = true;
      box.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
});
update();
