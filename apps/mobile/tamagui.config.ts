import { defaultConfig, createV5Theme } from "@tamagui/config/v5";
import { createFont, createTamagui } from "tamagui";

const bodyFont = createFont({
  family: "Inter",
  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 24,
    4: 28,
    5: 32,
    6: 36,
    7: 40,
    8: 44,
    9: 48,
    10: 52,
  },
  weight: {
    1: "400",
    2: "500",
    3: "700",
  },
  face: {
    400: { normal: "Inter" },
    500: { normal: "Inter_500" },
    700: { normal: "InterBold" },
  },
});

const themes = createV5Theme({
  getTheme: ({ scheme }) => {
    if (scheme === "dark") {
      return {
        sampleColor: "#f472b6", // pink.400
        sightingColor: "#34d399", // emerald.400
        dividerBg: "#000000",
        pendingColor: "#eab308",
        downloadedColor: "#059669",
        calendarBg: "#616161",
        calendarDay: "#f5f5f5",
        calendarDisabled: "#f5f5f555",
        calendarArrow: "hsl(206, 100%, 50.0%)",
      };
    }
    return {
      sampleColor: "#db2777", // pink.600
      sightingColor: "#059669", // emerald.600
      dividerBg: "#d6d3d1",
      pendingColor: "#fde047",
      downloadedColor: "#34d399",
      calendarBg: "#f5f5f5",
      calendarDay: "#616161",
      calendarDisabled: "#61616155",
      calendarArrow: "hsl(206, 100%, 50.0%)",
    };
  },
});

const tamaguiConfig = createTamagui({
  ...defaultConfig,
  themes,
  fonts: {
    body: bodyFont,
    heading: bodyFont,
  },
  settings: { ...defaultConfig.settings, onlyAllowShorthands: false },
});

export type Conf = typeof tamaguiConfig;
declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
