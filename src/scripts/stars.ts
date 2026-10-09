// Random shining stars: each spark fades in and out at its own pace, then reappears somewhere new.
// Skipped entirely for visitors who prefer reduced motion.
const sky = document.querySelector<HTMLElement>('.sky');
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (sky && !calm) {
  const count = window.innerWidth < 600 ? 14 : 30;
  const place = (el: HTMLElement) => {
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 92}%`;
    el.style.animationDuration = `${2.4 + Math.random() * 4.2}s`;
  };
  for (let i = 0; i < count; i += 1) {
    const spark = document.createElement('i');
    spark.className = Math.random() < 0.22 ? 'spark gold' : 'spark';
    const size = 2 + Math.random() * 2.6;
    spark.style.width = spark.style.height = `${size}px`;
    spark.style.animationDelay = `${Math.random() * 6}s`;
    place(spark);
    spark.addEventListener('animationiteration', () => place(spark));
    sky.append(spark);
  }
}
