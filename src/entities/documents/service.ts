export async function validateDocument(file: File): Promise<void> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    throw new Error('Scegli un file JPG, PNG o WEBP.');
  if (file.size > 20 * 1024 * 1024) throw new Error('Il file supera il limite di 20 MB.');
  if (!file.size) throw new Error('Il file è vuoto. Scegli un’altra immagine.');
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error('Impossibile leggere l’immagine. Scegli un altro file.');
  bitmap.close();
}
