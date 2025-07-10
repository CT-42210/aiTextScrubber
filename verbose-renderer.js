// verbose-renderer.js - Renderer process for the verbose details window
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
 * Render the verbose data in the window
 * @param {Object} data - Verbose data including details, original text, and cleaned text
 */
function renderVerboseData(data) {
    // Clear any existing content
    contentElement.innerHTML = '';

    // Set timestamp
    timestampElement.textContent = new Date().toLocaleTimeString();

    // Add the invisible characters section
    const invisibleSection = createInvisibleCharactersSection(data.details.invisibleCharacters);
    contentElement.appendChild(invisibleSection);

    // Add the replaced characters section
    const replacedSection = createReplacedCharactersSection(data.details.replacedCharacters);
    contentElement.appendChild(replacedSection);

    // Add the text preview section
    const previewSection = createTextPreviewSection(data.originalText, data.cleanedText, data.details);
    contentElement.appendChild(previewSection);
}

/**
 * Create the section for invisible characters
 */
function createInvisibleCharactersSection(invisibleCharacters) {
    const section = document.createElement('div');
    section.className = 'verbose-section';

    const title = document.createElement('h3');
    title.textContent = 'Invisible Characters Removed';
    section.appendChild(title);

    if (invisibleCharacters.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No invisible characters found in the text.';
        section.appendChild(emptyMessage);
        return section;
    }

    const table = document.createElement('table');
    table.className = 'verbose-table';

    // Create header row
    const headerRow = document.createElement('tr');
    ['Unicode', 'Position', 'Description'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add data rows
    invisibleCharacters.forEach(char => {
        const row = document.createElement('tr');

        const unicodeCell = document.createElement('td');
        unicodeCell.textContent = char.unicodeValue;
        row.appendChild(unicodeCell);

        const positionCell = document.createElement('td');
        positionCell.textContent = char.position;
        row.appendChild(positionCell);

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = getUnicodeDescription(char.unicodeValue);
        row.appendChild(descriptionCell);

        table.appendChild(row);
    });

    section.appendChild(table);

    const summary = document.createElement('p');
    summary.textContent = `Total invisible characters removed: ${invisibleCharacters.length}`;
    section.appendChild(summary);

    return section;
}

/**
 * Create the section for replaced characters
 */
function createReplacedCharactersSection(replacedCharacters) {
    const section = document.createElement('div');
    section.className = 'verbose-section';

    const title = document.createElement('h3');
    title.textContent = 'Characters Replaced';
    section.appendChild(title);

    if (replacedCharacters.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'No characters were replaced in the text.';
        section.appendChild(emptyMessage);
        return section;
    }

    const table = document.createElement('table');
    table.className = 'verbose-table';

    // Create header row
    const headerRow = document.createElement('tr');
    ['Unicode', 'Original', 'Replacement', 'Position', 'Description'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Add data rows
    replacedCharacters.forEach(char => {
        const row = document.createElement('tr');

        const unicodeCell = document.createElement('td');
        unicodeCell.textContent = char.unicodeValue;
        row.appendChild(unicodeCell);

        const originalCell = document.createElement('td');
        originalCell.textContent = char.original;
        row.appendChild(originalCell);

        const replacementCell = document.createElement('td');
        replacementCell.textContent = char.replacement;
        row.appendChild(replacementCell);

        const positionCell = document.createElement('td');
        positionCell.textContent = char.position;
        row.appendChild(positionCell);

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = getUnicodeDescription(char.unicodeValue);
        row.appendChild(descriptionCell);

        table.appendChild(row);
    });

    section.appendChild(table);

    const summary = document.createElement('p');
    summary.textContent = `Total characters replaced: ${replacedCharacters.length}`;
    section.appendChild(summary);

    return section;
}

/**
 * Create the text preview section with visual indicators
 */
function createTextPreviewSection(originalText, cleanedText, verboseDetails) {
    const section = document.createElement('div');
    section.className = 'verbose-section';

    const title = document.createElement('h3');
    title.textContent = 'Text Preview with Changes';
    section.appendChild(title);

    const description = document.createElement('p');
    description.textContent = 'The text below shows the cleaning changes with visual indicators:';
    description.innerHTML += '<br>• Red tags show where invisible characters were removed';
    description.innerHTML += '<br>• Green underlined text shows replaced characters (hover to see original)';
    description.innerHTML += '<br>• Yellow highlights show potential AI-generated content';
    section.appendChild(description);

    // Add tabs for original and cleaned text
    const tabContainer = document.createElement('div');
    tabContainer.className = 'tab-container';

    const cleanedTab = document.createElement('button');
    cleanedTab.className = 'tab-button active';
    cleanedTab.textContent = 'Cleaned Text';

    const originalTab = document.createElement('button');
    originalTab.className = 'tab-button';
    originalTab.textContent = 'Original Text';

    tabContainer.appendChild(cleanedTab);
    tabContainer.appendChild(originalTab);
    section.appendChild(tabContainer);

    // Create preview containers
    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-container';

    const cleanedPreview = document.createElement('div');
    cleanedPreview.className = 'verbose-text-preview active';

    const originalPreview = document.createElement('div');
    originalPreview.className = 'verbose-text-preview';
    originalPreview.style.display = 'none';

    // Set original text
    originalPreview.textContent = originalText;

    // Create a visual representation of the cleaned text with all changes marked
    let visualText = cleanedText;

    // Mark replaced characters (from end to beginning to preserve positions)
    const sortedReplacements = [...verboseDetails.replacedCharacters].sort((a, b) => b.position - a.position);
    sortedReplacements.forEach(char => {
        const before = visualText.substring(0, char.position);
        const after = visualText.substring(char.position + char.replacement.length);

        const replacedSpan = `<span class="replaced-char" data-original="${char.unicodeValue}">${char.replacement}</span>`;
        visualText = before + replacedSpan + after;
    });

    // Mark invisible characters
    const sortedInvisible = [...verboseDetails.invisibleCharacters].sort((a, b) => b.position - a.position);
    sortedInvisible.forEach(char => {
        const before = visualText.substring(0, char.position);
        const after = visualText.substring(char.position);

        const tag = `<span class="invisible-tag">${char.unicodeValue}</span>`;
        visualText = before + tag + after;
    });

    cleanedPreview.innerHTML = visualText;

    // Add tab switching functionality
    cleanedTab.addEventListener('click', () => {
        cleanedTab.classList.add('active');
        originalTab.classList.remove('active');
        cleanedPreview.style.display = 'block';
        originalPreview.style.display = 'none';
    });

    originalTab.addEventListener('click', () => {
        originalTab.classList.add('active');
        cleanedTab.classList.remove('active');
        originalPreview.style.display = 'block';
        cleanedPreview.style.display = 'none';
    });

    previewContainer.appendChild(cleanedPreview);
    previewContainer.appendChild(originalPreview);
    section.appendChild(previewContainer);

    return section;
}

/**
 * Get a description for a Unicode value
 */
function getUnicodeDescription(unicodeValue) {
    // This is a simplified mapping - could be expanded
    const descriptions = {
        'U+000A': 'Line Feed (LF)',
        'U+200B': 'Zero Width Space',
        'U+200C': 'Zero Width Non-Joiner',
        'U+200D': 'Zero Width Joiner',
        'U+200E': 'Left-to-Right Mark',
        'U+200F': 'Right-to-Left Mark',
        'U+202A': 'Left-to-Right Embedding',
        'U+202B': 'Right-to-Left Embedding',
        'U+202C': 'Pop Directional Formatting',
        'U+202D': 'Left-to-Right Override',
        'U+202E': 'Right-to-Left Override',
        'U+FEFF': 'Zero Width No-Break Space (BOM)',
        'U+2060': 'Word Joiner',
        'U+2061': 'Function Application',
        'U+2062': 'Invisible Times',
        'U+2063': 'Invisible Separator',
        'U+2064': 'Invisible Plus',
        'U+2800': 'Braille Pattern Blank',
        'U+2018': 'Left Single Quote',
        'U+2019': 'Right Single Quote',
        'U+201C': 'Left Double Quote',
        'U+201D': 'Right Double Quote'
    };

    return descriptions[unicodeValue] || 'Unknown Character';
}
