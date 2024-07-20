import virtual from '@rollup/plugin-virtual';
import copy from 'rollup-plugin-copy';
import { getConfig } from './config.mjs';
import json from '@rollup/plugin-json';


const blankModule = () => "export default {}";

const outputDir = "dist/node"

export default {
  input: {
    index: 'index.js',
    "bin/ooxml-validate": 'bin/ooxml-validate.js'
  },
  output: {
    dir: outputDir,
    format: 'es'
  },
  plugins: [
    json(),
    virtual({
      "$blazor-config": getConfig(),
    }),
    copy({
      targets: [
        // FIXME: This is literally just for a `new URL()` in the dotnet runtime file
        { src: '_framework/dotnet.native.wasm', dest: outputDir },
      ]
    })
  ]
};
