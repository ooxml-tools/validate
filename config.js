import {readFileSync} from 'fs';
// import blazorBootConfig from "./_framework/blazor.boot.json" assert { type: 'json' };
const blazorBootConfig = JSON.parse(readFileSync(new URL('./_framework/blazor.boot.json', import.meta.url), 'utf8'));

export function getConfig () {
    const js = `export default {
    mainAssemblyName: "${blazorBootConfig.mainAssemblyName}",
    cacheBootResources: true,
    debugLevel: 0,
    linkerEnabled: true,
    globalizationMode: "sharded",
    assets: [
        ${[
        ...Object.keys(blazorBootConfig.resources.jsModuleNative).map(filepath => {
            return `{
            name: ${JSON.stringify(filepath)},
            moduleExports: import("./_framework/${filepath}"),
            behavior: "js-module-native",
            }`
        }),
        ...Object.keys(blazorBootConfig.resources.jsModuleRuntime).map(filepath => {
            return `{
            name: ${JSON.stringify(filepath)},
            moduleExports: import("./_framework/${filepath}"),
            behavior: "js-module-runtime",
            }`
        }),
        ...Object.keys(blazorBootConfig.resources.wasmNative).map(filepath => {
            return `{
            name: ${JSON.stringify(filepath)},
            buffer: Buffer.from("${readFileSync(`_framework/${filepath}`, { encoding: 'base64' })}", "base64"),
            behavior: "dotnetwasm",
            }`
        }),
        ...Object.keys(blazorBootConfig.resources.icu).map(filepath => {
            return `{
            name: ${JSON.stringify(filepath)},
            buffer: Buffer.from("${readFileSync(`_framework/${filepath}`, { encoding: 'base64' })}", "base64"),
            behavior: "icu",
            }`
        }),
        ...Object.keys(blazorBootConfig.resources.assembly).map(filepath => {
            return `{
            name: ${JSON.stringify(filepath)},
            buffer: Buffer.from("${readFileSync(`_framework/${filepath}`, { encoding: 'base64' })}", "base64"),
            behavior: "assembly",
            }`
        }),
        ].join(",")}
    ]
    }`
    return js
}