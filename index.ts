// @ts-ignore: Unreachable code error
import config from "$blazor-config";
let FILE_ID = 0;
let fileStore = new Map();

export class InvalidVersionError extends Error {
  constructor(officeVersion: string) {
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
] as const;

export const FORMATS = ["xlsx", "pptx", "docx"] as const;

export function getFileFormatFromName(name: string) {
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

export type Format = (typeof FORMATS)[number];
export type OfficeVersion = (typeof OFFICE_VERSIONS)[number];

export type ValidationResult = {
  description: string;
  path: {
    xpath: string;
    partUri: string;
  };
  id: string;
  errorType: number;
};

export default async function validate(
  inputArrayBuffer: Uint8Array,
  format: Format | undefined,
  officeVersion: OfficeVersion = "Microsoft365",
): Promise<ValidationResult[]> {
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
  const errors = (JSON.parse(results) ?? []) as unknown[];
  return errors.map((error: any) => {
    return {
      description: error.Description,
      path: {
        xpath: error.Path.XPath,
        partUri: error.Path.PartUri,
      },
      id: error.Id,
      errorType: error.ErrorType,
    };
  });
}

async function _ready() {
  const mod = // @ts-ignore: Unreachable code error
    (await import("./dotnet/_framework/dotnet.js")).dotnet;
  const res = await mod
    .withDiagnosticTracing(false)
    .withConfig(config)
    .create();

  res.setModuleImports("index.js", {
    getFile: (id: string) => {
      const file = fileStore.get(id);
      if (!file) {
        throw new Error(`No such file '${id}'`);
      }
      return file;
    },
  });

  return res;
}

let runOnce: Promise<any> | undefined;
export async function ready() {
  if (!runOnce) {
    runOnce = _ready();
  }
  return runOnce;
}
