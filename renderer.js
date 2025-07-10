// renderer.js - Frontend Logic
const { ipcRenderer, clipboard } = require('electron');
const config = require('./config.js');
const scrubber = require('./scrubber.js');
const verbose = require('./verbose.js');

// DOM Elements
const cleanButton = document.getElementById('clean-button');
const importButton = document.getElementById('import-button');
const exportButton = document.getElementById('export-button');
const statusMessage = document.getElementById('status-message');

// Global variables
let currentFile = null;
let settings = {};

// Initialize the app
function init() {
    loadSettings();
    setupEventListeners();
}

// Load settings from config
function loadSettings() {
    // Initialize settings object based on checkboxes in the DOM
    config.settings.forEach(setting => {
        const checkbox = document.getElementById(setting.id);
        if (checkbox) {
            // Set initial checkbox state based on default value
            checkbox.checked = setting.defaultValue;
            settings[setting.id] = checkbox.checked;
            
            // Add event listener
            checkbox.addEventListener('change', () => {
                settings[setting.id] = checkbox.checked;
            });
        }
    });
}

// Set up event listeners
function setupEventListeners() {
    // Clean button
    cleanButton.addEventListener('click', () => {
        const text = clipboard.readText();
        if (text) {
            // Store original text for verbose mode
            const originalText = text;

            // Process text based on settings
            const result = scrubber.cleanText(text, settings);

            if (settings.verboseMode) {
                // In verbose mode, result is an object with text and details
                clipboard.writeText(result.text);
                showStatus('Text cleaned and copied to clipboard!', 'success');

                // Show the verbose popup with details
                verbose.showVerbosePopup(result.details, originalText, result.text);
            } else {
                // In normal mode, result is just the cleaned text
                clipboard.writeText(result);
                showStatus('Text cleaned and copied to clipboard!', 'success');
            }
        } else {
            showStatus('Clipboard is empty!', 'warning');
        }
    });
    
    // Import button
    importButton.addEventListener('click', async () => {
        try {
            const result = await ipcRenderer.invoke('import-file');
            if (result) {
                currentFile = result;
                showStatus(`File loaded: ${result.filePath}`, 'success');
            }
        } catch (error) {
            showStatus(`Error importing file: ${error.message}`, 'danger');
        }
    });
    
    // Export button
    exportButton.addEventListener('click', async () => {
        if (!currentFile) {
            showStatus('No file loaded to export', 'warning');
            return;
        }
        
        try {
            const originalText = currentFile.content;
            const result = scrubber.cleanText(originalText, settings);

            if (settings.verboseMode) {
                await ipcRenderer.invoke('export-file', {
                    filePath: currentFile.filePath,
                    content: result.text
                });
                showStatus('File cleaned and saved!', 'success');

                // Show the verbose popup with details
                verbose.showVerbosePopup(result.details, originalText, result.text);
            } else {
                await ipcRenderer.invoke('export-file', {
                    filePath: currentFile.filePath,
                    content: result
                });
                showStatus('File cleaned and saved!', 'success');
            }
        } catch (error) {
            showStatus(`Error exporting file: ${error.message}`, 'danger');
        }
    });
}

// Show status message
function showStatus(message, type = 'primary') {
    statusMessage.textContent = message;
    statusMessage.className = `text-${type}`;
    
    // Clear after 3 seconds
    setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.className = '';
    }, 3000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);