# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Living Snow Project - a Community Scientist project for studying snow algae. It's a monorepo using Classic Yarn (v1.22.22) workspaces with two main applications:

- **Mobile App** (`apps/mobile/`): React Native/Expo app for field data collection
- **Web App** (`apps/web/`): React web application for data visualization
- **Shared Packages** (`packages/`): Common libraries used by both apps

## Development Commands

### Root Level Commands

- `yarn install` - Install all dependencies across workspaces
- `yarn build` - Build all workspaces
- `yarn precheck` - Run prettier, lint, and test across all workspaces (run before PRs)
- `yarn lint` - Run ESLint across all workspaces
- `yarn prettier` - Check code formatting
- `yarn test` - Run tests across all workspaces
- `yarn clean` - Clean build artifacts
- `yarn nuke` - Remove all node_modules (Windows compatible)

### Mobile App (`apps/mobile/`)

- `expo start` - Start Expo development server
- `expo run:android` - Run on Android device/emulator
- `expo run:ios` - Run on iOS device/simulator
- `yarn precheck` - Mobile-specific precheck (prettier, lint, typecheck, test)
- `yarn test` - Run Jest tests
- `yarn lint` - Run ESLint
- `yarn prettier` - Check formatting

### Web App (`apps/web/`)

- `yarn start` - Start webpack dev server
- `yarn build` - Build for production
- `yarn deploy` - Deploy to GitHub Pages

### Package Commands

Each package in `packages/` supports:

- `yarn build` - Compile TypeScript
- `yarn test` - Run Jest tests
- `yarn clean` - Remove build artifacts

## Architecture

### Monorepo Structure

- **Workspaces**: Uses Classic Yarn workspaces for dependency management
- **Shared Packages**:
  - `@livingsnow/record`: Core data models and utilities for algae records
  - `@livingsnow/network`: API client and network utilities
  - `@livingsnow/logger`: Logging utilities
  - `@livingsnow/ts-config-livingsnow`: Shared TypeScript configuration

### Mobile App Architecture

- **Framework**: React Native with Expo managed workflow
- **Navigation**: React Navigation v6 with stack navigators
- **UI Library**: NativeBase for consistent components
- **State Management**: React hooks with context providers
- **Data Storage**: AsyncStorage for local persistence
- **Background Tasks**: Expo TaskManager for background sync
- **Testing**: Jest with React Native Testing Library

Key mobile app components:

- `RecordScreen`: Main data collection interface
- `TimelineScreen`: Historical records view
- `useAlgaeRecords` hook: Core state management for records
- `RecordManager`: Handles record CRUD operations and sync
- `PhotoManager`: Manages photo capture and storage

### Web App Architecture

- **Framework**: React 18 with Webpack 5
- **Build Tool**: Custom Webpack configuration
- **Deployment**: GitHub Pages
- **Styling**: CSS modules

### Data Model

The app centers around `AlgaeRecord` entities with these key fields:

- Record type (Sighting or Sample)
- GPS coordinates and location description
- Date and time
- Algae characteristics (size, color)
- Photos and metadata
- Researcher information

## Development Notes

### Testing

- Mobile app uses Jest with extensive component and hook testing
- Run `yarn test` from mobile directory for single test runs
- Coverage reports generated in `coverage/` directory
- Snapshot testing used for UI components

### Code Quality

- ESLint configuration with React and TypeScript rules
- Prettier for code formatting
- TypeScript strict mode enabled
- All code must pass `yarn precheck` before PR submission

### Mobile Development

- Requires Expo development builds for testing
- Uses EAS Build for creating development builds
- GPS functionality requires device testing
- Photo capture uses Expo ImagePicker and MediaLibrary

### Deployment

- Mobile: Uses EAS Build and EAS Submit for app store deployment
- Web: Deploys to GitHub Pages via `yarn deploy`

## Key File Locations

- Mobile entry point: `apps/mobile/App.tsx`
- Web entry point: `apps/web/src/App.tsx`
- Shared types: `apps/mobile/types/`
- Mobile screens: `apps/mobile/src/screens/`
- Mobile components: `apps/mobile/src/components/`
- Record management: `apps/mobile/src/lib/RecordManager.ts`
- API client: `packages/livingsnow-network/`

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.
