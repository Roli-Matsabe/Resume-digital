import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/dm-sans/latin-700.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "./style.css";
import "./story.css";
import { resume } from "./content.js";

const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const down =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg>';
const star =
  '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="m40 0 6 25L64 8l-7 25 23 7-25 6 17 18-25-7-7 23-6-25-18 17 7-25L0 40l25-6L8 16l25 7z" fill="currentColor"/></svg>';
const tags = (items) =>
  items.map((item) => `<span class="tag">${escape(item)}</span>`).join("");
const safeUrl = (value) => {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? escape(url.href) : "";
  } catch {
    return "";
  }
};
const timeline = (items) =>
  items
    .map(
      (item, index) => `
  <article class="timeline-entry">
    <div class="timeline-date"><span class="timeline-dot"></span>${escape(item.period)}</div>
    <div class="timeline-body"><span class="entry-number">0${index + 1}</span><h3>${escape(item.title)}</h3><p class="organization">${escape(item.organization)}</p><p>${escape(item.description)}</p>${item.highlights?.length ? `<ul class="experience-highlights">${item.highlights.map((point) => `<li>${escape(point)}</li>`).join("")}</ul>` : ""}<div class="tags">${tags(item.tags)}</div></div>
  </article>`,
    )
    .join("");

document.title = `${resume.name} | Digital Growth, Transformation & Martech`;
document.querySelector('meta[name="description"]').content =
  `${resume.fullName || resume.name} — Digital transformation, customer experience, and digital growth. Explore my experience, skills, and impact.`;
document.querySelector("#app").innerHTML = `
  <header class="site-header" id="top">
    <a href="#top" class="brand" aria-label="${escape(resume.name)} home"><span class="brand-mark">${escape(resume.initials.toLowerCase())}<span>.</span></span><span>${escape(resume.name)}</span></a>
    <button class="menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="site-nav"><span></span><span></span></button>
    <nav id="site-nav" aria-label="Main navigation"><a href="#approach">My approach</a><a href="#experience">Experience</a><a href="#work">Selected impact</a><a href="#contact" class="nav-contact">Let’s talk ${arrow}</a></nav>
  </header>
  <main id="main">
    <section class="hero section-shell" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="tiny-star">${star}</span> ${escape(resume.eyebrow)}</p>
        <h1 id="hero-title">${escape(resume.headline[0])}<br>${escape(resume.headline[1])}<br><em>${escape(resume.headline[2])}</em></h1>
        <p class="hero-specialty">Digital transformation <span>·</span> Customer experience <span>·</span> Martech</p><p class="hero-introduction">${escape(resume.introduction)}</p>
        <div class="hero-actions"><a class="button button-dark" href="#about">Explore my story ${down}</a><a class="text-button" href="${import.meta.env.BASE_URL}Roli-Matsabe-CV.pdf" download="Roli-Matsabe-CV.pdf">Download CV ${arrow}</a></div>
        ${resume.isSample ? '<p class="sample-label"><span></span> FIRST EDITION · SAMPLE RESUME CONTENT</p>' : ""}
      </div>
      <div class="hero-art scene-shell">
        <div class="scene-topline"><span>THE CONNECTED GROWTH ENGINE</span><span class="scene-indicator"></span></div>
        <div class="scene-grid" aria-hidden="true"></div>
        <div id="hero-canvas" class="webgl-scene" role="img" aria-label="Interactive 3D orbital sculpture: customer experience, data, and technology connected around one business goal."><div class="scene-fallback" aria-hidden="true"><span></span><span></span><span></span><i></i></div></div>
        <span class="scene-tag tag-customer">Customer experience</span><span class="scene-tag tag-tech">Technology</span><span class="scene-tag tag-growth">Growth</span>
        <div class="scene-bottomline"><span>PEOPLE + PLATFORMS + PURPOSE</span><div class="scene-controls"><button data-rotate="-1" aria-label="Rotate 3D scene left">←</button><button data-rotate="1" aria-label="Rotate 3D scene right">→</button></div></div>
        <span class="art-caption"><span></span> ${escape(resume.location)}</span>
      </div>
      <div class="hero-traits">${resume.traits.map((trait) => `<div><span class="eyebrow">${escape(trait.label)}</span><p>${escape(trait.value)}</p></div>`).join("")}<a href="#about" class="scroll-hint" aria-label="Scroll to about">SCROLL TO DISCOVER ${down}</a></div>
    </section>
    <section id="about" class="about-section section-shell" aria-labelledby="about-title">
      <div class="section-heading"><p class="eyebrow section-index">01 / THE INTRODUCTION</p><h2 id="about-title">Digital is complex.<br><em>I connect the dots.</em></h2><span class="about-star">${star}</span></div>
      <div class="about-copy">${resume.about.map((paragraph) => `<p>${escape(paragraph)}</p>`).join("")}<div class="profile-details"><span>${escape(resume.fullName)}</span><span>${escape(resume.languages.join(" · "))}</span></div><div class="personal-note"><span class="note-line"></span><p>${escape(resume.note)}</p></div></div>
    </section>
    <section id="approach" class="approach-section section-shell" aria-labelledby="approach-title">
      <div class="section-top"><div><p class="eyebrow section-index">02 / HOW I CREATE VALUE</p><h2 id="approach-title">From disconnected touchpoints<br>to <em>connected growth.</em></h2></div><p class="section-aside">Follow the connections.<br>That’s where the opportunity is.</p></div>
      <div class="story-layout"><div class="story-stage" data-phase="0"><div class="story-stage-top"><span class="story-stage-label">01 / UNDERSTAND</span><span>THE APPROACH</span></div><div id="story-canvas" class="webgl-scene" role="img" aria-label="Three-dimensional connected system that changes with the Understand, Connect, and Grow chapters."><div class="scene-fallback" aria-hidden="true"><span></span><span></span><span></span><i></i></div></div><p class="story-stage-caption">Start with the customer.</p><div class="story-stage-dots" aria-hidden="true"><span></span><span></span><span></span></div></div>
      <div class="story-steps">
        <article class="story-step is-active"><span class="story-number">01</span><span class="eyebrow story-step-label">UNDERSTAND</span><h3><button class="story-step-trigger" aria-pressed="true">Find the friction.<br><em>See the opportunity.</em></button></h3><p>Growth starts with understanding what customers are trying to do — and what gets in their way. I use analytics, behaviour data, and business context to turn scattered signals into clear priorities.</p><div class="story-proof"><span>IN PRACTICE</span><p>At Tsogo Sun, I used customer behaviour data to identify journey friction and prioritise digital improvements.</p></div></article>
        <article class="story-step"><span class="story-number">02</span><span class="eyebrow story-step-label">CONNECT</span><h3><button class="story-step-trigger" aria-pressed="false">Bring the pieces<br><em>together.</em></button></h3><p>A better tool alone isn’t a transformation. I connect platforms, workflows, teams, and customer journeys so that strategy becomes something people can actually use.</p><div class="story-proof"><span>IN PRACTICE</span><p>At First Dream Agency, I brought CRM, automation, content, and digital channels together across the customer lifecycle.</p></div></article>
        <article class="story-step"><span class="story-number">03</span><span class="eyebrow story-step-label">GROW</span><h3><button class="story-step-trigger" aria-pressed="false">Make progress<br><em>measurable.</em></button></h3><p>Then I test, learn, and improve. The goal is a stronger customer experience that also delivers business value — from the first visit to the next conversion.</p><div class="story-proof"><span>IN PRACTICE</span><p>At Engen, digital growth strategies delivered 70% traffic growth, alongside stronger engagement and conversion performance.</p></div></article>
      </div></div>
    </section>
    <section id="experience" class="experience-section section-shell" aria-labelledby="experience-title">
      <div class="section-top"><div><p class="eyebrow section-index">03 / THE JOURNEY</p><h2 id="experience-title">A decade of <em>building what’s next.</em></h2></div><div class="tabs" role="tablist" aria-label="Resume sections"><button id="experience-tab" role="tab" aria-selected="true" aria-controls="experience-panel" tabindex="0">Experience</button><button id="education-tab" role="tab" aria-selected="false" aria-controls="education-panel" tabindex="-1">Education</button></div></div>
      <div id="experience-panel" class="timeline" role="tabpanel" aria-labelledby="experience-tab" tabindex="0">${timeline(resume.experience)}</div>
      <div id="education-panel" class="timeline" role="tabpanel" aria-labelledby="education-tab" tabindex="0" hidden>${timeline(resume.education)}</div>
    </section>
    <section id="work" class="work-section section-shell" aria-labelledby="work-title">
      <div class="section-top"><div><p class="eyebrow section-index">04 / SELECTED IMPACT</p><h2 id="work-title">Real work. <em>Measurable impact.</em></h2></div><p class="section-aside">Strategy, put into practice.<br>Results, made tangible.</p></div>
      <div class="project-grid">${resume.projects.map((project) => `<article class="project-card"><button class="project-open" data-project="${escape(project.id)}" aria-label="View ${escape(project.title)}"><div class="project-art project-art-${escape(project.art)}" aria-hidden="true"><span class="project-art-label">CASE STUDY ${escape(project.number)}</span>${project.art === "orbit" ? '<div class="orbit-system"><span class="orbit orbit-one"></span><span class="orbit orbit-two"></span><span class="orbit orbit-three"></span><span class="orbit-center"></span></div>' : '<div class="tile-composition"><span class="tile tile-one"></span><span class="tile tile-two"></span><span class="tile tile-three"></span><span class="tile tile-four"></span></div>'}<span class="project-art-metric">${escape(project.artHeadline)}<small>${escape(project.artCaption)}</small></span><span class="project-arrow">${arrow}</span></div><div class="project-info"><span class="eyebrow">${escape(project.category)}</span><h3>${escape(project.title)}</h3><p>${escape(project.summary)}</p></div></button><div class="tags">${tags(project.tags)}</div></article>`).join("")}</div>
    </section>
    <section id="skills" class="skills-section section-shell" aria-labelledby="skills-title"><div class="section-heading"><p class="eyebrow section-index">05 / WHAT I BRING</p><h2 id="skills-title">The thinking.<br>The tools.<br><em>The follow-through.</em></h2><p>Strategy to execution, with the technical fluency<br>and leadership to connect both.</p></div><div class="skill-groups">${resume.skills.map((group) => `<div class="skill-group"><h3>${escape(group.category)}</h3><div class="tags">${tags(group.items)}</div></div>`).join("")}</div></section>
    <section id="contact" class="contact-section" aria-labelledby="contact-title"><div class="contact-inner"><p class="eyebrow">06 / THE NEXT CHAPTER</p><h2 id="contact-title">Good things start<br>with a <em>conversation.</em></h2><p>${escape(resume.contact.message)}</p><div class="contact-location">${escape(resume.location)}</div><div class="contact-actions">${resume.contact.email ? `<a class="button button-cream" href="mailto:${escape(encodeURIComponent(resume.contact.email))}">Let’s discuss your opportunity ${arrow}</a>` : '<span class="contact-pending">Contact details coming soon <span>↗</span></span>'}${resume.contact.links
      .filter((link) => safeUrl(link.url))
      .map(
        (link) =>
          `<a class="contact-link" href="${safeUrl(link.url)}" target="_blank" rel="noopener noreferrer">${escape(link.label)} ${arrow}</a>`,
      )
      .join(
        "",
      )}</div><div class="contact-details"><a href="mailto:${escape(resume.contact.email)}">${escape(resume.contact.email)}</a><a href="tel:${escape(resume.contact.phoneHref)}">${escape(resume.contact.phone)}</a></div><div class="contact-flower" aria-hidden="true">${star}</div><span class="contact-doodle" aria-hidden="true"></span></div></section>
  </main>
  <footer class="site-footer"><a href="#top" class="brand"><span class="brand-mark">${escape(resume.initials.toLowerCase())}<span>.</span></span><span>${escape(resume.name)}</span></a><button class="print-resume footer-print">Print résumé ${arrow}</button><p>A story still being written. <span>© ${new Date().getFullYear()}</span></p><a href="#top" class="back-top">Back to top ${arrow}</a></footer>
  <button class="motion-toggle" aria-pressed="false">Ⅱ <span>Pause motion</span></button>
  <dialog id="project-dialog" aria-labelledby="dialog-title"><button class="dialog-close" aria-label="Close project details">×</button><div id="dialog-content"></div></dialog>
`;

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const closeMenu = () => {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  navigation.classList.remove("is-open");
};
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(expanded));
  menuToggle.setAttribute(
    "aria-label",
    expanded ? "Close navigation" : "Open navigation",
  );
  navigation.classList.toggle("is-open", expanded);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuToggle.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);

const tabButtons = [...document.querySelectorAll('[role="tab"]')];
function selectTab(selectedTab) {
  tabButtons.forEach((tab) => {
    const selected = tab === selectedTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.getElementById(tab.getAttribute("aria-controls")).hidden =
      !selected;
  });
}
tabButtons.forEach((tab) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next =
        event.key === "Home"
          ? tabButtons[0]
          : event.key === "End"
            ? tabButtons.at(-1)
            : tabButtons[
                (tabButtons.indexOf(tab) +
                  (event.key === "ArrowRight" ? 1 : -1) +
                  tabButtons.length) %
                  tabButtons.length
              ];
      selectTab(next);
      next.focus();
    }
  });
});

const dialog = document.querySelector("#project-dialog");
document.querySelectorAll(".project-open").forEach((button) =>
  button.addEventListener("click", () => {
    const project = resume.projects.find(
      (entry) => entry.id === button.dataset.project,
    );
    document.querySelector("#dialog-content").innerHTML =
      `<p class="eyebrow">${escape(project.category)}${resume.isSample ? " · SAMPLE PROJECT" : ""}</p><h2 id="dialog-title">${escape(project.title)}</h2><p class="dialog-summary">${escape(project.summary)}</p><div class="tags">${tags(project.tags)}</div>${[
        ["The challenge", project.challenge],
        ["The approach", project.approach],
        ["The outcome", project.outcome],
      ]
        .map(([title, copy]) => `<h3>${title}</h3><p>${escape(copy)}</p>`)
        .join(
          "",
        )}${safeUrl(project.url) ? `<a class="button button-dark" href="${safeUrl(project.url)}" target="_blank" rel="noopener noreferrer">Visit project ${arrow}</a>` : ""}`;
    dialog.showModal();
    document.body.classList.add("modal-open");
  }),
);
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    dialog.close();
});
dialog.addEventListener("close", () =>
  document.body.classList.remove("modal-open"),
);
document
  .querySelectorAll(".print-resume")
  .forEach((button) => button.addEventListener("click", () => window.print()));

import("./story.js");
