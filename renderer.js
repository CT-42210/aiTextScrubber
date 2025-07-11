// renderer.js - Frontend Logic
const { clipboard } = require('electron');
const config = require('./config.js');
const scrubber = require('./scrubber.js');
const verbose = require('./verbose.js');

// DOM Elements
const cleanButton = document.getElementById('clean-button');

// Global variables
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

// Show visual feedback on clean button
function showButtonFeedback(type = 'success') {
    // Remove any existing animation classes
    cleanButton.classList.remove('success', 'warning', 'error');

    // Force a reflow to ensure the class removal takes effect
    cleanButton.offsetHeight;

    // Add the appropriate class
    cleanButton.classList.add(type);

    // Listen for animation end to properly clean up
    const handleAnimationEnd = () => {
        cleanButton.classList.remove('success', 'warning', 'error');
        cleanButton.removeEventListener('animationend', handleAnimationEnd);
    };

    cleanButton.addEventListener('animationend', handleAnimationEnd);

    // Fallback timeout in case animationend doesn't fire
    setTimeout(() => {
        cleanButton.classList.remove('success', 'warning', 'error');
        cleanButton.removeEventListener('animationend', handleAnimationEnd);
    }, 1100);
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

// Add this to your renderer.js file or include it as a separate script

// Handle clicking on the checkbox container for better UX
document.addEventListener('DOMContentLoaded', function() {
    // Get all checkbox containers
    const checkboxContainers = document.querySelectorAll('.checkbox-container');

    checkboxContainers.forEach(container => {
        // Make the entire container clickable, but only for the settings area
        container.addEventListener('click', function(e) {
            // Don't toggle if clicking on the info icon or label children
            if (e.target.closest('.info-icon') || e.target.closest('label')) {
                return;
            }
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                // Trigger change event for any listeners
                checkbox.dispatchEvent(new Event('change'));
            }
        });

        // Add hover effect to container
        container.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });

    // Handle info icon click popups
    let currentPopup = null;

    function createInfoPopup(text, iconElement) {
        // Remove any existing popup
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
        }

        const popup = document.createElement('div');
        popup.className = 'info-popup';
        popup.textContent = text;

        // Position popup off-screen initially to get accurate measurements
        popup.style.position = 'fixed';
        popup.style.top = '-9999px';
        popup.style.left = '-9999px';
        popup.style.visibility = 'hidden';

        document.body.appendChild(popup);

        // Force a reflow to ensure the popup is rendered
        popup.offsetHeight;

        // Now get accurate measurements
        const iconRect = iconElement.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();

        // Calculate centered position relative to the icon
        let top = iconRect.top - popupRect.height - 16; // 16px for arrow space
        let left = iconRect.left + (iconRect.width / 2) - (popupRect.width / 2);

        // Adjust if popup goes off screen
        const margin = 10;
        let isBelow = false;

        if (top < margin) {
            top = iconRect.bottom + 16; // Place below icon
            isBelow = true;
        }

        if (left < margin) {
            left = margin;
        } else if (left + popupRect.width > window.innerWidth - margin) {
            left = window.innerWidth - popupRect.width - margin;
        }

        // Apply the calculated position and make visible
        popup.style.top = top + 'px';
        popup.style.left = left + 'px';
        popup.style.visibility = 'visible';

        if (isBelow) {
            popup.classList.add('below');
        }

        // Calculate arrow position relative to icon center
        const iconCenterX = iconRect.left + (iconRect.width / 2);
        const popupLeft = parseFloat(popup.style.left);
        const arrowLeftOffset = iconCenterX - popupLeft;

        // Set custom CSS property for arrow positioning
        popup.style.setProperty('--arrow-left', arrowLeftOffset + 'px');

        // Show with animation
        requestAnimationFrame(() => {
            popup.classList.add('show');
        });

        return popup;
    }

    function closeInfoPopup() {
        if (currentPopup) {
            currentPopup.classList.remove('show');
            setTimeout(() => {
                if (currentPopup && currentPopup.parentNode) {
                    currentPopup.remove();
                    currentPopup = null;
                }
            }, 200);
        }
    }

    // Add click handlers for info icons
    const infoIcons = document.querySelectorAll('.info-icon');

    infoIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();

            const tooltipText = this.getAttribute('data-tooltip');
            if (tooltipText) {
                if (currentPopup) {
                    closeInfoPopup();
                } else {
                    currentPopup = createInfoPopup(tooltipText, this);
                }
            }
        });
    });

    // Close popup when clicking outside
    document.addEventListener('click', function(e) {
        if (currentPopup && !e.target.closest('.info-popup') && !e.target.closest('.info-icon')) {
            closeInfoPopup();
        }
    });

    // Close popup on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentPopup) {
            closeInfoPopup();
        }
    });

    // Optional: Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Remove any existing ripples
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            // Add animation if not already present
            if (!document.querySelector('style[data-ripple]')) {
                const style = document.createElement('style');
                style.setAttribute('data-ripple', '');
                style.textContent = `
                    @keyframes ripple {
                        to {
                            transform: scale(4);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// Initialize the app
document.addEventListener('DOMContentLoaded', init);