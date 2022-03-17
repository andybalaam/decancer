const { readdirSync, readFileSync, writeFileSync } = require("fs");
const { version, description, author, homepage, keywords, license, bugs } = require("./package.json");
const { join } = require("path");

const alphabetRs = readFileSync(join(__dirname, "src", "alphabet.rs")).toString();
const miscRs = readFileSync(join(__dirname, "src", "misc.rs")).toString();

const ALPHABETICAL_1 = eval(alphabetRs.match(/const ALPHABETICAL_1: \[&'static \[u16\]; 26\] = ([\s\S]*?);/)[1].replace(/&\[/g, "[")).flat();

const ALPHABETICAL_2_ORDERS = eval(alphabetRs
  .match(/const ALPHABETICAL_2_ORDERS: \[\(u16, &'static \[u16\]\); 2\] = ([\s\S]*?);/)[1]
  .match(/&\[([\s\S]*?)\]/g)
  .map(x => x.slice(1))).flat().length * 24;

const ALPHABETICAL_2 = eval(alphabetRs
  .match(/const ALPHABETICAL_2: \[\(u8, &'static \[\(u16, u16\)\]\); \d+\] = ([\s\S]*?);/)[1]
  .match(/&\[([\s\S]*?)\]/g)
  .map(x => x.slice(1).replace(/\(/g, "[").replace(/\)/g, "]"))).flat();
  
const ALPHABETICAL_PATTERN = eval(alphabetRs
  .match(/const ALPHABETICAL_PATTERN: \[u16; \d+\] = ([\s\S]*?);/)[1]);

const NUMERICAL = eval(miscRs
  .match(/const NUMERICAL: \[u16; \d+\] = ([\s\S]*?);/)).length * 10;

const MISC = miscRs
  .match(/const MISC: \[\(&'static \[u8\], &'static \[u16\]\); \d+\] = ([\s\S]*?);/)[1]
  .match(/, &\[([\s\S]*?)\]\)/g)
  .map(x => eval(x.slice(3, -1))).flat();

/*
  emote '10',
  emote '1-9',
  emote 'a-z',
  emote '!',
  emote '?',
  emote '#', and
  emote '*'
*/
const EMOJIS = 1 + 9 + 26 + 1 + 1 + 1 + 1;

const supportedCount = 
  [...new Set([...ALPHABETICAL_1, ...ALPHABETICAL_2, ...MISC])].length
   + ALPHABETICAL_2_ORDERS + NUMERICAL + EMOJIS;

writeFileSync("README.md", readFileSync("./README.md").toString()
  .replace(/__\*\*([\s\S]*?)\*\*__/,
           `__**As of version ${version}, This library supports ${supportedCount.toLocaleString()} different code-points.**__`));

const dependencies = [];

for (const platform of readdirSync("./npm")) {
  dependencies.push({
    [`@vierofernando/decancer-${platform}`]: version
  });
  
  const packageJsonPath = join(__dirname, "npm", platform, "package.json");
  writeFileSync(packageJsonPath, JSON.stringify(Object.assign(require(packageJsonPath), {
    version, author, homepage, bugs, keywords, license,
    description: description + ` (Binary port for ${platform})`,
    name: `@vierofernando/decancer-${platform}`
  }), null, 2));
}

writeFileSync("./package.json", JSON.stringify(Object.assign(require("./package.json"), { dependencies }), null, 2));