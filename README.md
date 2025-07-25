# 🎮 Coloris
**A modern color-matching puzzle game built with Next.js and React**

🎮 **[PLAY LIVE DEMO](https://coloris-dbqe-89t9wwaow-pekkass-projects.vercel.app/)** 🎮

[✨ Play Now](#deployment) | [🎮 Features](#features) | [⚙️ Installation](#installation) | [🧪 Testing](#testing) | [🐳 Docker](#docker) | [🤝 Contributing](#contributing)iv align="center">
  
![Coloris Game Banner](./gamescreen.png)

[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Tested_with-Playwright-2EAD33?style=for-the-badge&logo=playwright)](https://playwright.dev/)
[![Container](https://img.shields.io/badge/Container-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

**A modern color-matching puzzle game built with Next.js and React**

[✨ Play Now](#deployment) | [� Features](#features) | [⚙️ Installation](#installation) | [🧪 Testing](#testing) | [� Docker](#docker) | [🤝 Contributing](#contributing)

</div>

## 🎬 Preview

<div align="center">
  <img src="./gamescreen.png" alt="Coloris Gameplay" width="90%">
</div>

## ✨ Features

- 🎨 **Colorful Gameplay** - Match blocks of the same color in a classic tetris-style grid
- 🌊 **Animated Title** - Beautiful wave effect animation on the game title
- 🕹️ **Intuitive Controls** - Arrow keys for movement, spacebar for fast drop
- ⏱️ **Progressive Difficulty** - Game speed increases over time to challenge your skills
- 📱 **Responsive Design** - Play on desktop or mobile with adaptive layout
- 🎯 **Score Tracking** - Track your high scores and challenge yourself
- 🌙 **Modern UI** - Clean, minimalist interface with Tailwind CSS
- 🚀 **Next.js Performance** - Lightning-fast load times and optimized rendering

## ⚙️ Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/mangobanaani/coloris.git
cd coloris

# Install dependencies
npm install

# Start development server
npm run dev
```

Your game will be running at [http://localhost:3000](http://localhost:3000)

## 🏗️ Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Live Demo
🎮 **[Play the live game here!](https://coloris-dbqe-89t9wwaow-pekkass-projects.vercel.app/)** 🎮

The game is deployed on Vercel with automatic deployment from the main branch. The deployment includes:
- ✅ Optimized production build
- ✅ Server-side rendering (SSR)
- ✅ Responsive design for all devices
- ✅ Fast global CDN delivery

### Deploy Your Own
You can easily deploy your own instance:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mangobanaani/coloris)

## 🧪 Testing

Coloris includes comprehensive testing using Playwright:

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Debug tests
npm run test:debug
```

## 🐳 Containerization

Coloris comes with a multi-stage build for efficient container deployment:

```bash
# Using Docker
docker build -t coloris .
docker run -p 3000:3000 coloris

# Using Podman (Docker alternative)
podman build -t coloris .
podman run -p 3000:3000 coloris
```

For more details about container deployment, including Kubernetes configurations and other modern alternatives to Docker, see [DOCKER.md](DOCKER.md).

## 🔒 Security

Our CI/CD pipeline includes security scanning with:

- 🔍 **CodeQL Analysis** for code quality and security issues
- 🛡️ **Trivy** for container vulnerability scanning
- 📦 **npm audit** for dependency vulnerabilities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

Project Link: [https://github.com/mangobanaani/coloris](https://github.com/mangobanaani/coloris)

---

<div align="center">
  <sub>Built with ❤️ by mangobanaani</sub>
</div>
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

Project Link: [https://github.com/mangobanaani/coloris](https://github.com/mangobanaani/coloris)

---

<div align="center">
  <sub>Built with ❤️ by mangobanaani</sub>
</div>
