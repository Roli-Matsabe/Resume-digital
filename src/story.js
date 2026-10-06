const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
let paused = motionPreference.matches;
let scenes;
let phase = 0;
const motionButton = document.querySelector(".motion-toggle");
const storySteps = [...document.querySelectorAll(".story-step")];
const phaseLabels = ["01 / UNDERSTAND", "02 / CONNECT", "03 / GROW"];
const phaseCaptions = [
  "Start with the customer.",
  "Make the systems work together.",
  "Turn insight into measurable growth.",
];

function syncMotion() {
  document.documentElement.dataset.motion = paused ? "paused" : "playing";
  motionButton.setAttribute("aria-pressed", String(paused));
  motionButton.innerHTML = `${paused ? "▶" : "Ⅱ"} <span>${paused ? "Play motion" : "Pause motion"}</span>`;
  scenes?.setPaused(paused);
}
syncMotion();
motionButton.addEventListener("click", () => {
  paused = !paused;
  syncMotion();
});
motionPreference.addEventListener("change", (event) => {
  paused = event.matches;
  syncMotion();
});

function selectPhase(value) {
  phase = value;
  storySteps.forEach((step, index) => {
    step.classList.toggle("is-active", index === value);
    step
      .querySelector("button")
      .setAttribute("aria-pressed", String(index === value));
  });
  document.querySelector(".story-stage-label").textContent = phaseLabels[value];
  document.querySelector(".story-stage-caption").textContent =
    phaseCaptions[value];
  document.querySelector(".story-stage").dataset.phase = String(value);
  scenes?.setPhase(value);
}
storySteps.forEach((step, index) =>
  step
    .querySelector("button")
    .addEventListener("click", () => selectPhase(index)),
);
let scrollFrame;
function onScroll() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    const centre = window.innerHeight * 0.55;
    const rects = storySteps.map((step) => step.getBoundingClientRect());
    if (rects[0].top > window.innerHeight || rects.at(-1).bottom < 0) return;
    let nearest = 0;
    let distance = Infinity;
    rects.forEach((rect, index) => {
      const candidate = Math.abs(rect.top + rect.height / 2 - centre);
      if (candidate < distance) {
        nearest = index;
        distance = candidate;
      }
    });
    if (nearest !== phase) selectPhase(nearest);
  });
}
window.addEventListener("scroll", onScroll, { passive: true });
selectPhase(0);

// Load 3D separately so the resume and navigation render immediately.
import("./scenes.js")
  .then(({ mountScenes }) => {
    scenes = mountScenes({ reducedMotion: paused });
    scenes.setPhase(phase);
    document
      .querySelectorAll("[data-rotate]")
      .forEach((button) =>
        button.addEventListener("click", () =>
          scenes.rotate(Number(button.dataset.rotate)),
        ),
      );
  })
  .catch(() => {
    document.querySelectorAll(".webgl-scene").forEach((host) => {
      host.dataset.sceneState = "fallback";
    });
  });

if (import.meta.hot)
  import.meta.hot.dispose(() => {
    scenes?.dispose();
    window.removeEventListener("scroll", onScroll);
    cancelAnimationFrame(scrollFrame);
  });
