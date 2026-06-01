// Metro config — extends Expo defaults so we can:
//   1. Import the canonical FFIE tokens module from outside this app
//      (../project/design-system/tokens.ts) — same pattern as the Next.js
//      preview app's webpack alias + experimental.externalDir.
//   2. Watch that file for hot reload when tokens change.
//
// Workspace root = /Users/du-mac/FFIE. Mobile lives at /Users/du-mac/FFIE/mobile.
// Tokens live at /Users/du-mac/FFIE/project/design-system/tokens.ts.

const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "..");

const config = getDefaultConfig(projectRoot);

// 1. Watch the FFIE root so Metro picks up edits to tokens.ts.
config.watchFolders = [workspaceRoot];

// 2. Resolve node_modules from the mobile app first, then workspace root.
//    Hierarchical lookup is left ON (Expo's recommended default) — there's no
//    /Users/du-mac/FFIE/node_modules to collide with, so walking up the tree
//    is harmless. Sibling design-system-preview/node_modules is one level
//    deeper, not visible to upward lookup.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

module.exports = config;
