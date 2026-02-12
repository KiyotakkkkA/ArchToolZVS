import pako from "pako";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

function append3bytes(b1: number, b2: number, b3: number) {
  const c1 = b1 >> 2;
  const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  const c3 = ((b2 & 0xf) << 2) | (b3 >> 6);
  const c4 = b3 & 0x3f;
  return `${alphabet[c1]}${alphabet[c2]}${alphabet[c3]}${alphabet[c4]}`;
}

function encode6bitChunk(data: Uint8Array) {
  let result = "";
  for (let index = 0; index < data.length; index += 3) {
    if (index + 2 === data.length) {
      result += append3bytes(data[index], data[index + 1], 0);
    } else if (index + 1 === data.length) {
      result += append3bytes(data[index], 0, 0);
    } else {
      result += append3bytes(data[index], data[index + 1], data[index + 2]);
    }
  }
  return result;
}

export function encodePlantUml(text: string) {
  const bytes = new TextEncoder().encode(text);
  const compressed = pako.deflateRaw(bytes, { level: 9 });
  return encode6bitChunk(compressed);
}
