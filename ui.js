// ui.js - Cosmetic and Glassmorphism UI Logic
const { ipcRenderer } = require('electron');

/**
 * Darkens a hex color by a given percentage.
 * @param {string} hex - The hex color string (e.g., '#RRGGBB').
 * @param {number} percent - The percentage to darken the color by.
 * @returns {string} The darkened hex color string.
 */
function darkenColor(hex, percent) {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = parseInt(r * (100 - percent) / 100);
    g = parseInt(g * (100 - percent) / 100);
    b = parseInt(b * (100 - percent) / 100);

    r = (r < 0) ? 0 : r;
    g = (g < 0) ? 0 : g;
    b = (b < 0) ? 0 : b;

    const toHex = (c) => ('0' + c.toString(16)).slice(-2);

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Shows visual feedback on a button.
 * @param {HTMLElement} button - The button element to animate.
 * @param {string} type - The type of feedback ('success', 'warning', 'error').
 */
function showButtonFeedback(button, type = 'success') {
    if (!button) return;
    // Remove any existing animation classes
    button.classList.remove('success', 'warning', 'error');

    // Force a reflow to ensure the class removal takes effect
    button.offsetHeight;

    // Add the appropriate class
    button.classList.add(type);

    // Listen for animation end to properly clean up
    const handleAnimationEnd = () => {
        button.classList.remove('success', 'warning', 'error');
        button.removeEventListener('animationend', handleAnimationEnd);
    };

    button.addEventListener('animationend', handleAnimationEnd);

    // Fallback timeout in case animationend doesn't fire
    setTimeout(() => {
        button.classList.remove('success', 'warning', 'error');
        button.removeEventListener('animationend', handleAnimationEnd);
    }, 1100);
}

/**
 * Initializes all glassmorphism and cosmetic UI features.
 */
function initGlassmorphismUI() {
    // Set system accent color for gradients
    ipcRenderer.on('system-accent-color', (event, accentColor) => {
        const darkAccentColor = darkenColor(accentColor, 50);
        document.documentElement.style.setProperty('--system-accent-color', accentColor);
        document.documentElement.style.setProperty('--system-accent-color-dark', darkAccentColor);
    });

    // Handle clicking on the checkbox container for better UX
    const checkboxContainers = document.querySelectorAll('.checkbox-container');
    checkboxContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            if (e.target.closest('.info-icon') || e.target.closest('label')) {
                return;
            }
            const checkbox = this.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
        container.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });

    // Handle info icon click popups
    let currentPopup = null;

    function createInfoPopup(text, iconElement) {
        if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
        }

        const popup = document.createElement('div');
        popup.className = 'info-popup';
        popup.textContent = text;
        document.body.appendChild(popup);

        const iconRect = iconElement.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();

        let top = iconRect.top - popupRect.height - 16;
        let left = iconRect.left + (iconRect.width / 2) - (popupRect.width / 2);

        const margin = 10;
        let isBelow = false;
        if (top < margin) {
            top = iconRect.bottom + 16;
            isBelow = true;
        }
        if (left < margin) left = margin;
        if (left + popupRect.width > window.innerWidth - margin) {
            left = window.innerWidth - popupRect.width - margin;
        }

        popup.style.top = `${top}px`;
        popup.style.left = `${left}px`;
        if (isBelow) popup.classList.add('below');

        const iconCenterX = iconRect.left + (iconRect.width / 2);
        const arrowLeftOffset = iconCenterX - left;
        popup.style.setProperty('--arrow-left', `${arrowLeftOffset}px`);

        requestAnimationFrame(() => popup.classList.add('show'));
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

    const infoIcons = document.querySelectorAll('.info-icon');
    infoIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            const tooltipText = this.getAttribute('data-tooltip');
            if (tooltipText) {
                currentPopup = createInfoPopup(tooltipText, this);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (currentPopup && !e.target.closest('.info-popup') && !e.target.closest('.info-icon')) {
            closeInfoPopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentPopup) {
            closeInfoPopup();
        }
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const existingRipple = this.querySelector('.ripple');
            if (existingRipple) existingRipple.remove();

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `width: ${size}px; height: ${size}px; left: ${x}px; top: ${y}px;`;
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add keyframe animation for ripple if not present
    if (!document.querySelector('style[data-ripple]')) {
        const style = document.createElement('style');
        style.setAttribute('data-ripple', '');
        style.textContent = `
            .ripple {
                position: absolute;
                background: rgba(255,255,255,0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            }
            @keyframes ripple { to { transform: scale(4); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }
}

// Export functions for use in other scripts
module.exports = {
    initGlassmorphismUI,
    showButtonFeedback
};

