export type InputMask = 'iban' | 'integer' | 'alphanumeric';

export function formatInput(value: string, mask?: InputMask): string {
  if (mask === 'alphanumeric')
    return value
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 30);
  if (mask === 'integer') return value.replace(/[^0-9]/g, '');
  if (mask === 'iban') {
    const compact = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const limited = compact.slice(0, compact.startsWith('IT') ? 27 : 34);
    return limited.match(/.{1,4}/g)?.join(' ') ?? '';
  }
  return value;
}

/** Reformat the DOM even when filtering leaves the model unchanged. */
export function maskInput(input: HTMLInputElement, mask?: InputMask): string {
  const position = input.selectionStart;
  const prefix = input.value.slice(0, position ?? input.value.length);
  const formatted = formatInput(input.value, mask);
  const caret = formatInput(prefix, mask).length;
  input.value = formatted;
  if (mask && position !== null) input.setSelectionRange(caret, caret);
  return formatted;
}
