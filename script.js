const STORAGE_KEY = "personal-blog-content-v1";

const defaultState = {
  profile: {
    name: "Chen Yu",
    tagline: "个人博客 / 技术记录 / 项目复盘",
    intro:
      "我主要记录机器人、嵌入式系统、工程工具链和一些长期项目的复盘。这里不是简历页，更像是我的公开笔记本：放文章、项目过程、踩坑记录，以及一些正在想清楚的问题。",
    email: "hello@example.com",
    github: "https://github.com/",
    zhihu: "https://www.zhihu.com/",
  },
  articles: [
    {
      title: "从项目复盘到可维护知识库",
      date: "2026-04-18",
      summary: "记录我如何整理机器人学习资料、项目链接、论文清单和检索入口。",
      tags: ["知识管理", "机器人"],
    },
    {
      title: "Sim2Real 实验链路中的版本和日志",
      date: "2026-03-26",
      summary: "把仿真训练、部署脚本、参数变更和实机测试串起来的一些做法。",
      tags: ["运动控制", "工程实践"],
    },
    {
      title: "嵌入式比赛机器人调试清单",
      date: "2025-12-09",
      summary: "写给现场调试时的自己：电源、通信、控制环、传感器和机械风险。",
      tags: ["嵌入式", "调试"],
    },
  ],
  projects: [
    {
      id: "locowiki",
      title: "LocoWiki 机器人运控资源库",
      category: "knowledge",
      meta: "资料组织 / 检索 / 开源维护",
      summary: "一个面向机器人学习和竞赛备赛的资料入口，重点是降低查资料和复盘的成本。",
      detail: "后续可以补充目录设计、资料来源规范、搜索策略和维护流程。",
      tags: ["Wiki", "Open Source", "Docs"],
      link: "https://github.com/",
    },
    {
      id: "sim2real",
      title: "四足机器人 Sim2Real 闭环",
      category: "robotics",
      meta: "仿真训练 / 实机部署 / 系统集成",
      summary: "从机械建模、仿真训练到实机部署，整理一条可复现实验链路。",
      detail: "适合展开训练环境、参数版本、部署脚本、硬件限制和失败案例。",
      tags: ["Isaac Gym", "ROS2", "C++"],
      link: "https://github.com/",
    },
    {
      id: "robocon",
      title: "ROBOCON 足式机器人",
      category: "robotics",
      meta: "比赛机器人 / 导航 / 现场调试",
      summary: "围绕比赛任务做足式机器人研发，记录机构、控制、建图导航和赛场调试。",
      detail: "详情可按任务约束、系统架构、调试日志和复盘结论组织。",
      tags: ["Motion Control", "SLAM", "LiDAR"],
      link: "https://github.com/",
    },
    {
      id: "underwater",
      title: "水下仿生机器人控制系统",
      category: "embedded",
      meta: "嵌入式控制 / 传感器 / 执行器",
      summary: "处理浮力控制、多执行器协同、传感器融合和水下硬件约束。",
      detail: "可继续补充传感器拓扑、通信协议和防水设计取舍。",
      tags: ["MCU", "IIC", "Motor"],
      link: "https://github.com/",
    },
  ],
  stack: [
    {
      id: "robotics",
      title: "机器人",
      text: "ROS/ROS2、MuJoCo、Isaac Gym、SLAM、LiDAR。关注从仿真到实机的工程链路。",
    },
    {
      id: "embedded",
      title: "嵌入式",
      text: "STM32、FreeRTOS、CAN、C/C++、电机控制。关注稳定性、调试性和现场问题。",
    },
    {
      id: "toolchain",
      title: "工具链",
      text: "Linux、Git、CMake、Docker、Markdown。偏好能留下上下文的工作流。",
    },
  ],
};

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
