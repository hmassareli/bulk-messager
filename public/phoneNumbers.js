/**
 * Formats an array of phone numbers, ensuring they have the country code '55' and removing non-digit characters.
 *
 * @param {string[]} numbers - Array of phone numbers to be formatted.
 * @returns {string[]} - Array of formatted phone numbers.
 */

// export const getOnlyTextNodes = (element) => {
//   let resultText = "";
//   for (let i = 0; i < element.childNodes.length; i++) {
//     let node = element.childNodes[i];
//     // If the node is a text node, append its content
//     if (node.nodeType === 3) {
//       // 3 is the node type for text nodes
//       resultText += node.nodeValue;
//       //remove the text node
//       // node.remove();
//     } else if (!node?.classList.contains("numbertag")) {
//       resultText += node.textContent;
//       console.log(node + " " + resultText);
//       // node.remove();
//     }
//   }
//   // if (element.textContent == "" && element.childNodes[0]) {
//   //   element.childNodes[0].remove();
//   // }
//   return resultText;
// };
export const formatNumbers = (numbers) => {
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
 * @returns {string[]} - Array of unique phone numbers.
 */
const removeRepeatedNumbers = (numbers, existingNumbers) => {
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
export const divideNumbers = (stringNumbers) => {
  return stringNumbers.split("\n").join(" ").split(",").join(" ").split(" ");
};

/**
 * Gets formatted phone numbers from a string, handling division and removing duplicates.
 *
 * @param {string} numbersString - String containing phone numbers.
 * @param {'comma' | 'lineBreak'} typeOfDivider - Type of divider used in the string ('comma' or 'lineBreak').
 * @returns {{ numbers: string[]; invalidNumbersLength: number }} - Object containing formatted numbers and the count of invalid numbers' length.
 */
export const getFormattedNumbers = (numbersString, existingNumbers) => {
  const cleanNumbers = numbersString.replace(/\D+/g, " ");
  if (!parseInt(cleanNumbers) || !cleanNumbers)
    return {
      numbers: [],
      invalidNumbersLength: 0,
    };
  const numbersArray = divideNumbers(cleanNumbers);
  const result = removeRepeatedNumbers(
    formatNumbers(numbersArray),
    existingNumbers
  );
  return {
    numbers: result,
    invalidNumbersLength: 0,
  };
};
