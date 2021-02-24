export const testIfRoamDateAndConvert = (dateStr) => {
  try {
    return roam42.dateProcessing.testIfRoamDateAndConvert(dateStr);
  } catch {
    return false;
  }
};
