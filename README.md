

---

```markdown
# Chess Royale Monorepo Template

Welcome to the **Chess Royale Monorepo**! This repository serves as a scalable and modular foundation for building **Chess Royale**—a modern, multiplayer chess battleground with real-time competitive gameplay and strategic depth.

**Application URL:** [web.chesssroyale.games](https://web.chesssroyale.games)

---

## Overview

Chess Royale reimagines classic chess with innovative mechanics and engaging online competition. This monorepo is built using:
- **Next.js & React:** For a dynamic and responsive web application.
- **shadcn/ui:** For a consistent, high-quality UI component library.
- **Tailwind CSS:** For rapid and customizable styling.
- **pnpm Workspaces & Turborepo:** For efficient dependency management and scalable development across multiple packages.

**Monorepo Structure:**
- **apps/web:** The Next.js web application for Chess Royale.
- **apps/api:** (Optional) Backend API services.
- **packages/ui:** The shared UI component library, built with shadcn/ui.

---

## Prerequisites

- **Node.js** (v14 or later)
- **pnpm** (install globally with `npm install -g pnpm`)
- **Git**

---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/chess-royale-monorepo.git
   cd chess-royale-monorepo
   ```

2. **Install Dependencies:**

   ```bash
   pnpm install
   ```

3. **Initialize the shadcn/ui Template:**

   This will set up the initial configuration for the UI components.
   
   ```bash
   pnpm dlx shadcn@latest init
   ```

---

## Adding Components

To maintain a clean and centralized UI library, all components should be added to the `packages/ui` folder. For example, to add a button component to your web app, run:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This command will place the new UI component in the `packages/ui/src/components` directory, keeping your UI code modular and reusable.

---

## Tailwind CSS

Your styling is powered by Tailwind CSS. The configuration (`tailwind.config.ts`) and global styles (`globals.css`) are already set up to work with components from the `ui` package. Simply use Tailwind’s utility classes in your components and pages to rapidly style your application.

---

## Using Components

To use a shared component from the UI library in your application, simply import it. For example, to import the Button component:

```tsx
import { Button } from "@workspace/ui/components/ui/button";
```

This ensures that your web app maintains a consistent design system across all components.

---

## Development Workflow

This monorepo leverages **pnpm workspaces** and **turborepo** to streamline development across multiple projects.

- **Start the Development Server (for the web app):**

  ```bash
  pnpm dev --filter apps/web
  ```

- **Build the Application:**

  ```bash
  pnpm build --filter apps/web
  ```

- **Run Tests:**

  ```bash
  pnpm test
  ```

---

## Monorepo Structure

```
/chess-royale-monorepo
├── apps
│   ├── web         # Next.js web application for Chess Royale
│   └── api         # (Optional) API services for backend logic
├── packages
│   └── ui          # Shared UI components built with shadcn/ui
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── pnpm-workspace.yaml
```

---

## Deployment

Chess Royale is deployed at [web.chesssroyale.games](https://web.chesssroyale.games). When preparing for production:
- Ensure your environment variables and configuration files are up to date.
- Follow your CI/CD pipeline practices to build, test, and deploy the application.

---

## Contributing

We welcome contributions to Chess Royale! If you’d like to contribute:
1. Fork the repository.
2. Create a feature branch.
3. Make your changes with appropriate tests.
4. Submit a pull request with a detailed description of your changes.

Please adhere to the project's coding standards and best practices.

---

## License

This project is licensed under the [MIT License](./LICENSE). See the LICENSE file for more details.

---

Happy coding, and welcome to the Chess Royale community!
```

---

This `README.md` covers everything from installation and usage to development workflow and deployment while preserving the essential shadcn/ui monorepo details. Enjoy building Chess Royale!