export const getProfileColor = (initials) => {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Map hash to hue in blue-green range (160-200)
  const hue = 160 + (hash % 41); // 160-200
  const saturation = 50; // moderate saturation
  const lightness = 60;  // moderate lightness
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
