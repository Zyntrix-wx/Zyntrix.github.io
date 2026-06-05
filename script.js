const STORAGE_KEY = "personal-blog-content-v1";
const defaultState = BLOG_CONTENT;

let state = loadState();

const articleList = document.querySelector("[data-article-list]");
const projectList = document.querySelector("[data-project-list]");
const stackList = document.querySelector("[data-stack-list]");
const profileForm = document.querySelector("[data-profile-form]");
const projectForm = document.querySelector("[data-project-form]");
const stackForm = document.querySelector("[data-stack-form]");
const projectEditorList = document.querySelector("[data-project-editor-list]");
const stackEditorList = document.querySelector("[data-stack-editor-list]");

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return clone(defaultState);

  try {
    const parsed = JSON.parse(saved);
    return {
      ...clone(defaultState),
      ...parsed,
      profile: { ...defaultState.profile, ...parsed.profile },
      articles: parsed.articles || defaultState.articles,
      projects: parsed.projects || defaultState.projects,
      stack: parsed.stack || defaultState.stack,
    };
  } catch {
    return clone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseTags(value) {
  return value
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function renderProfile() {
  const { profile } = state;

  document.title = `${profile.name} 的个人博客`;
  document.querySelector('meta[name="description"]').setAttribute("content", profile.intro);
  document.querySelector("[data-profile-name]").textContent = profile.name;
  document.querySelector("[data-profile-heading]").textContent = `你好，我是 ${profile.name}。`;
  document.querySelector("[data-profile-tagline]").textContent = profile.tagline;
  document.querySelector("[data-profile-intro]").textContent = profile.intro;
  document.querySelector("[data-footer-name]").textContent = profile.name;

  const emailLink = document.querySelector("[data-profile-email]");
  emailLink.textContent = profile.email;
  emailLink.href = `mailto:${profile.email}`;

  const githubLink = document.querySelector("[data-profile-github]");
  githubLink.href = profile.github || "https://github.com/";

  const zhihuLink = document.querySelector("[data-profile-zhihu]");
  zhihuLink.href = profile.zhihu || "https://www.zhihu.com/";

  profileForm.elements.name.value = profile.name;
  profileForm.elements.tagline.value = profile.tagline;
  profileForm.elements.intro.value = profile.intro;
  profileForm.elements.email.value = profile.email;
  profileForm.elements.github.value = profile.github;
  profileForm.elements.zhihu.value = profile.zhihu;
}

function renderArticles() {
  articleList.innerHTML = state.articles
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
    .join("");
}

function renderProjects() {
  projectList.innerHTML = state.projects
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
    .join("");

  applyProjectFilter();
}

function renderProjectEditor() {
  projectEditorList.innerHTML = state.projects
    .map(
      (project) => `
        <article class="managed-project">
          <div>
            <div class="managed-project-meta">${escapeHtml(project.category)} / ${escapeHtml(project.meta)}</div>
            <h4>${escapeHtml(project.title)}</h4>
            <p>${escapeHtml(project.summary)}</p>
          </div>
          <button class="danger-button" type="button" data-delete-project="${escapeHtml(project.id)}">删除</button>
        </article>
      `,
    )
    .join("");
}

function renderStack() {
  stackList.innerHTML = state.stack
    .map(
      (item) => `
        <section class="stack-group">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </section>
      `,
    )
    .join("");
}

function renderStackEditor() {
  stackEditorList.innerHTML = state.stack
    .map(
      (item) => `
        <article class="managed-project">
          <div>
            <div class="managed-project-meta">技术栈</div>
            <h4>${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.text)}</p>
          </div>
          <button class="danger-button" type="button" data-delete-stack="${escapeHtml(item.id)}">删除</button>
        </article>
      `,
    )
    .join("");
}

function renderAll() {
  renderProfile();
  renderArticles();
  renderProjects();
  renderProjectEditor();
  renderStack();
  renderStackEditor();
}

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(profileForm);

  state.profile = {
    name: form.get("name").trim(),
    tagline: form.get("tagline").trim(),
    intro: form.get("intro").trim(),
    email: form.get("email").trim(),
    github: form.get("github").trim(),
    zhihu: form.get("zhihu").trim(),
  };

  saveState();
  renderProfile();
});

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(projectForm);

  state.projects.unshift({
    id: `project-${Date.now()}`,
    title: form.get("title").trim(),
    category: form.get("category"),
    meta: form.get("meta").trim(),
    summary: form.get("summary").trim(),
    detail: form.get("detail").trim(),
    tags: parseTags(form.get("tags")),
    link: form.get("link").trim(),
  });

  projectForm.reset();
  saveState();
  renderProjects();
  renderProjectEditor();
});

projectEditorList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-project]");
  if (!deleteButton) return;

  state.projects = state.projects.filter((project) => project.id !== deleteButton.dataset.deleteProject);
  saveState();
  renderProjects();
  renderProjectEditor();
});

stackForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(stackForm);

  state.stack.push({
    id: `stack-${Date.now()}`,
    title: form.get("title").trim(),
    text: form.get("text").trim(),
  });

  stackForm.reset();
  saveState();
  renderStack();
  renderStackEditor();
});

stackEditorList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete-stack]");
  if (!deleteButton) return;

  state.stack = state.stack.filter((item) => item.id !== deleteButton.dataset.deleteStack);
  saveState();
  renderStack();
  renderStackEditor();
});

document.querySelector("[data-reset-site]").addEventListener("click", () => {
  state = clone(defaultState);
  localStorage.removeItem(STORAGE_KEY);
  renderAll();
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    applyProjectFilter();
  });
});

function applyProjectFilter() {
  const activeFilter = document.querySelector("[data-filter].is-active")?.dataset.filter || "all";

  document.querySelectorAll(".project").forEach((project) => {
    project.hidden = activeFilter !== "all" && project.dataset.category !== activeFilter;
  });
}

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
renderAll();
