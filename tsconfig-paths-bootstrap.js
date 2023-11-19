require("jsonminify");
const fs = require("fs");
// minify the tsconfig.json before parsing because it has comments in it
const tsConfig = JSON.parse(
  JSON.minify(fs.readFileSync("./tsconfig.json", { encoding: "utf8" })),
);
const tsConfigPaths = require("tsconfig-paths");

tsConfigPaths.register({
  // override the baseUrl with the outDir, because that is where we compiled the files to with tsc
  baseUrl: tsConfig.compilerOptions.outDir,
  paths: tsConfig.compilerOptions.paths,
});
