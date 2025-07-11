// verbose-renderer.js - Minimal renderer for showing only text changes
const { ipcRenderer } = require('electron');

// DOM Elements
const contentElement = document.getElementById('content');
const timestampElement = document.getElementById('timestamp');
const closeButton = document.getElementById('close-btn');

// Close button event handler
closeButton.addEventListener('click', () => {
    window.close();
});

// Listen for data from the main process
ipcRenderer.on('verbose-data', (event, data) => {
    renderVerboseData(data);
});

/**
 * Render only the text with changes highlighted
 * @param {Object} data - Verbose data including details, original text, and cleaned text
 */
function renderVerboseData(data) {
    // Clear any existing content
    contentElement.innerHTML = '';

    // Set timestamp
    timestampElement.textContent = new Date().toLocaleTimeString();

    // Create only the text preview with changes
    const previewSection = createMinimalTextPreview(data.originalText, data.cleanedText, data.details);
    contentElement.appendChild(previewSection);
}

/**
 * Create a minimal text preview showing only the changes
 */
function createMinimalTextPreview(originalText, cleanedText, verboseDetails) {
    const section = document.createElement('div');
    section.className = 'verbose-section';

    // We need to work with the original text and apply changes step by step
    // to maintain correct positioning
    let workingText = originalText;
    let allChanges = [];

    // Collect all changes with their original positions
    verboseDetails.replacedCharacters.forEach(char => {
        allChanges.push({
            originalPosition: char.position,
            type: 'replacement',
            original: char.original,
            replacement: char.replacement
        });
    });

    verboseDetails.invisibleCharacters.forEach(char => {
        allChanges.push({
            originalPosition: char.position,
            type: 'invisible',
            unicodeValue: char.unicodeValue,
            original: char.character
        });
    });

    // Sort changes by original position (from end to beginning to preserve positions)
    allChanges.sort((a, b) => b.originalPosition - a.originalPosition);

    // Apply changes from end to beginning to maintain position accuracy
    allChanges.forEach(change => {
        if (change.type === 'replacement') {
            // Replace the character in the working text
            const before = workingText.substring(0, change.originalPosition);
            const after = workingText.substring(change.originalPosition + change.original.length);

            const highlightedText = `<span class="replaced-char" data-original="${change.original}" title="Original: ${change.original} → ${change.replacement}">${change.replacement}</span>`;
            workingText = before + highlightedText + after;

        } else if (change.type === 'invisible') {
            // Remove the invisible character and add a marker
            const before = workingText.substring(0, change.originalPosition);
            const after = workingText.substring(change.originalPosition + change.original.length);

            const invisibleTag = `<span class="invisible-tag" title="Removed invisible character: ${change.unicodeValue}">⌐</span>`;
            workingText = before + invisibleTag + after;
        }
    });

    // Create the text preview container
    const textPreview = document.createElement('div');
    textPreview.className = 'verbose-text-preview minimal';
    textPreview.innerHTML = workingText;

    section.appendChild(textPreview);

    return section;
}
