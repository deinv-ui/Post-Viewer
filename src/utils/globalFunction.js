export function getImageDimensions(id) {
  const width = 400;
  const height = 350 + (id % 4) * 50; 
  return { width, height };
}
