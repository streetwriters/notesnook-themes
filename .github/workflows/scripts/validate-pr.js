const { readFile } = require("fs/promises");
const comment = require("./create-comment");

module.exports = async ({ github, context, files }) => {
  const errors = [];
  for (const file of files.split("\n")) {
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
    return false;
  }
  return true;
};
