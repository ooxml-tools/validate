# @ooxml-tools/validate
Validate Office Open XML files in nodejs the browser

## Install

```bash
npm i @ooxml-tools/validate --save
```


## Usage
Pass an `ArrayBuffer` as `input` and get `results` as output

```js
import validateDocument from "@ooxml-tools/validate";

const version = "Microsoft365";
const results = await validateDocument(input, version);
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
# total 83776
# -rw-r--r--  1 orangemug  staff        66 19 Jul 15:06 _virtual_module-CEw6d6wF.js
# -rw-r--r--  1 orangemug  staff        68 19 Jul 15:06 _virtual_process-DZS8S267.js
# -rw-r--r--  1 orangemug  staff     35982 19 Jul 15:06 dotnet-BoocLZn6.js
# -rw-r--r--  1 orangemug  staff    149565 19 Jul 15:06 dotnet.native.8.0.7.lb1gfjpp0m-CY6aCK9K.js
# -rw-r--r--  1 orangemug  staff    222989 19 Jul 15:06 dotnet.runtime.8.0.7.bxd2x47e2z-34A-TL6K.js
# -rw-r--r--  1 orangemug  staff  41904493 19 Jul 15:06 index.js
# -rw-r--r--  1 orangemug  staff       259 19 Jul 15:06 package.json
```

## Know issues
It comes with some known issues

 - The library is huge, and slow. It's currently base64 encoding the WASM because of the issues getting WASM building across bundlers (**help wanted**)
 - The library base64 encodes the input OOXML file, which is slow. We should be using streaming (**help wanted**)
 - The C# is probably very poor quality... I'm not a C# developer (**help wanted**) 



## Licence
MIT
