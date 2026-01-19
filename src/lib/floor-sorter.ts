function getFloorNumber(floorName: string): number {
  const lowerCaseName = floorName.toLowerCase();
  if (lowerCaseName === 'térreo') {
    return 0;
  }
  const match = lowerCaseName.match(/-?\d+/);
  // Return a very low number if no number is found to sort it to the bottom
  return match ? parseInt(match[0], 10) : Number.MIN_SAFE_INTEGER;
}

export function sortFloors<T extends { name: string }>(floors: T[]): T[] {
  // Create a shallow copy to avoid mutating the original array directly
  const sortedFloors = [...floors];
  sortedFloors.sort((a, b) => {
    const floorA = getFloorNumber(a.name);
    const floorB = getFloorNumber(b.name);
    return floorB - floorA; // Sort descending
  });
  return sortedFloors;
} 