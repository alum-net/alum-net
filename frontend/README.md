Here’s a clear and contributor-friendly `README.md` you can drop into the root of your monorepo 👇

---

# Alum-Net Frontend

A monorepo for the **Alum-Net** frontend applications built with **Expo SDK 53**, **React Native 0.79**, and **TypeScript**.
This repository contains both the **mobile** and **web** clients as well as shared **packages**.

---

## 📦 Repository structure

```
frontend/
├── apps/
│   ├── mobile/    # Expo React-Native Android app
│   └── web/       # Expo for Web app
└── packages/
    ├── ui/        # Shared UI components (if any)
    └── storage/   # Shared storage utilities
```

---

## 🚀 Getting started

### 1️⃣ Prerequisites

- **Node 18+**
- **Yarn Berry / Classic** (the repo uses workspaces)
- **Expo CLI**

  ```bash
  npm install -g expo-cli
  ```

- (Optional) **Android Studio** or an **emulator** if you plan to run the mobile app locally.

---

### 2️⃣ Installation

Clone the repository and install dependencies across all workspaces:

```bash
git clone <repo-url>
cd frontend
yarn bootstrap
```

---

### 3️⃣ Running the apps

#### ▶️ Web

```bash
yarn run:web
```

Runs the web client on [http://localhost:8081](http://localhost:8081) (Expo for Web).

#### 📱 Android

```bash
yarn run:android
```

Builds and runs the Android app via Expo Run on a connected device or emulator.

---

## 🏗️ Building

- **Web production build**

  ```bash
  yarn build:web
  ```

  Output is generated inside `apps/web/dist/`.

- **Android local build (EAS)**

  ```bash
  yarn build:android
  ```

  Uses [EAS Build](https://docs.expo.dev/build/introduction/) to produce a local APK.

---

## 🧹 Code quality

### Lint

```bash
yarn lint
```

Auto-fix issues with:

```bash
yarn lint --fix
```

### Type check

```bash
yarn tsc
```

### Prettier

```bash
yarn prettier       # Check
yarn prettier:fix   # Format
```

---

## 🧪 Testing

```bash
yarn test
```

Uses **Jest + jest-expo** for running unit tests.

---

## 🧭 Development conventions

| Topic           | Convention                                              |
| --------------- | ------------------------------------------------------- |
| Language        | TypeScript (strict mode)                                |
| Linting         | ESLint + Prettier                                       |
| Navigation      | Expo Router                                             |
| State / Storage | `react-native-mmkv`                                     |
| UI              | Expo, React Native components and some UI library (wip) |

---

## 🧑‍💻 Contributing

1. **Create a feature branch**

   ```bash
   git checkout -b feat/my-feature
   ```

2. **Make your changes** inside the relevant workspace (`apps/` or `packages/`). Keep in mind:

- If you need to add a dependency, you should check if it's globally needed, or if it's locally needed. Depending on the answer, you should run one of this commands

  ```bash
   yarn add <package-name> -W // for workspace wide dependencies
   cd <package to edit> && yarn add <package-name> // for package wide dependencies
  ```

- If you are changing something that is in a package, you should be carefoul of not breaking the web or the mobile app, depending on which one you are developing.
- If you are creating something new, you should think if it's a functionallity shared by the web and the mobile app (ie: everything that a Student can do). If it's something shared, you should create a package (you can follow the example of the Auth package).

3. **Run checks before committing**

   ```bash
   yarn lint && yarn tsc && yarn test
   ```

4. **Commit & push**

   ```bash
   git commit -m "feat: describe your change"
   git push origin feat/my-feature
   ```

5. Open a **Pull Request** targeting the `main` branch.

---

## 🛠️ Useful scripts

| Command              | Description                            |
| -------------------- | -------------------------------------- |
| `yarn bootstrap`     | Install dependencies in all workspaces |
| `yarn run:web`       | Start Expo web app                     |
| `yarn run:android`   | Run Android app                        |
| `yarn build:web`     | Build production web bundle            |
| `yarn build:android` | Local EAS build for Android            |
| `yarn lint`          | Run ESLint                             |
| `yarn tsc`           | Run TypeScript compiler                |
| `yarn prettier`      | Check code formatting                  |

---
