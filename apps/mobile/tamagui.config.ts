import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";

const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      sampleColor: "#db2777", // pink.600
      sightingColor: "#059669", // emerald.600
      dividerBg: "#d6d3d1",
      pendingColor: "#fde047",
      downloadedColor: "#34d399",
    },
    dark: {
      ...config.themes.dark,
      sampleColor: "#f472b6", // pink.400
      sightingColor: "#34d399", // emerald.400
      dividerBg: "#000000",
      pendingColor: "#eab308",
      downloadedColor: "#059669",
    },
  },
});

export type Conf = typeof tamaguiConfig;
declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
