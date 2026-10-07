import { readFile, writeFile } from "node:fs/promises";

const fontsDirectory = new URL("../src/app/fonts/", import.meta.url);
const files = {
  sansRegular: "TimelessSans-SansRegular.otf",
  sansMedium: "TimelessSans-SansMedium.otf",
  serifLight: "TimelessSerif-Light.otf",
};

const fonts = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([name, file]) => [
      name,
      (await readFile(new URL(file, fontsDirectory))).toString("base64"),
    ]),
  ),
);

await writeFile(new URL("og-fonts.json", fontsDirectory), `${JSON.stringify(fonts, null, 2)}\n`);
