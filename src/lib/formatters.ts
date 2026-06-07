/**
 * Utility functions for formatting user input
 */

// Common acronyms that should be fully capitalized
const ACRONYMS = ['DME', 'LLC', 'INC', 'LTD', 'PLLC', 'PC', 'LLP', 'MD', 'DO', 'RN', 'LPN', 'NP', 'PA', 'PT', 'OT', 'ST', 'USA', 'US'];

/**
 * Converts a string to Title Case with special handling for acronyms
 * @param text - The text to format
 * @returns The formatted text in Title Case
 */
export function toTitleCase(text: string): string {
  if (!text) return text;

  return text
    .trim()
    .split(' ')
    .map(word => {
      // Check if the word is a known acronym (case-insensitive)
      const upperWord = word.toUpperCase();
      if (ACRONYMS.includes(upperWord)) {
        return upperWord;
      }

      // Handle hyphenated words (e.g., "Mary-Jane" or "Smith-Jones")
      if (word.includes('-')) {
        return word
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join('-');
      }

      // Handle apostrophes (e.g., "O'Connor")
      if (word.includes("'")) {
        return word
          .split("'")
          .map((part, index) => {
            if (index === 0) {
              return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
            }
            // After apostrophe, capitalize if it's more than one letter
            return part.length > 1
              ? part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
              : part.toLowerCase();
          })
          .join("'");
      }

      // Standard title case: capitalize first letter, lowercase the rest
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Formats a person's name to Title Case
 * @param name - The name to format
 * @returns The formatted name
 */
export function formatPersonName(name: string): string {
  return toTitleCase(name);
}

/**
 * Formats a company name to Title Case with acronym support
 * @param companyName - The company name to format
 * @returns The formatted company name
 */
export function formatCompanyName(companyName: string): string {
  return toTitleCase(companyName);
}
