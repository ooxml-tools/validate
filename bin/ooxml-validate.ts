import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { readFile } from "fs/promises";
import { FORMATS, getFileFormatFromName, OFFICE_VERSIONS, ValidationResult } from "../index";
import validateDocument from "../index";
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

const argv = yargs(hideBin(process.argv))
  .command("$0 <filepath>", "validate docx files")
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
  .demandOption(["filepath"])
  .parseSync();

const file = await readFile(argv.filepath);
const format = argv.format ?? getFileFormatFromName(argv.filepath);
const officeVersion = argv.officeVersion;
const results = await validateDocument(file, format, officeVersion);
if (argv.outputFormat === "json") {
  console.log(JSON.stringify(results, null, 2));
} else {
  consolePrintErrors(results);
}
