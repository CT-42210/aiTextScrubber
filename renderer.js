// renderer.js - Frontend Logic
const { clipboard, ipcRenderer } = require('electron');
const config = require('./config.js');
const scrubber = require('./scrubber.js');
const verbose = require('./verbose.js');
const { initGlassmorphismUI, showButtonFeedback: showFeedback } = require('./ui.js');

// DOM Elements
const cleanButton = document.getElementById('clean-button');

// Global variables
let settings = {};

// Initialize the app
function init() {
    loadSettings();
    setupEventListeners();
    initGlassmorphismUI();
    ipcRenderer.send('ui-ready');
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

// Show visual feedback on clean button
function showButtonFeedback(type = 'success') {
    showFeedback(cleanButton, type);
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
                showButtonFeedback('success');

                // Show the verbose popup with details
                verbose.showVerbosePopup(result.details, originalText, result.text);
            } else {
                // In normal mode, result is just the cleaned text
                clipboard.writeText(result);
                showButtonFeedback('success');
            }
        } else {
            showButtonFeedback('warning');
        }
    });
}


// Initialize the app
document.addEventListener('DOMContentLoaded', init);