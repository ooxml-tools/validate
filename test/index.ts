import validateDocument from "../dist/npm/index.js";
import { execa } from "execa";
import test from "node:test";
import { readFile } from "fs/promises";
import assert from "node:assert";
import { join, resolve } from "path";

const VALID_FILEPATH = join(import.meta.dirname, "/files/valid.docx");
const INVALID_FILEPATH = join(import.meta.dirname, "/files/invalid.docx");
const BIN_FILEPATH =
  "." + resolve(import.meta.dirname, "../../dist/npm/bin/ooxml-validate.js");

test("should validate valid file", async () => {
  const errors = await validateDocument(await readFile(VALID_FILEPATH));
  assert.deepEqual(errors, []);
});

test("should validate invalid file", async () => {
  const errors = await validateDocument(await readFile(INVALID_FILEPATH));
  assert.deepEqual(errors, [
    {
      description:
        "The element has invalid child element 'http://schemas.openxmlformats.org/wordprocessingml/2006/main:t'.",
      errorType: 0,
      id: "Sch_InvalidElementContentExpectingComplex",
      path: {
        partUri: "/word/document.xml",
        xpath: "/w:document[1]/w:body[1]/w:p[1]",
      },
    },
  ]);
});

test("should validate valid file", async () => {
  const { stdout } = await execa`tsx ${BIN_FILEPATH} ${VALID_FILEPATH}`;
  assert.equal(stdout, "Found 0 errors");
});

test("should validate invalid file", async () => {
  const { stdout } = await execa`tsx ${BIN_FILEPATH} ${INVALID_FILEPATH}`;
  assert.equal(
    stdout,
    [
      `./word/document.xml//w:document[1]/w:body[1]/w:p[1]`,
      `└─ Sch_InvalidElementContentExpectingComplex: The element has invalid child element 'http://schemas.openxmlformats.org/wordprocessingml/2006/main:t'.`,
      ``,
      `Found 1 errors`,
    ].join("\n"),
  );
});
