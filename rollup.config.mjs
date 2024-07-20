import virtual from '@rollup/plugin-virtual';
import copy from 'rollup-plugin-copy';
import { getConfig } from './config.js';
import {join} from "path"

const outputDir = join(import.meta.dirname, "/dist/npm/")

function shimModule () {
  return `
  const mod = (typeof window === 'undefined') ? await import(await import.meta.resolve("node:module")) : {}
  export const {
      _cache,
      _pathCache,
      _extensions,
      globalPaths,
      _debug,
      isBuiltin,
      _findPath,
      _nodeModulePaths,
      _resolveLookupPaths,
      _load,
      _resolveFilename,
      createRequire,
      _initPaths,
      _preloadModules,
      syncBuiltinESMExports,
      Module,
      builtinModules,
      runMain,
      findSourceMap,
      register,
      SourceMap,
  } = mod;
  `
}

function shimProcess () {
  return `
  const mod = (typeof window === 'undefined') ? global.process : {}
  export const {
    version,
    versions,
    arch,
    platform,
    release,
    _rawDebug,
    moduleLoadList,
    binding,
    _linkedBinding,
    _events,
    _eventsCount,
    _maxListeners,
    domain,
    _exiting,
    exitCode,
    config,
    dlopen,
    uptime,
    _getActiveRequests,
    _getActiveHandles,
    getActiveResourcesInfo,
    reallyExit,
    _kill,
    loadEnvFile,
    cpuUsage,
    resourceUsage,
    memoryUsage,
    constrainedMemory,
    availableMemory,
    kill,
    exit,
    finalization,
    hrtime,
    openStdin,
    getuid,
    geteuid,
    getgid,
    getegid,
    getgroups,
    allowedNodeEnvironmentFlags,
    assert,
    features,
    _fatalException,
    setUncaughtExceptionCaptureCallback,
    hasUncaughtExceptionCaptureCallback,
    emitWarning,
    nextTick,
    _tickCallback,
    sourceMapsEnabled,
    setSourceMapsEnabled,
    getBuiltinModule,
    _debugProcess,
    _debugEnd,
    _startProfilerIdleNotifier,
    _stopProfilerIdleNotifier,
    stdout,
    stdin,
    stderr,
    abort,
    umask,
    chdir,
    cwd,
    initgroups,
    setgroups,
    setegid,
    seteuid,
    setgid,
    setuid,
    env,
    title,
    argv,
    execArgv,
    pid,
    ppid,
    execPath,
    debugPort,
    argv0,
    _preload_modules,
    report
  } = mod
  `
}

export default {
  input: {
    index: 'index.js',
    "bin/ooxml-validate": 'bin/ooxml-validate.js'
  },
  output: {
    dir: outputDir,
    format: 'es'
  },
  external: ['yargs/yargs', 'yargs/helpers', 'fs/promises'],
  plugins: [
    virtual({
      "$blazor-config": getConfig(),
      "process": shimProcess(),
      "module": shimModule()
    }),
    copy({
      targets: [
        // FIXME: This is literally just for a `new URL()` in the dotnet runtime file
        { src: '_framework/dotnet.native.wasm', dest: outputDir },
      ]
    })
  ]
};
