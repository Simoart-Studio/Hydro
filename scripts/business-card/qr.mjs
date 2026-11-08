// QR Code encoder (ISO/IEC 18004), byte mode, versions 1–10.
// Written in-house so the card build needs no extra dependency; selfTest() checks it against
// published vectors and decodes every symbol it produces back to the input.

const ECC = {
  L: {
    bits: 1,
    perBlock: [7, 10, 15, 20, 26, 18, 20, 24, 30, 18],
    blocks: [1, 1, 1, 1, 1, 2, 2, 2, 2, 4],
  },
  M: {
    bits: 0,
    perBlock: [10, 16, 26, 18, 24, 16, 18, 22, 22, 26],
    blocks: [1, 1, 1, 2, 2, 4, 4, 4, 5, 5],
  },
  Q: {
    bits: 3,
    perBlock: [13, 22, 18, 26, 18, 24, 18, 22, 20, 24],
    blocks: [1, 1, 2, 2, 4, 4, 6, 6, 8, 8],
  },
  H: {
    bits: 2,
    perBlock: [17, 28, 22, 16, 22, 28, 26, 26, 24, 28],
    blocks: [1, 1, 2, 4, 4, 4, 5, 6, 8, 8],
  },
};
const MAX_VERSION = 10;

const gfMultiply = (x, y) => {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
};

const rsDivisor = (degree) => {
  const result = new Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 2);
  }
  return result;
};

export const rsRemainder = (data, degree) => {
  const divisor = rsDivisor(degree);
  const result = new Array(degree).fill(0);
  for (const byte of data) {
    const factor = byte ^ result.shift();
    result.push(0);
    divisor.forEach((coefficient, i) => (result[i] ^= gfMultiply(coefficient, factor)));
  }
  return result;
};

const rawDataModules = (version) => {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const alignCount = Math.floor(version / 7) + 2;
    result -= (25 * alignCount - 10) * alignCount - 55;
    if (version >= 7) result -= 36;
  }
  return result;
};

const dataCodewords = (version, ecl) =>
  Math.floor(rawDataModules(version) / 8) -
  ECC[ecl].perBlock[version - 1] * ECC[ecl].blocks[version - 1];

const alignmentPositions = (version) => {
  if (version === 1) return [];
  const count = Math.floor(version / 7) + 2;
  const size = version * 4 + 17;
  const step = Math.ceil((version * 4 + 4) / (count * 2 - 2)) * 2;
  const result = [6];
  for (let pos = size - 7; result.length < count; pos -= step) result.splice(1, 0, pos);
  return result;
};

export const formatBits = (ecl, mask) => {
  const data = (ECC[ecl].bits << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  return ((data << 10) | rem) ^ 0x5412;
};

const versionBits = (version) => {
  let rem = version;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
  return (version << 12) | rem;
};

const bit = (value, i) => ((value >>> i) & 1) !== 0;

const MASKS = [
  (x, y) => (x + y) % 2 === 0,
  (x, y) => y % 2 === 0,
  (x) => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

class Symbol {
  constructor(version) {
    this.version = version;
    this.size = version * 4 + 17;
    this.modules = Array.from({ length: this.size }, () => new Array(this.size).fill(false));
    this.isFunction = Array.from({ length: this.size }, () => new Array(this.size).fill(false));
  }

  setFunction(x, y, dark) {
    this.modules[y][x] = dark;
    this.isFunction[y][x] = true;
  }

  drawFunctionPatterns(ecl) {
    const { size } = this;
    for (let i = 0; i < size; i++) {
      this.setFunction(6, i, i % 2 === 0);
      this.setFunction(i, 6, i % 2 === 0);
    }
    for (const [cx, cy] of [
      [3, 3],
      [size - 4, 3],
      [3, size - 4],
    ]) {
      for (let dy = -4; dy <= 4; dy++)
        for (let dx = -4; dx <= 4; dx++) {
          const x = cx + dx;
          const y = cy + dy;
          const distance = Math.max(Math.abs(dx), Math.abs(dy));
          if (x >= 0 && x < size && y >= 0 && y < size)
            this.setFunction(x, y, distance !== 2 && distance !== 4);
        }
    }
    const positions = alignmentPositions(this.version);
    const last = positions.length - 1;
    positions.forEach((py, i) =>
      positions.forEach((px, j) => {
        if ((i === 0 && j === 0) || (i === 0 && j === last) || (i === last && j === 0)) return;
        for (let dy = -2; dy <= 2; dy++)
          for (let dx = -2; dx <= 2; dx++)
            this.setFunction(px + dx, py + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }),
    );
    this.drawFormat(ecl, 0);
    if (this.version >= 7) {
      const bits = versionBits(this.version);
      for (let i = 0; i < 18; i++) {
        const a = size - 11 + (i % 3);
        const b = Math.floor(i / 3);
        this.setFunction(a, b, bit(bits, i));
        this.setFunction(b, a, bit(bits, i));
      }
    }
  }

  drawFormat(ecl, mask) {
    const bits = formatBits(ecl, mask);
    const { size } = this;
    for (let i = 0; i <= 5; i++) this.setFunction(8, i, bit(bits, i));
    this.setFunction(8, 7, bit(bits, 6));
    this.setFunction(8, 8, bit(bits, 7));
    this.setFunction(7, 8, bit(bits, 8));
    for (let i = 9; i < 15; i++) this.setFunction(14 - i, 8, bit(bits, i));
    for (let i = 0; i < 8; i++) this.setFunction(size - 1 - i, 8, bit(bits, i));
    for (let i = 8; i < 15; i++) this.setFunction(8, size - 15 + i, bit(bits, i));
    this.setFunction(8, size - 8, true);
  }

  /** Visits the data modules in placement order (two-column zigzag from the bottom right). */
  *dataCoordinates() {
    const { size } = this;
    for (let right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (let vert = 0; vert < size; vert++)
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? size - 1 - vert : vert;
          if (!this.isFunction[y][x]) yield [x, y];
        }
    }
  }

  drawCodewords(codewords) {
    let i = 0;
    for (const [x, y] of this.dataCoordinates()) {
      if (i < codewords.length * 8) this.modules[y][x] = bit(codewords[i >>> 3], 7 - (i & 7));
      i++;
    }
  }

  applyMask(mask) {
    for (let y = 0; y < this.size; y++)
      for (let x = 0; x < this.size; x++)
        if (!this.isFunction[y][x] && MASKS[mask](x, y)) this.modules[y][x] = !this.modules[y][x];
  }

  penalty() {
    const { size, modules } = this;
    let result = 0;
    const lines = [];
    for (let i = 0; i < size; i++) {
      lines.push(modules[i]);
      lines.push(modules.map((row) => row[i]));
    }
    for (const line of lines) {
      let run = 1;
      for (let i = 1; i <= size; i++) {
        if (i < size && line[i] === line[i - 1]) run++;
        else {
          if (run >= 5) result += run - 2;
          run = 1;
        }
      }
      const padded = [...new Array(4).fill(false), ...line, ...new Array(4).fill(false)];
      const text = padded.map((dark) => (dark ? "1" : "0")).join("");
      for (const pattern of ["00001011101", "10111010000"])
        for (let at = text.indexOf(pattern); at !== -1; at = text.indexOf(pattern, at + 1))
          result += 40;
    }
    let dark = 0;
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        if (modules[y][x]) dark++;
        if (
          x < size - 1 &&
          y < size - 1 &&
          modules[y][x] === modules[y][x + 1] &&
          modules[y][x] === modules[y + 1][x] &&
          modules[y][x] === modules[y + 1][x + 1]
        )
          result += 3;
      }
    const total = size * size;
    result += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * 10;
    return result;
  }
}

const encodeBytes = (bytes, version, ecl) => {
  const capacity = dataCodewords(version, ecl);
  const bits = [];
  const push = (value, length) => {
    for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, version <= 9 ? 8 : 16);
  for (const byte of bytes) push(byte, 8);
  push(0, Math.min(4, capacity * 8 - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  const data = [];
  for (let i = 0; i < bits.length; i += 8)
    data.push(bits.slice(i, i + 8).reduce((byte, b) => (byte << 1) | b, 0));
  for (let pad = 0xec; data.length < capacity; pad ^= 0xec ^ 0x11) data.push(pad);
  return data;
};

const interleave = (data, version, ecl) => {
  const blockCount = ECC[ecl].blocks[version - 1];
  const eccLength = ECC[ecl].perBlock[version - 1];
  const raw = Math.floor(rawDataModules(version) / 8);
  const shortBlocks = blockCount - (raw % blockCount);
  const shortLength = Math.floor(raw / blockCount);
  const blocks = [];
  for (let i = 0, k = 0; i < blockCount; i++) {
    const length = shortLength - eccLength + (i < shortBlocks ? 0 : 1);
    const block = data.slice(k, k + length);
    k += length;
    const ecc = rsRemainder(block, eccLength);
    if (i < shortBlocks) block.push(0);
    blocks.push([...block, ...ecc]);
  }
  const result = [];
  for (let i = 0; i < blocks[0].length; i++)
    blocks.forEach((block, j) => {
      if (i !== shortLength - eccLength || j >= shortBlocks) result.push(block[i]);
    });
  return result;
};

/** Returns the module matrix (true = dark) without the quiet zone. */
export const encode = (text, ecl = "Q") => {
  const bytes = [...new TextEncoder().encode(text)];
  let version = 1;
  while (version <= MAX_VERSION && dataCodewords(version, ecl) < bytes.length + 2) version++;
  if (version > MAX_VERSION) throw new Error(`Text too long for a version ${MAX_VERSION} QR code`);
  const symbol = new Symbol(version);
  symbol.drawFunctionPatterns(ecl);
  symbol.drawCodewords(interleave(encodeBytes(bytes, version, ecl), version, ecl));
  let best = 0;
  let lowest = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    symbol.applyMask(mask);
    symbol.drawFormat(ecl, mask);
    const score = symbol.penalty();
    if (score < lowest) [best, lowest] = [mask, score];
    symbol.applyMask(mask);
  }
  symbol.applyMask(best);
  symbol.drawFormat(ecl, best);
  return { modules: symbol.modules, version, ecl, mask: best };
};

/** Reads a symbol back: format, unmasking, codeword order, de-interleaving, RS syndromes, payload. */
export const decode = (modules) => {
  const size = modules.length;
  const version = (size - 17) / 4;
  let format = 0;
  const read = (x, y) => (modules[y][x] ? 1 : 0);
  const order = [
    [8, 0],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 7],
    [8, 8],
    [7, 8],
    [5, 8],
    [4, 8],
    [3, 8],
    [2, 8],
    [1, 8],
    [0, 8],
  ];
  order.forEach(([x, y], i) => (format |= read(x, y) << i));
  const [ecl, mask] =
    Object.keys(ECC)
      .flatMap((level) => [0, 1, 2, 3, 4, 5, 6, 7].map((m) => [level, m]))
      .find(([level, m]) => formatBits(level, m) === format) ?? [];
  if (ecl === undefined) throw new Error("Unreadable format information");
  const symbol = new Symbol(version);
  symbol.drawFunctionPatterns(ecl);
  const bits = [];
  for (const [x, y] of symbol.dataCoordinates())
    bits.push(modules[y][x] !== MASKS[mask](x, y) ? 1 : 0);
  const raw = Math.floor(rawDataModules(version) / 8);
  const codewords = [];
  for (let i = 0; i < raw; i++)
    codewords.push(bits.slice(i * 8, i * 8 + 8).reduce((byte, b) => (byte << 1) | b, 0));
  const blockCount = ECC[ecl].blocks[version - 1];
  const eccLength = ECC[ecl].perBlock[version - 1];
  const shortBlocks = blockCount - (raw % blockCount);
  const shortLength = Math.floor(raw / blockCount);
  const blocks = Array.from(
    { length: blockCount },
    (_, j) => new Array(shortLength + (j < shortBlocks ? 0 : 1)),
  );
  let k = 0;
  for (let i = 0; i <= shortLength; i++)
    blocks.forEach((block, j) => {
      const dataLength = shortLength - eccLength;
      if (i === dataLength && j < shortBlocks) return;
      const index = j < shortBlocks && i > dataLength ? i - 1 : i;
      block[index] = codewords[k++];
    });
  const data = [];
  for (const block of blocks) {
    let alpha = 1;
    for (let s = 0; s < eccLength; s++) {
      const syndrome = block.reduce((acc, byte) => gfMultiply(acc, alpha) ^ byte, 0);
      if (syndrome !== 0) throw new Error("Reed–Solomon syndrome is not zero");
      alpha = gfMultiply(alpha, 2);
    }
    data.push(...block.slice(0, block.length - eccLength));
  }
  const stream = data.flatMap((byte) => [7, 6, 5, 4, 3, 2, 1, 0].map((i) => (byte >>> i) & 1));
  const take = (n) => stream.splice(0, n).reduce((value, b) => (value << 1) | b, 0);
  if (take(4) !== 0b0100) throw new Error("Not a byte-mode symbol");
  const length = take(version <= 9 ? 8 : 16);
  return {
    text: new TextDecoder().decode(new Uint8Array(Array.from({ length }, () => take(8)))),
    ecl,
    mask,
  };
};

export const selfTest = () => {
  // Reed–Solomon vector for "HELLO WORLD", 1-M (thonky.com QR tutorial).
  const ecc = rsRemainder(
    [32, 91, 11, 120, 209, 114, 220, 77, 67, 64, 236, 17, 236, 17, 236, 17],
    10,
  );
  if (ecc.join() !== "196,35,39,119,235,215,231,226,93,23") throw new Error("RS vector mismatch");
  // Format strings from the ISO table: M/mask 0, Q/mask 0, L/mask 4.
  const expected = { M0: 0b101010000010010, Q0: 0b011010101011111, L4: 0b110011000101111 };
  for (const [key, value] of Object.entries(expected))
    if (formatBits(key[0], Number(key[1])) !== value)
      throw new Error(`Format bits ${key} mismatch`);
  if (versionBits(7) !== 0b000111110010010100) throw new Error("Version 7 bits mismatch");
  if (alignmentPositions(10).join() !== "6,28,50") throw new Error("Alignment positions mismatch");
  for (const ecl of Object.keys(ECC))
    for (const text of [
      "https://example.pl",
      "https://www.hydro-instalacje.pl/kontakt",
      "x".repeat(100),
    ]) {
      const { modules } = encode(text, ecl);
      const decoded = decode(modules);
      if (decoded.text !== text || decoded.ecl !== ecl)
        throw new Error(`Round trip failed (${ecl})`);
    }
};
