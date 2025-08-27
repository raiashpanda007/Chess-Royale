module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./apps/backend",
      script: "pnpm",
      args: "start",
    },
    {
      name: "backend2",
      cwd: "./apps/backend2",
      script: "pnpm",
      args: "start",
    },
    {
      name: "web",
      cwd: "./apps/web",
      script: "pnpm",
      args: "start",
      exec_mode: "cluster",
      instances: "max",
    },
    {
      name: "game",
      cwd: "./apps/game",
      script: "pnpm",
      args: "start",
    },
  ],
};
