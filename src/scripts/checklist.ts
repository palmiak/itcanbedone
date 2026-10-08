const boxes = document.querySelectorAll<HTMLInputElement>('.check input');
const out = document.getElementById('score');
const stamp = document.getElementById('passed');
const update = () => {
  const done = [...boxes].filter((b) => b.checked).length;
  if (out) out.textContent = `${done} / ${boxes.length} verified`;
  stamp?.classList.toggle('show', done === boxes.length && boxes.length > 0);
};
boxes.forEach((b) => b.addEventListener('change', update));
update();
