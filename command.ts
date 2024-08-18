import { readFile } from "fs/promises";
import {
  Format,
  FORMATS,
  getFileFormatFromName,
  OFFICE_VERSIONS,
  OfficeVersion,
  ValidationResult,
} from "./index";
import validate from "./index";
import { ArgumentsCamelCase, Argv } from "yargs";
import chalk from "chalk";

function consolePrintErrors(errors: ValidationResult[]) {
  if (errors.length > 0) {
    for (const error of errors) {
      console.log(chalk.blue(`.${error.path.partUri}/${error.path.xpath}`));
      console.log(`└─ ${chalk.red(error.id)}: ${error.description}`);
    }
    console.log("");
  }
  console.log(
    chalk[errors.length > 0 ? "red" : "green"](
      `Found ${chalk.bold(errors.length)} errors`,
    ),
  );
}

export const cmd = "$0 <filepath>";

export const desc = "validate docx files";

export const builder = (yargs: Argv) => {
  yargs
    .positional("filepath", {
      describe: "filepath of OOXML file",
      type: "string",
    })
    .option("office-version", {
      alias: "ov",
      describe: "office version used for validation",
      choices: OFFICE_VERSIONS,
      default: OFFICE_VERSIONS[0],
    })
    .option("output-format", {
      alias: "of",
      describe: "format of output",
      choices: ["pretty", "json"],
      default: "pretty",
    })
    .option("format", {
      alias: "f",
      describe: "document format (auto-detected from file extension)",
      choices: FORMATS,
    })
    .demandOption(["filepath"]);
};

export async function handler({
  filepath,
  format,
  officeVersion,
  outputFormat,
}: ArgumentsCamelCase<{
  filepath: string;
  format: Format;
  officeVersion: OfficeVersion;
  outputFormat: string;
}>) {
  const file = await readFile(filepath);
  const parsedFormat = format ?? getFileFormatFromName(filepath);
  const results = await validate(file, parsedFormat, officeVersion);
  if (outputFormat === "json") {
    console.log(JSON.stringify(results, null, 2));
  } else {
    consolePrintErrors(results);
  }
  process.exit(0);
}
