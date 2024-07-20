import config from "$blazor-config";
let FILE_ID = 0;
let fileStore = new Map();

function arrayBufferToBase64(file) {
  return btoa(
    new Uint8Array(file).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      "",
    ),
  );
}

export class InvalidVersionError extends Error {
  constructor(officeVersion) {
    super(`Invalid office version: ${officeVersion}`);
  }
}

export const OFFICE_VERSIONS = [
  "Microsoft365",
  "Office2007",
  "Office2010",
  "Office2013",
  "Office2016",
  "Office2019",
  "Office2021",
];

export const FORMATS = ["xlsx", "pptx", "docx"];

export function getFileFormatFromName(name) {
  const matchResults = name.match(/(\.[^.]+)$/);
  if (matchResults) {
    const ext = matchResults[1];
    switch (ext) {
      case ".pptx":
      case ".pptm":
      case ".potm":
      case ".potx":
      case ".ppam":
      case ".ppsm":
      case ".ppsx":
        return "pptx";
      case ".xlsx":
      case ".xlsm":
      case ".xltm":
      case ".xltx":
      case ".xlam":
        return "xlsx";
      case ".docx":
      case ".docm":
      case ".dotm":
      case ".dotx":
        return "docx";
    }
  }
}

export default async function validateDocument(
  inputArrayBuffer,
  format,
  officeVersion = "Microsoft365",
) {
  const { getAssemblyExports, getConfig } = await ready();

  if (!OFFICE_VERSIONS.includes(officeVersion)) {
    throw new InvalidVersionError(officeVersion);
  }

  FILE_ID++;
  fileStore.set(FILE_ID, inputArrayBuffer);
  const config = getConfig();
  const exports = await getAssemblyExports(config.mainAssemblyName);
  const results = exports.Docxidator.Process(FILE_ID, format, officeVersion);
  fileStore.delete(FILE_ID);
  return JSON.parse(results);
}

async function _ready() {
  const mod = (await import("./dotnet/_framework/dotnet.js")).dotnet;
  const res = await mod
    .withDiagnosticTracing(false)
    .withConfig(config)
    .create();

  res.setModuleImports("index.js", {
    getFile: (id) => {
      const file = fileStore.get(id);
      if (!file) {
        throw new Error(`No such file '${id}'`);
      }
      return arrayBufferToBase64(file);
    },
  });

  return res;
}

let runOnce;
export async function ready() {
  if (!runOnce) {
    runOnce = _ready();
  }
  return runOnce;
}
