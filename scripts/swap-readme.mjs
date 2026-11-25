import { copyFileSync, existsSync, renameSync } from "node:fs";

/**
 * The repository's README.md is written for GitHub; README_NPM.md is the one shown on npmjs.com.
 * npm always packs the root README.md, so `prepack` swaps the npm one in and `postpack` swaps it back.
 *
 *   node scripts/swap-readme.mjs npm      # before packing
 *   node scripts/swap-readme.mjs github   # after packing (and to repair an interrupted pack)
 */

// not named README*: npm packs every README file it finds at the root
const GITHUB_BACKUP = ".github-readme.md.bak";
const target = process.argv[2];

if (target === "npm") {
    if (!existsSync(GITHUB_BACKUP)) {
        renameSync("README.md", GITHUB_BACKUP);
    }
    copyFileSync("README_NPM.md", "README.md");
} else if (target === "github") {
    if (existsSync(GITHUB_BACKUP)) {
        renameSync(GITHUB_BACKUP, "README.md");
    }
} else {
    console.error('swap-readme: pass "npm" or "github"');
    process.exit(1);
}
