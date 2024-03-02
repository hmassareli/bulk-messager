/**
 * Formats an array of phone numbers, ensuring they have the country code '55' and removing non-digit characters.
 *
 * @param {string[]} numbers - Array of phone numbers to be formatted.
 * @returns {string[]} - Array of formatted phone numbers.
 */
export const formatNumbers = (numbers: string[]): string[] => {
  // Remove non-digit characters
  const cleanNumbers = numbers
    .map((n) => {
      return n.replace(/\D/g, "");
    })
    .filter((n) => n);

  // Add '55' country code if not present
  const numbersWithCountryCode = cleanNumbers.map((n) => {
    if (n.slice(0, 2) === "55") {
      return n;
    }
    return `55${n}`;
  });

  return numbersWithCountryCode;
};

/**
 * Removes repeated numbers from an array.
 *
 * @param {string[]} numbers - Array of phone numbers.
 * @returns {string[]} existingNumbers - Array of unique phone numbers.
 */
const removeRepeatedNumbers = (
  numbers: string[],
  existingNumbers: string[]
): string[] => {
  const numbersWithoutRepeated = numbers.filter((number) => {
    return !existingNumbers.includes(number);
  });

  const uniqueNumbers = [...new Set(numbersWithoutRepeated)];

  return uniqueNumbers;
};

/**
 * Divides a string of numbers based on the specified divider.
 *
 * @param {string} stringNumbers - String containing numbers separated by a specified divider.
 * @param {'comma' | 'lineBreak'} typeOfDivider - Type of divider used in the string ('comma' or 'lineBreak').
 * @returns {string[]} - Array of divided numbers.
 */
export const divideNumbers = (stringNumbers: string): string[] => {
  return stringNumbers.split("\n").join(" ").split(",").join(" ").split(" ");
};

/**
 * Gets formatted phone numbers from a string, handling division and removing duplicates.
 *
 * @param {string} numbersString - String containing phone numbers.
 * @param {'comma' | 'lineBreak'} typeOfDivider - Type of divider used in the string ('comma' or 'lineBreak').
 * @returns {string[]} existingNumbers - Object containing formatted numbers and the count of invalid numbers' length.
 */
export const getFormattedNumbers = (
  numbersString: string,
  existingNumbers: string[]
): string[] => {
  const cleanNumbers = numbersString.replace(/\D+/g, " ");
  const isCleanNumbersEmpty = cleanNumbers.trim() === "";

  if (isCleanNumbersEmpty) return [];

  const numbersArray = divideNumbers(cleanNumbers);

  const result = removeRepeatedNumbers(
    formatNumbers(numbersArray),
    existingNumbers
  );

  return result;
};
