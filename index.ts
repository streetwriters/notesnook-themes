import path from "path";
import fs from "fs";

import { ThemeDark } from "./themes/dark";
import { ThemeLight } from "./themes/light";
import { ThemeDracula } from "./themes/dracula";
import { ThemePitchBlack } from "./themes/pitch-black";

const themes = [ThemeDark, ThemeLight, ThemeDracula, ThemePitchBlack];

function generate() {
  const OUTPUT_DIR = path.join(__dirname, "..", "generated");
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmdirSync(OUTPUT_DIR, {
      recursive: true,
    });
  }
  fs.mkdirSync(OUTPUT_DIR);
  themes.forEach((theme) => {
    const THEME_DIR = path.join(OUTPUT_DIR, theme.id);
    fs.mkdirSync(THEME_DIR);
    fs.writeFileSync(
      path.join(THEME_DIR, `theme.json`),
      JSON.stringify(theme),
      "utf-8"
    );
  });
}

generate();
