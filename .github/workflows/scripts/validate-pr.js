const { readFile } = require("fs/promises");
const comment = require("./create-comment");
const path = require("path");
const { existsSync } = require("fs");

module.exports = async ({ github, context, files }) => {
  const errors = [];
  for (const file of files.split("\n")) {
    if (path.basename(file) !== "theme.json") {
      errors.push(
        "The JSON file must be named theme.json otherwise it won't work."
      );
    }

    if (!existsSync(file)) {
      errors.push(
        `You cannot change the ID or directory name of a theme. Since the ID is internal, you can leave it as is and just change the title. Otherwise, please create a new theme with the new id.`
      );
      continue;
    }

    const theme = JSON.parse(await readFile(file, "utf-8"));
    const expectedPath = `themes/${theme.id}/v${theme.compatibilityVersion}/theme.json`;
    if (file !== expectedPath) {
      errors.push(
        `Theme directory must match theme id. Expected theme.json path to be \`${expectedPath}\` but found \`${file}\`.`
      );
    }
  }
  if (errors.length > 0) {
    await comment({
      github,
      context,
      id: "validate-pr",
      body: `**We found a couple of errors in your submission:**
    
${errors.join("\n\n")}`,
    });
    throw new Error(errors.join(", "));
  }
  return true;
};
