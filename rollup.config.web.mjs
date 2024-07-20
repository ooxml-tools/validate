import virtual from '@rollup/plugin-virtual';
import copy from 'rollup-plugin-copy';
import { getConfig } from './config.mjs';


const blankModule = () => "export default {}";

const outputDir = "dist/web"

export default {
  input: 'index.js',
  output: {
    dir: outputDir,
    format: 'es'
  },
  plugins: [
    virtual({
      "$blazor-config": getConfig(),
      // Blanks out some modules that exist in dotnet build code and not actually used. 
      "process": blankModule(),
      "module": blankModule(),
    }),
    copy({
      targets: [
        // FIXME: This is literally just for a `new URL()` in the dotnet runtime file
        { src: '_framework/dotnet.native.wasm', dest: outputDir },
      ]
    })
  ]
};
