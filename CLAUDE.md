# CLAUDE.md

## Project Overview

This is a monorepo using Classic Yarn (v1.22.22) workspaces

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

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- Before the end of each plan, give me a list of unresolved questions to answer, if any.
- End every plan with a numbered list of concrete steps. This should be the last thing visible in the terminal.
