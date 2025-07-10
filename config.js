// config.js - App Configuration
module.exports = {
    // Application settings
    settings: [
        {
            id: 'normalizeCharacters',
            name: 'Normalize Characters',
            description: 'Converts uncommon Unicode characters to their standard equivalents',
            defaultValue: true
        },
        {
            id: 'statisticalWatermarks',
            name: 'Statistical Watermarks',
            description: 'Functionality for statistical watermark detection (not yet implemented)',
            defaultValue: false
        },
        {
            id: 'verboseMode',
            name: 'Verbose Mode',
            description: 'Logs detailed information about the cleaning process',
            defaultValue: false
        }
    ]
};