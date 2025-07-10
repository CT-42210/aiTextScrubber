// scrubber.js - Text Cleaning Functionality
const characters = require('./characters.js');

/**
 * Clean text according to provided settings
 * @param {string} text - The text to clean
 * @param {Object} settings - Object containing boolean settings
 * @returns {Object} - The cleaned text and details of changes if verbose mode is enabled
 */
function cleanText(text, settings) {
    let cleanedText = text;
    let verboseDetails = {
        invisibleCharacters: [],
        replacedCharacters: []
    };

    // First, normalize characters if enabled
    if (settings.normalizeCharacters) {
        const result = normalizeCharacters(cleanedText, settings.verboseMode);
        cleanedText = result.text;
        if (settings.verboseMode) {
            verboseDetails.invisibleCharacters = result.invisibleCharacters;
            verboseDetails.replacedCharacters = result.replacedCharacters;
        }
    }

    return settings.verboseMode ?
        { text: cleanedText, details: verboseDetails } :
        cleanedText;
}

/**
 * Normalize Unicode characters to their standard equivalents
 * @param {string} text - Input text
 * @param {boolean} trackChanges - Whether to track changes for verbose mode
 * @returns {Object} - Text with normalized characters and change details if tracking
 */
function normalizeCharacters(text, trackChanges = false) {
    let result = text;
    let invisibleCharacters = [];
    let replacedCharacters = [];

    // Remove invisible Unicode characters
    characters.invisibleUnicodeCharacters.forEach(char => {
        if (trackChanges) {
            let index = result.indexOf(char);
            while (index !== -1) {
                invisibleCharacters.push({
                    character: char,
                    position: index,
                    unicodeValue: `U+${char.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()}`
                });
                index = result.indexOf(char, index + 1);
            }
        }
        result = result.split(char).join('');
    });

    // Replace non-ASCII characters with their ASCII equivalents
    if (trackChanges) {
        Object.entries(characters.nonAsciiToAsciiMap).forEach(([unicodeChar, replacement]) => {
            let index = result.indexOf(unicodeChar);
            while (index !== -1) {
                replacedCharacters.push({
                    original: unicodeChar,
                    replacement: replacement,
                    position: index,
                    unicodeValue: `U+${unicodeChar.charCodeAt(0).toString(16).padStart(4, '0').toUpperCase()}`
                });
                index = result.indexOf(unicodeChar, index + 1);
            }
            result = result.split(unicodeChar).join(replacement);
        });
    } else {
        Object.entries(characters.nonAsciiToAsciiMap).forEach(([unicodeChar, replacement]) => {
            result = result.split(unicodeChar).join(replacement);
        });
    }

    return trackChanges ?
        { text: result, invisibleCharacters, replacedCharacters } :
        { text: result };
}


module.exports = {
    cleanText
};