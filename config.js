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
            id: 'boldAiDetectedText',
            name: 'Bold AI Detected Text',
            description: 'Bolds text that is likely AI-generated.',
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