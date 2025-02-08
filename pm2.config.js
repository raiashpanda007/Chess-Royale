module.exports = {
    apps: [
      {
        name: "backend",
        cwd: "./apps/backend",
        script: "pnpm",
        args: "start",
        env: {
          NODE_ENV: "production",
        },
      },
      {
        name: "backend2",
        cwd: "./apps/backend2",
        script: "pnpm",
        args: "start",
        env: {
          NODE_ENV: "production",
        },
      },
      {
        name: "game",
        cwd: "./apps/game",
        script: "pnpm",
        args: "start",
        env: {
          NODE_ENV: "production",
        },
      },
      {
        name: "web",
        cwd: "./apps/web",
        script: "pnpm",
        args: "start",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };