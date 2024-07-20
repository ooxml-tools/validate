import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers'
import {readFile} from "fs/promises"
import { FORMATS, OFFICE_VERSIONS } from '../index.js';
import validateDocument from '../index.js';

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
            .option('format', {
                alias: 'f',
                describe: 'document format (should be auto-detected)',
                choices: FORMATS
            })
    }, async (argv) => {
        const file = await readFile(argv.filepath);
        const results = await validateDocument(file, argv.officeVersion, argv.format)
        console.log(
            JSON.stringify(results, null, 2)
        );
        console.log(`Found ${results.length} errors`)
    })
    .argv
