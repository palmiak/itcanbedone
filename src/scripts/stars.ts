// A calm sky: only one or two stars shine at a time. Each fades in and out slowly, rests for a
// random moment, then shines again somewhere new. Skipped entirely for reduced motion.
const sky = document.querySelector<HTMLElement>('.sky');
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const between = (min: number, max: number) => min + Math.random() * (max - min);
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

if (sky && !calm) {
  const shine = async (spark: HTMLElement, startDelay: number) => {
    await wait(startDelay);
    for (;;) {
      spark.style.left = `${between(2, 98)}%`;
      spark.style.top = `${between(3, 92)}%`;
      const size = between(2.2, 4.4);
      spark.style.width = spark.style.height = `${size}px`;
      spark.classList.toggle('gold', Math.random() < 0.2);
      const fade = spark.animate(
        [
          { opacity: 0, transform: 'scale(0.4)' },
          { opacity: 1, transform: 'scale(1.25)', offset: 0.5 },
          { opacity: 0, transform: 'scale(0.4)' },
        ],
        { duration: between(3500, 6500), easing: 'ease-in-out', fill: 'backwards' },
      );
      await fade.finished.catch(() => undefined);
      await wait(between(400, 2800));
    }
  };

  for (const delay of [600, 2600]) {
    const spark = document.createElement('i');
    spark.className = 'spark';
    sky.append(spark);
    void shine(spark, delay);
  }
}
