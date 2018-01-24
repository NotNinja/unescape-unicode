/*
 * Copyright (C) 2018 Alasdair Mercer, !ninja
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

// TODO: Complete

const errors = require('./errors');

/**
 * TODO: Document
 *
 * @param {string} input -
 * @param {number} start -
 * @return {number}
 */
function getOffset(input, start) {
  let ch = input[start];

  switch (ch) {
  case '\\':
    ch = input[start + 1];
    if (ch !== 'u') {
      throw new Error(errors.unexpectedCharacter(ch, start + 1));
    }

    return 2;
  case 'u':
    return 1;
  default:
    return 0;
  }
}

/**
 * TODO: Document
 *
 * @param {?string} input -
 * @param {number} [start=0] -
 * @return {?string}
 * @throws {Error}
 */
function unescapeUnicode(input, start) {
  if (input == null) {
    return input;
  }
  if (start == null || start < 0) {
    start = 0;
  }

  start += getOffset(input, start);

  const end = Math.min(start, input.length) + 4;
  if (end > input.length) {
    throw new Error(errors.insufficientCharacters(input.length - end));
  }

  let unicode = 0;

  for (let i = start; i < end; i++) {
    const ch = input[i];
    const code = ch.charCodeAt(0);

    // TODO: Switch to hash lookup to improve performance even further
    switch (ch) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      unicode = (unicode << 4) + code - 0x30;
      break;
    case 'A':
    case 'B':
    case 'C':
    case 'D':
    case 'E':
    case 'F':
      unicode = (unicode << 4) + 10 + code - 0x41;
      break;
    case 'a':
    case 'b':
    case 'c':
    case 'd':
    case 'e':
    case 'f':
      unicode = (unicode << 4) + 10 + code - 0x61;
      break;
    default:
      throw new Error(errors.unexpectedCharacter(ch, i));
    }
  }

  return String.fromCharCode(unicode);
}

module.exports = unescapeUnicode;
