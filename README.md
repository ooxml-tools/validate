# <img alt="@ooxml-tools/validate" height="56" src="https://github.com/user-attachments/assets/d52e1422-5601-427f-aad2-3a47a77651fe" />

Validate Office Open XML files in nodejs the browser

## Install

```bash
npm install @ooxml-tools/validate --save
```

## CLI

Once installed run

```bash
ooxml-validate ./test.docx
```

All the options can be seen with

```bash
ooxml-validate --help
# ooxml-validate <filepath>
#
# validate docx files
#
# Positionals:
#   filepath  filepath of OOXML file                                      [string]
#
# Options:
#       --help                  Show help                                [boolean]
#       --version               Show version number                      [boolean]
#       --office-version, --ov  office version used for validation
#              [choices: "Microsoft365", "Office2007", "Office2010", "Office2013",
#              "Office2016", "Office2019", "Office2021"] [default: "Microsoft365"]
#       --output-format, --of   format of output
#                                  [choices: "pretty", "json"] [default: "pretty"]
#   -f, --format                document format (should be auto-detected)
#                                                [choices: "xlsx", "pptx", "docx"]
```

## Usage

Pass an `ArrayBuffer` as `input` and get `results` as output

```js
import validate from "@ooxml-tools/validate";

const version = "Microsoft365";
const results = await validate(input, version);
console.log(results);
```

Where `version` of one of `["Microsoft365", "Office2007", "Office2010", "Office2013", "Office2016", "Office2019", "Office2021"]`

## Development

> [!NOTE]  
> If you don't feel like installing all the dependencies you can run the following
>
> ```bash
> ./docker.sh
> ```
>
> This will start a docker shell with all the dependencies installed. The following commands can then be run in that shell without installing any dependencies (other then `docker`/`docker-compose`)

You'll need dotnet 8 installed locally, to whether it's installed run `dotnet --version`.

You'll also need to install the `node_modules` via

```bash
npm install
```

Build the library run

```bash
npm run build
```

The built npm package will be output to `./dist/npm/*`

```bash
ls -l ./dist/npm/
# total 41340
# -rw-r--r-- 1 root root      818 Jul 20 09:05 _virtual_module-D7pcKkEN.js
# -rw-r--r-- 1 root root     2335 Jul 20 09:05 _virtual_process-CKiOJcMv.js
# drwxr-xr-x 3 root root       96 Jul 20 09:05 bin
# -rw-r--r-- 1 root root    35982 Jul 20 09:05 dotnet-CjdMQPqM.js
# -rw-r--r-- 1 root root   149565 Jul 20 09:05 dotnet.native.8.0.7.lb1gfjpp0m-Dp0tYBIl.js
# -rw-r--r-- 1 root root   222989 Jul 20 09:05 dotnet.runtime.8.0.7.bxd2x47e2z-B0R9BXGJ.js
# -rw-r--r-- 1 root root 41906074 Jul 20 09:05 index.js
# -rw-r--r-- 1 root root     1027 Jul 20 09:05 package.json
```

## Known issues

It comes with some known issues

- The library is huge, and slow. It's currently base64 encoding the WASM because of the issues getting WASM building across bundlers (**help wanted**)
- The library base64 encodes the input OOXML file, which is slow. We should be using streaming (**help wanted**)
- The C# is probably very poor quality... I'm not a C# developer (**help wanted**)

## Licence

MIT
