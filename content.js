const BLOG_CONTENT = {
  profile: {
    name: "Zyntrix",
    tagline: "个人博客 / 技术记录 / 项目复盘",
    intro:
      "我主要记录机器人、嵌入式系统、工程工具链和一些长期项目的复盘。这里不是简历页，更像是我的公开笔记本：放文章、项目过程、踩坑记录，以及一些正在想清楚的问题。",
    email: "wuxipanwenhu@gmail.com",
    github: "https://github.com/",
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
