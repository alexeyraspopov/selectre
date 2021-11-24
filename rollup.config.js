import copy from "rollup-plugin-copy";
import size from "rollup-plugin-bundle-size";

export default {
  input: "modules/selectre.js",
  output: [
    { file: "build/selectre.js", format: "cjs" },
    { file: "build/selectre.module.js", format: "esm" },
  ],
  plugins: [
    copy({
      targets: [
        { src: ["modules/selectre.d.ts", "LICENSE", "README.md"], dest: "build" },
        { src: "package.json", dest: "build", transform: generatePkg },
      ],
    }),
    size(),
  ],
};

function generatePkg(contents) {
  let pkg = JSON.parse(contents.toString());
  return JSON.stringify(
    {
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      author: pkg.author,
      license: pkg.license,
      homepage: pkg.homepage,
      repository: pkg.repository,
      main: "./selectre.js",
      module: "./selectre.module.js",
      types: "./selectre.d.ts",
      sideEffects: false,
      files: ["*.js", "*.d.ts"],
      keywords: ["react", "selector", "memoize", "state"],
    },
    null,
    2,
  );
}
