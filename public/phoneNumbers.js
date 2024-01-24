/**
 * Formats an array of phone numbers, ensuring they have the country code '55' and removing non-digit characters.
 *
 * @param {string[]} numbers - Array of phone numbers to be formatted.
 * @returns {string[]} - Array of formatted phone numbers.
 */
export const formatNumbers = (numbers) => {
  // Remove non-digit characters
  const cleanNumbers = numbers.map((n) => {
    return n.replace(/\D/g, '');
  });

  // Add '55' country code if not present
  const numbersWithCountryCode = cleanNumbers.map((n) => {
    if (n.slice(0, 2) === '55') {
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
 * @returns {string[]} - Array of unique phone numbers.
 */
const removeRepeatedNumbers = (numbers) => {
  const uniqueNumbers = [...new Set(numbers)];
  return uniqueNumbers;
};

/**
 * Divides a string of numbers based on the specified divider.
 *
 * @param {string} stringNumbers - String containing numbers separated by a specified divider.
 * @param {'comma' | 'lineBreak'} typeOfDivider - Type of divider used in the string ('comma' or 'lineBreak').
 * @returns {string[]} - Array of divided numbers.
 */
export const divideNumbers = (stringNumbers, typeOfDivider) => {
  if (typeOfDivider === 'lineBreak') {
    return stringNumbers.split('\n');
  }
  return stringNumbers.split(',');
};

/**
 * Gets formatted phone numbers from a string, handling division and removing duplicates.
 *
 * @param {string} numbersString - String containing phone numbers.
 * @param {'comma' | 'lineBreak'} typeOfDivider - Type of divider used in the string ('comma' or 'lineBreak').
 * @returns {{ numbers: string[]; invalidNumbersLength: number }} - Object containing formatted numbers and the count of invalid numbers' length.
 */
export const getFormattedNumbers = (numbersString, typeOfDivider) => {
  const numbersArray = divideNumbers(numbersString, typeOfDivider);
  const result = removeRepeatedNumbers(formatNumbers(numbersArray));
  return {
    numbers: result,
    invalidNumbersLength: 0,
  };
};