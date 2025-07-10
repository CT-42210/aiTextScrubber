// verbose.js - Verbose mode popup functionality
const { ipcRenderer } = require('electron');

/**
 * Show verbose details in a separate window
 * @param {Object} verboseDetails - Details about the changes made during cleaning
 * @param {string} originalText - The original text before cleaning
 * @param {string} cleanedText - The text after cleaning
 */
function showVerbosePopup(verboseDetails, originalText, cleanedText) {
    // Prepare data to send to the verbose window
    const verboseData = {
        details: verboseDetails,
        originalText: originalText,
        cleanedText: cleanedText,
        timestamp: new Date().toISOString()
    };

    // Send request to main process to create verbose window
    ipcRenderer.invoke('show-verbose-window', verboseData);
}

module.exports = {
    showVerbosePopup
};
