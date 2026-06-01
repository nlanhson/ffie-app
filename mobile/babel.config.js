module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            // Single source of truth — same alias as the Next.js preview app.
            "@tokens": "../project/design-system/tokens.ts",
            "@": "./src",
          },
        },
      ],
    ],
  };
};
