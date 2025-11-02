# ⚖️ Nyagrik

<div align="center">


**Nyagrik is a Legal Tech platform aimed at digitalizing and simplifying India’s complex legal system. The platform offers a range of services powered by AI, helping users access affordable and efficient legal help, including AI-driven document automation, a legal marketplace, and online dispute resolution (ODR).**

</div>

## 📖 Overview

Nyagrik aims to address several challenges in India’s legal system:

- Massive Case Backlog: With over 5 crore cases pending and an average wait time of 3-5 years, Nyagrik provides faster alternatives to traditional litigation.

- Expensive Legal Help: Legal consultations can cost between ₹2,000–₹10,000, making justice inaccessible for many. Nyagrik offers affordable, transparent legal services.

- Complex & Confusing System: Legal documents are often filled with jargon. Nyagrik simplifies these with AI-powered automation.

- Lack of Trust & Transparency: Nyagrik provides verified lawyers and law students for affordable, transparent consultations.

- Low Awareness of Faster Alternatives: The platform promotes Online Dispute Resolution (ODR), which helps resolve disputes without long court proceedings.

## ✨ Features

-   **Seamless User Authentication:** Integrated with NextAuth.js for secure and flexible authentication strategies.
-   **Dynamic Content Management:** Utilizes MongoDB and Mongoose for efficient storage and retrieval of various data types, supporting content-rich applications.
-   **Server-Side Rendering (SSR) & Static Site Generation (SSG):** Optimized performance and SEO benefits through Next.js rendering capabilities.
-   **Component-Based UI:** Built with React, enabling reusable UI components and a modular development approach.
-   **Modern Styling with Tailwind CSS:** Utility-first CSS framework for rapid and consistent UI development.
-   **Type-Safe Development:** Enhanced code quality and fewer runtime errors with TypeScript.
-   **API Route Support:** Scalable backend logic directly within the Next.js framework for efficient data handling.
-   **Responsive Design:** Adapts gracefully to various screen sizes and devices.


## 🛠️ Tech Stack

**Frontend:**
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232A.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DC3A0C?style=for-the-badge&logo=postcss&logoColor=white)

**Backend:**
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Next.js API Routes](https://img.shields.io/badge/Next.js-API--Routes-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-blue?style=for-the-badge&logo=nextdotjs&logoColor=white)

**Database:**
![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=for-the-badge&logo=mongoose&logoColor=white)

**DevOps & Tools:**
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

## 🚀 Quick Start

### Prerequisites
Before you begin, ensure you have the following installed:
-   **Node.js** (LTS version recommended, e.g., 18.x or 20.x)
-   **npm** (comes with Node.js)
-   **MongoDB** (running instance, either local or cloud-hosted)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/harshrana14-fi/Nyagrik.git
    cd Nyagrik
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment setup**
    Create a `.env` file in the root directory by copying `.env.example` (if present) or manually creating it:
    ```bash
    cp .env.example .env # If .env.example exists
    # Otherwise, create .env and add:
    ```
    Configure your environment variables. Essential variables typically include:

    | Variable         | Description                                       | Example Value                   | Required |
    |------------------|---------------------------------------------------|---------------------------------|----------|
    | `MONGODB_URI`    | Connection string for your MongoDB database.      | `mongodb://localhost:27017/nyagrik` | Yes      |
    | `NEXTAUTH_URL`   | The base URL for your Next.js application.        | `http://localhost:3000`         | Yes      |
    | `NEXTAUTH_SECRET`| A secret string used to sign NextAuth.js tokens.  | `YOUR_LONG_RANDOM_SECRET`       | Yes      |
    <!-- TODO: Add other detected environment variables -->

    *Generate a strong secret for `NEXTAUTH_SECRET`. You can use `openssl rand -base64 32`.*

4.  **Start development server**
    ```bash
    npm run dev
    ```

5.  **Open your browser**
    Visit `http://localhost:3000`

## 📁 Project Structure

```
Nyagrik/
├── app/                  # Next.js App Router directory for routes, pages, and components
├── lib/                  # Utility functions, helpers, and configurations
├── models/               # MongoDB Mongoose schemas and models
├── posts/                # Content files (e.g., Markdown for blog posts or data)
├── public/               # Static assets (images, fonts, etc.)
├── scripts/              # Custom scripts (e.g., database seeding, deployment helpers)
├── .gitignore            # Specifies intentionally untracked files to ignore
├── eslint.config.mjs     # ESLint configuration for code linting
├── middleware.ts         # Next.js middleware for authentication, redirects, etc.
├── next.config.ts        # Next.js configuration file
├── package.json          # Project metadata and dependencies
├── package-lock.json     # Records the exact dependency tree
├── postcss.config.js     # PostCSS configuration for styling
├── postcss.config.mjs    # Alternative PostCSS config (ESM)
├── README.md             # This README file
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## ⚙️ Configuration

### Environment Variables
As detailed in the [Environment setup](#environment-setup) section, the application relies on `.env` files for sensitive and deployment-specific configurations.

### Configuration Files
-   `next.config.ts`: Main Next.js configuration, including image optimization, redirects, etc.
-   `tailwind.config.js`: Configuration for Tailwind CSS, allowing customization of themes, plugins, and utility classes.
-   `postcss.config.js`: PostCSS configuration, used by Tailwind CSS for processing CSS.
-   `eslint.config.mjs`: Configuration for ESLint, defining code style and quality rules.
-   `tsconfig.json`: TypeScript compiler options for the project.

## 🔧 Development

### Available Scripts
The `package.json` includes several scripts to help with development:

| Command           | Description                                    |
|-------------------|------------------------------------------------|
| `npm run dev`     | Starts the Next.js development server.         |
| `npm run build`   | Creates a production-ready build of the application. |
| `npm run start`   | Starts the Next.js production server.          |
| `npm run lint`    | Runs ESLint to check for code style issues.    |
<!-- TODO: Add other detected scripts from package.json -->

### Development Workflow
1.  Ensure all [prerequisites](#prerequisites) are met and the application is [installed](#installation).
2.  Start the development server using `npm run dev`.
3.  Any changes made to the source files will trigger a hot reload.
4.  Use `npm run lint` periodically to check for code style and potential issues.

## 🧪 Testing

<!-- No explicit testing framework configuration was detected in the top-level files provided (e.g., jest.config.js, cypress.config.js). -->
This project does not currently have an explicitly detected testing setup in the provided file structure. If you plan to add one, popular choices for Next.js include Jest, React Testing Library, and Cypress.

## 🚀 Deployment

### Production Build
To create an optimized production build:
```bash
npm run build
```
This command will compile and optimize your Next.js application, generating static assets and server-side code in the `.next` directory.

### Deployment Options
-   **Vercel**: Next.js applications are ideally suited for deployment on Vercel, the creators of Next.js. Simply push your repository to GitHub, GitLab, or Bitbucket and connect it to a new project on Vercel.
-   **Other Node.js Hosts**: The `npm run start` command can be used to run the production build on any Node.js compatible hosting environment.
-   **Docker**: If containerization is desired, a `Dockerfile` can be added to build a Docker image for deployment.

## 📚 API Reference

The application leverages Next.js API Routes for backend functionality. These routes are typically defined within the `app/api` directory (or `pages/api` if using the Pages Router).

### Authentication
Authentication is handled via **NextAuth.js**. The `middleware.ts` file likely contains logic to protect routes and manage user sessions.
API routes can be protected by checking the session status using NextAuth.js utilities.

### Endpoints
<!-- TODO: Detail specific API endpoints if more code analysis reveals them. -->
API endpoints are created as files within the `app/api` (or `pages/api`) directory. For example, `app/api/users/route.ts` would define `/api/users`.

Example of a typical API endpoint structure:
-   `/api/auth/[...nextauth]`: NextAuth.js API routes.
-   `/api/users`: For managing user data.
-   `/api/posts`: For retrieving and managing blog posts/content.

## 🤝 Contributing

We welcome contributions! Please consider the following guidelines:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and ensure your code adheres to the project's coding style (run `npm run lint`).
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

### Development Setup for Contributors
The development setup is the same as the [Quick Start](#quick-start) guide. Ensure your local MongoDB instance is running and environment variables are correctly configured.

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 🙏 Acknowledgments

-   **Next.js & React communities:** For providing powerful tools for web development.
-   **MongoDB & Mongoose:** For robust and flexible database solutions.
-   **Tailwind CSS & PostCSS:** For making styling a breeze.
-   **NextAuth.js:** For simplifying authentication.
-   **ESLint & Prettier:** For maintaining code quality and consistency.

## 📞 Support & Contact

-   📧 Email: [ranajiharsxx14@gmail.com] <!-- TODO: Add actual contact email -->
-   🐛 Issues: [GitHub Issues](https://github.com/harshrana14-fi/Nyagrik/issues)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [harshrana14-fi](https://github.com/harshrana14-fi)

</div>
