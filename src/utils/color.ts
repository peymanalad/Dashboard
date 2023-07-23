export const generateUniqueColorCodeById = (id: string): string => {
  const colorPalette = [
    '#ff000035', // Red
    '#00ff0035', // Green
    '#0000ff35', // Blue
    '#ffff0035', // Yellow
    '#ff00ff35', // Magenta
    '#00ffff35', // Cyan
    '#80000035', // Maroon
    '#00800035', // Dark Green
    '#00008035', // Navy
    '#80800035', // Olive
    '#80008035', // Purple
    '#00808035', // Teal
    '#ff800035', // Orange
    '#ff008035', // Pink
    '#80ff0035', // Lime
    '#00ff8035', // Sea Green
    '#8000ff35', // Indigo
    '#ff80ff35', // Lavender
    '#80ffff35', // Light Cyan
    '#80808035' // Gray
  ];

  // Simple hash function to generate a unique number based on the id
  function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash += char;
    }
    return hash;
  }

  const hash = hashString(`${id}`);
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};
