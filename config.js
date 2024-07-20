import { readFileSync } from "fs";

const blazorBootConfig = JSON.parse(
  readFileSync(
    new URL("./dotnet/_framework/blazor.boot.json", import.meta.url),
    "utf8",
  ),
);

export function getConfig() {
  const js = `export default {
    mainAssemblyName: "${blazorBootConfig.mainAssemblyName}",
    cacheBootResources: true,
    debugLevel: 0,
    linkerEnabled: true,
    globalizationMode: "sharded",
    assets: [
        ${[
          ...Object.keys(blazorBootConfig.resources.jsModuleNative).map(
            (filepath) => {
              return `{
            name: ${JSON.stringify(filepath)},
            moduleExports: import("./dotnet/_framework/${filepath}"),
            behavior: "js-module-native",
            }`;
            },
          ),
          ...Object.keys(blazorBootConfig.resources.jsModuleRuntime).map(
            (filepath) => {
              return `{
            name: ${JSON.stringify(filepath)},
            moduleExports: import("./dotnet/_framework/${filepath}"),
            behavior: "js-module-runtime",
            }`;
            },
          ),
          ...Object.keys(blazorBootConfig.resources.wasmNative).map(
            (filepath) => {
              return `{
            name: ${JSON.stringify(filepath)},
            buffer: Buffer.from("${readFileSync(`dotnet/_framework/${filepath}`, { encoding: "base64" })}", "base64"),
            behavior: "dotnetwasm",
            }`;
            },
          ),
          ...Object.keys(blazorBootConfig.resources.icu).map((filepath) => {
            return `{
            name: ${JSON.stringify(filepath)},
            buffer: Buffer.from("${readFileSync(`dotnet/_framework/${filepath}`, { encoding: "base64" })}", "base64"),
            behavior: "icu",
            }`;
          }),
          ...Object.keys(blazorBootConfig.resources.assembly).map(
            (filepath) => {
              return `{
            name: ${JSON.stringify(filepath)},
            buffer: Buffer.from("${readFileSync(`dotnet/_framework/${filepath}`, { encoding: "base64" })}", "base64"),
            behavior: "assembly",
            }`;
            },
          ),
        ].join(",")}
    ]
    }`;
  return js;
}
