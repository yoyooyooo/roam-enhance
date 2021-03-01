export const testIfRoamDateAndConvert = (dateStr: string) => {
  try {
    return window.roam42.dateProcessing.testIfRoamDateAndConvert(dateStr);
  } catch {
    return false;
  }
};
