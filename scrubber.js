// scrubber.js - Text Cleaning Functionality
const characters = require('./characters.js');

/**
 * Clean text according to provided settings
 * @param {string} text - The text to clean
 * @param {Object} settings - Object containing boolean settings
 * @returns {string} - The cleaned text
 */
function cleanText(text, settings) {
    let cleanedText = text;
    
    if (settings.normalizeCharacters) {
        cleanedText = normalizeCharacters(cleanedText);
    }
    
    // Statistical watermarks functionality will be implemented later

    return cleanedText;
}

/**
 * Normalize Unicode characters to their standard equivalents
 * @param {string} text - Input text
 * @returns {string} - Text with normalized characters
 */
function normalizeCharacters(text) {
    let result = text;
    
    // Remove invisible Unicode characters
    characters.invisibleUnicodeCharacters.forEach(char => {
        result = result.split(char).join('');
    });

    // Replace non-ASCII characters with their ASCII equivalents
    Object.entries(characters.nonAsciiToAsciiMap).forEach(([unicodeChar, replacement]) => {
        result = result.split(unicodeChar).join(replacement);
    });
    
    return result;
}

module.exports = {
    cleanText
};