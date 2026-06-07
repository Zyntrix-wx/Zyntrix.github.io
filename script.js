const state = BLOG_CONTENT;

const articleList = document.querySelector("[data-article-list]");
const projectList = document.querySelector("[data-project-list]");
const stackList = document.querySelector("[data-stack-list]");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderProfile() {
  const { profile } = state;

  document.title = `${profile.name} 的个人博客`;
  document.querySelector('meta[name="description"]').setAttribute("content", profile.intro);
  document.querySelector("[data-profile-name]").textContent = profile.name;
  document.querySelector("[data-profile-heading]").textContent = `你好，我是 ${profile.name}`;
  document.querySelector("[data-profile-tagline]").textContent = profile.tagline;
  document.querySelector("[data-profile-intro]").textContent = profile.intro;
  document.querySelector("[data-footer-name]").textContent = profile.name;

  const emailLink = document.querySelector("[data-profile-email]");
  emailLink.textContent = profile.email;
  emailLink.href = `mailto:${profile.email}`;

  const githubLink = document.querySelector("[data-profile-github]");
  githubLink.href = profile.github || "https://github.com/";
}

function renderArticles() {
  articleList.innerHTML = state.articles.length
    ? state.articles
    .map(
      (article) => `
        <article class="post">
          <time datetime="${escapeHtml(article.date)}">${escapeHtml(article.date)}</time>
          <h3>${escapeHtml(article.title)}</h3>
          <p>${escapeHtml(article.summary)}</p>
          <div class="tags">${article.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        </article>
      `,
    )
      .join("")
    : `<p class="empty-state">暂时还没有发布文章。</p>`;
}

function renderProjects() {
  document.querySelector("[data-project-filters]").hidden = state.projects.length === 0;

  projectList.innerHTML = state.projects.length
    ? state.projects
    .map(
      (project) => `
        <article class="project" data-category="${escapeHtml(project.category)}">
          <div class="project-meta">${escapeHtml(project.meta)}</div>
          <h3>${escapeHtml(project.title)}</h3>
          <p>${escapeHtml(project.summary)}</p>
          <div class="tags">${project.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
          <details>
            <summary>补充说明</summary>
            <p>${escapeHtml(project.detail || "暂无补充说明。")}</p>
          </details>
          ${
            project.link
              ? `<p class="project-links"><a href="${escapeHtml(project.link)}" target="_blank" rel="noreferrer">代码入口</a></p>`
              : ""
          }
        </article>
      `,
    )
      .join("")
    : `<p class="empty-state">暂时还没有公开项目。</p>`;

  applyProjectFilter();
}

function renderStack() {
  stackList.innerHTML = state.stack.length
    ? state.stack
    .map(
      (item) => `
        <section class="stack-group">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </section>
      `,
    )
      .join("")
    : `<p class="empty-state">暂时还没有整理技术栈。</p>`;
}

function applyProjectFilter() {
  const activeFilter = document.querySelector("[data-filter].is-active")?.dataset.filter || "all";

  document.querySelectorAll(".project").forEach((project) => {
    project.hidden = activeFilter !== "all" && project.dataset.category !== activeFilter;
  });
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    applyProjectFilter();
  });
});

const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

navToggle.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  nav.classList.toggle("is-open", !expanded);
});

nav.addEventListener("click", () => {
  navToggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("is-open");
});

const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".site-nav a")];

const observer = new IntersectionObserver(
  (entries) => {
    const current = entries.find((entry) => entry.isIntersecting);
    if (!current) return;

    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current.target.id}`);
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.1 },
);

sections.forEach((section) => observer.observe(section));
renderProfile();
renderArticles();
renderProjects();
renderStack();
