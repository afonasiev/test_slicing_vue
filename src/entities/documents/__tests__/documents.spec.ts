import { describe, it, expect } from 'vitest';
import { isValidIban, normalizeIban } from '../iban';
import { validateDocument } from '../service';
describe('local document validation', () => {
  it('normalizes IBAN input and detects checksum errors', () => {
    const valid = normalizeIban('it60 x054 2811 1010 0000 0123 456');
    expect(valid).toBe('IT60X0542811101000000123456');
    expect(isValidIban(valid)).toBe(true);
    expect(isValidIban('IT61X0542811101000000123456')).toBe(false);
    expect(isValidIban('IT00X000000000000000000000000')).toBe(false);
    expect(normalizeIban('IT' + '1'.repeat(40))).toHaveLength(27);
  });
  it('rejects unsupported, empty and oversized documents before decoding', async () => {
    await expect(
      validateDocument(new File(['data'], 'file.pdf', { type: 'application/pdf' })),
    ).rejects.toThrow('JPG');
    await expect(
      validateDocument(new File([], 'empty.png', { type: 'image/png' })),
    ).rejects.toThrow('vuoto');
    await expect(
      validateDocument(
        new File([new Uint8Array(20 * 1024 * 1024 + 1)], 'large.png', { type: 'image/png' }),
      ),
    ).rejects.toThrow('20 MB');
  });
});
