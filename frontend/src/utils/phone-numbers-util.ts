export const formatNumber = (number: string) => {
  const hasCountryCode = number.slice(0, 2) === "55";

  if (hasCountryCode) return number;

  return `55${number}`;
};

const nonRepeatableOrEmptyConcat = (
  numbers: string[],
  ...numbersToAdd: string[][]
) => {
  const all = numbers.concat(...numbersToAdd).filter((n) => !!n);

  return [...new Set(all)];
};

const splitRegex = /[ ,\n\t\r]+/g;
const getOnlyDigits = (number: string) => number.replace(/\D+/g, "");
const emptyFilter = (number: string) => number.length > 0;
export const sanitizeNumbersToArray = (numbersString: string): string[] => {
  return numbersString
    .trim()
    .split(splitRegex)
    .map(getOnlyDigits)
    .filter(emptyFilter)
    .map(formatNumber);
};

export const getFormattedNumbers = (
  numbersString: string,
  currentNumbers: string[]
) => {
  const sanitizedNumbers = sanitizeNumbersToArray(numbersString);
  const result = nonRepeatableOrEmptyConcat(currentNumbers, sanitizedNumbers);

  return result;
};
