<div align="right">
  <strong><a href="README.md">English</a></strong> | <a href="README_zh.md">简体中文</a>
</div>

# HoldTranslate Web

Official showcase and interactive playground website for the HoldTranslate Chrome extension, built with Apple Liquid Glass aesthetic!

> **A super quick reminder:**  
> This website is the official landing page and live interactive playground for **HoldTranslate**. Fully built with Next.js 15, Tailwind CSS, and the Apple Liquid Glass refraction shader system inspired by [`rdev/liquid-glass-react`](https://github.com/rdev/liquid-glass-react). Visitors can experience authentic long-press web translation, real-time settings manipulation, and 0ms YouTube subtitle previews directly in their browser.

[![Hosted on Vercel](https://img.shields.io/badge/Hosted%20on-Vercel-black.svg?logo=vercel)](https://holdtranslate.vercel.app/)
[![Website](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-blue.svg)](https://egggggod.github.io/HoldTranslate-web/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.3-black.svg)](https://nextjs.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-Automated-green.svg)](https://github.com/egggggod/HoldTranslate-web/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fegggggod%2FHoldTranslate-web)

## Demo

> Fully responsive and optimized for modern Chromium desktop browsers (Chrome, Edge, Brave) with full WebGL & SVG displacement shader support.

- **Vercel Global Edge (Official Production)**: [https://holdtranslate.vercel.app](https://holdtranslate.vercel.app)
- **Vercel Project Dashboard**: [https://vercel.com/egggggod/holdtranslate](https://vercel.com/egggggod/holdtranslate)
- **GitHub Pages Static Mirror**: [https://egggggod.github.io/HoldTranslate-web/](https://egggggod.github.io/HoldTranslate-web/)

### 1. Interactive Liquid Glass Island & Long-Press Simulator
![Live Demo Preview](public/assets/demo-subtitles.png)

### 2. High-Fidelity Light & Dark Mode Dual Theming
![Light and Dark Comparison](public/assets/demo-light.png)

## Overview

This project consists of three core engineering pillars:

1. **Apple VisionOS Liquid Glass Engine**: Direct adaptation of the optical displacement shader, chromatic aberration channels, and physics-based cursor elasticity from `rdev/liquid-glass-react`, providing authentic crystal refractions and tactile reactivity.
2. **Dual-Mode Interactive Playground**: A live simulated browser viewport where users can perform real long-press gestures (~500ms trigger buffer) on tech news, video titles, and research papers, seamlessly paired with a 1:1 floating liquid glass settings control island.
3. **Smart Dual-Hosting Architecture**: Native Next.js serverless & Edge optimization when hosted on **Vercel**, with automatic fallback to static HTML export (`output: 'export'`) for **GitHub Pages**.

## Project Structure

```bash
HoldTranslate-web/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   ├── assets/                 # High-resolution demo screenshots
│   │   ├── demo-light.png
│   │   ├── demo-dark.png
│   │   └── demo-subtitles.png
│   ├── icons/                  # HoldTranslate logo icons (16, 48, 128)
│   └── download/               # Packaged release archives (.zip)
├── src/
│   ├── components/
│   │   ├── LiquidGlass/        # Liquid Glass refraction component & shader generators
│   │   │   ├── index.tsx       # Core LiquidGlass wrapper & SVG displacement filters
│   │   │   ├── shader-utils.ts # WebGL/Canvas shader generator
│   │   │   └── utils.ts        # SVG displacement data URIs (Standard/Polar/Prominent)
│   │   ├── Navbar.tsx          # Floating island top navigation bar
│   │   ├── Hero.tsx            # Hero showcase with aurora ambient glow
│   │   ├── InteractiveDemo.tsx # Real long-press simulator + 1:1 settings island
│   │   ├── FeatureGrid.tsx     # Bento cards showcasing 6 architectural pillars
│   │   ├── SubtitleShowcase.tsx# YouTube bilingual subtitle deep dive
│   │   ├── QuickInstall.tsx    # 60-second visual installation guide
│   │   └── Footer.tsx          # Thinking-Claude compliant footer
│   ├── locales/
│   │   ├── en.ts               # Complete English language dictionary
│   │   └── zh.ts               # Complete Simplified Chinese language dictionary
│   ├── pages/
│   │   ├── _app.tsx            # Next.js application root
│   │   ├── _document.tsx       # HTML document & meta setup
│   │   └── index.tsx           # Main landing page entry
│   └── styles/
│       └── globals.css         # Tailwind v4 directives & aurora keyframe animations
├── vercel.json                 # Vercel production security headers & asset caching
├── next.config.ts              # Smart dual-environment (Vercel / GitHub Pages) config
├── postcss.config.mjs          # PostCSS with @tailwindcss/postcss
├── tsconfig.json               # TypeScript strict configuration
├── package.json                # Project dependencies and npm scripts
├── README.md                   # English documentation
└── README_zh.md                # Chinese documentation (简体中文)
```

The codebase is structured cleanly with zero server dependencies, allowing the static export to be deployed effortlessly on GitHub Pages, Cloudflare Pages, or Vercel.

## Features

- ⚡ **Authentic Liquid Glass Refraction**: Supports multiple refraction modes (`standard`, `polar`, `prominent`, `shader`), chromatic aberration, and cursor-following elasticity.
- 🏔️ **Light Scenic Landscape Aesthetics**: Carefully curated panoramic scenic landscape backgrounds (Alpine Dawn, Forest Sunlight, Azure Lake) replacing harsh pure dark backgrounds, paired with high-contrast adaptive optical cards.
- 🎛️ **Apple Optical Tuning Dock**: Real-time floating control center to fine-tune displacement scale, blur amount, saturation, chromatic aberration, elasticity, and dynamically switch scenic wallpapers.
- 🎯 **Interactive Long-Press Sandbox**: Visitors can physically press and hold mouse buttons on text blocks to experience the ~500ms trigger ring, smooth subtitle expansion, and secondary-hold restoration.
- 🌐 **Instant Bilingual Localization**: Seamless one-click switching between English and Simplified Chinese across all headings, interactive cards, and tooltips.
- 🎨 **Synchronized Color Theming**: Selecting any of the 6 Apple-grade palette chips dynamically propagates accent glow, borders, and halos across the entire page.
- 📱 **1:1 Plugin Settings Island**: Interactive replica of the HoldTranslate Chrome extension popup, allowing visitors to test translation engines, subtitle modes, and timing buffers.
- 🚀 **One-Click Vercel & GitHub Actions Deploy**: Deploy with one click to Vercel global edge network or utilize GitHub Actions for GitHub Pages.

## Deploying to Vercel (1-Minute Guide)

Deploying HoldTranslate-web to Vercel takes under 60 seconds:

1. **Option A: One-Click Deploy Button**
   - Click the **[Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fegggggod%2FHoldTranslate-web)** button above.
   - Authorize your GitHub account, choose a project name, and click **Deploy**.

2. **Option B: Import via Vercel Dashboard**
   - Go to [vercel.com/new](https://vercel.com/new).
   - Under **Import Git Repository**, find and select `egggggod/HoldTranslate-web`.
   - Leave Framework Preset as **Next.js** (auto-detected).
   - Click **Deploy**! Every subsequent `git push` to `main` will automatically trigger a new deployment.

3. **Option C: Vercel CLI (For Terminal Users)**
   ```bash
   npx vercel
   # For production release:
   npx vercel --prod
   ```

## Getting Started with HoldTranslate Extension

Once you visit the website, just:

1. Click the **"Download v1.7.0"** button in the top navigation bar.
2. Extract the downloaded `.zip` file.
3. Open `chrome://extensions/` in Chrome and toggle on **"Developer mode"**.
4. Click **"Load unpacked"** and select the unzipped directory.
5. That's it! Long-press any paragraph on the web to enjoy pure reading flow.

## Why Use HoldTranslate?

- **Zero Distraction**: No banner ads, no watermark cards, and no floating widgets cluttering your screen.
- **Visual Harmony**: The translation blends seamlessly into the webpage typography as if it was authored natively.
- **Multi-Engine Power**: Choose fast free web translation (Google/Microsoft) or cutting-edge LLM reasoning translation (DeepSeek/GPT-4o).
- **Privacy & Lightweight**: Pure vanilla JavaScript without tracking, external dependencies, or telemetry.

## Changelog

For the latest updates and release logs, please visit our **[GitHub Releases](https://github.com/egggggod/HoldTranslate-plugin-for-chrome/releases)** page.

## Contributing

Contributions are warmly welcome! Feel free to:

- Submit bug reports and feature ideas via [GitHub Issues](https://github.com/egggggod/HoldTranslate-web/issues)
- Propose UI/UX refinements or new interactive showcase components
- Create pull requests

## License

MIT License — free for personal and commercial open-source use.

## Acknowledgments

- **[`rdev/liquid-glass-react`](https://github.com/rdev/liquid-glass-react)** for the innovative Apple Liquid Glass refraction shaders.
- **Google DeepMind & Gemini 3.8 Flash** for comprehensive pair-programming assistance.
