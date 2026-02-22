# HomeClean App 🧹

A professional home and office cleaning service booking app built with [Expo](https://expo.dev) and [Expo Router](https://docs.expo.dev/router/introduction/).

## Features

- **Browse Services** – Browse cleaning services by category (home, office, special)
- **Service Detail & Booking** – View service details, pick a date/time/address and book in seconds
- **My Bookings** – View upcoming and past bookings, cancel if needed
- **User Profile** – Manage account info and preferences
- **Authentication** – Login and registration with form validation
- **Web Support** – Fully responsive design with a top navigation bar on web

## Demo account

| Field    | Value               |
| -------- | ------------------- |
| Email    | test@cleanpro.se    |
| Password | 123456              |

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Project structure

```
app/
├── (auth)/          # Login & register screens
├── (tabs)/          # Main tab screens (Home, Services, Bookings, Profile)
│   └── index.tsx    # Home screen
├── service/[id].tsx # Service detail & booking screen
└── _layout.tsx      # Root layout with AuthProvider
components/          # Shared UI components (TopNav, etc.)
constants/           # Colors & Theme tokens
contexts/            # AuthContext
services/            # Mock API & local storage helper
```

## Tech stack

- [Expo](https://expo.dev) ~54
- [Expo Router](https://docs.expo.dev/router/introduction/) ~6 (file-based routing)
- [React Native](https://reactnative.dev) 0.81
- [@expo/vector-icons](https://docs.expo.dev/guides/icons/) (Ionicons)

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)
