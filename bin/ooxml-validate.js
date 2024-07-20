import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers'
import {readFile} from "fs/promises"
import { FORMATS, OFFICE_VERSIONS } from '../index.js';
import validateDocument from '../index.js';
import chalk from 'chalk';

function consolePrintErrors (errors) {
    if (errors.length > 0) {
        for (const error of errors) {
            console.log(chalk.blue(`.${error.Path.PartUri}/${error.Path.XPath}`));
            console.log(`${chalk.red(error.Id)}: ${error.Description}`)
        }
        console.log("")
    }
    console.log(chalk[errors.length > 0 ? "red" : "green"](`Found ${chalk.bold(errors.length)} errors`))
}

yargs(hideBin(process.argv))
    .command('$0 <filepath>', 'validate docx files', (yargs) => {
        yargs
        .positional("filepath", {
            describe: 'filepath of OOXML file',
            type: 'string'
        })
        .option('office-version', {
            alias: 'ov',
            describe: 'office version used for validation',
            choices: OFFICE_VERSIONS,
            default: OFFICE_VERSIONS[0]
        })
        .option('output-format', {
            alias: 'of',
            describe: 'format of output',
            choices: ["pretty", "json"],
            default: "pretty"
        })
            .option('format', {
                alias: 'f',
                describe: 'document format (should be auto-detected)',
                choices: FORMATS
            })
    }, async (argv) => {
        const file = await readFile(argv.filepath);
        const results = await validateDocument(file, argv.officeVersion, argv.format)
        if (argv.outputFormat === "json") {
            console.log(
                JSON.stringify(results, null, 2)
            );
        } else {
            consolePrintErrors(results)
        }
    })
    .argv
