export const generateUniqueColorCodeById = (id: string): string => {
  const colorPalette = [
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#800000', // Maroon
    '#008000', // Dark Green
    '#000080', // Navy
    '#808000', // Olive
    '#800080', // Purple
    '#008080', // Teal
    '#ff8000', // Orange
    '#ff0080', // Pink
    '#80ff00', // Lime
    '#00ff80', // Sea Green
    '#8000ff', // Indigo
    '#ff80ff', // Lavender
    '#80ffff', // Light Cyan
    '#808080' // Gray
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

  const hash = hashString(id);
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};
