// characters.js - Contains all character mappings for text cleaning

module.exports = {
    // List of invisible Unicode characters to be removed
    invisibleUnicodeCharacters: [
        // Line Feed moved to nonAsciiToAsciiMap for proper paragraph indentation
        '\u200B', // Zero Width Space
        '\u200C', // Zero Width Non-Joiner
        '\u200D', // Zero Width Joiner
        '\u200E', // Left-to-Right Mark
        '\u200F', // Right-to-Left Mark
        '\u202A', // Left-to-Right Embedding
        '\u202B', // Right-to-Left Embedding
        '\u202C', // Pop Directional Formatting
        '\u202D', // Left-to-Right Override
        '\u202E', // Right-to-Left Override
        '\uFEFF', // Zero Width No-Break Space (BOM)
        '\u2060', // Word Joiner
        '\u2061', // Function Application
        '\u2062', // Invisible Times
        '\u2063', // Invisible Separator
        '\u2064', // Invisible Plus
        '\u2800'  // Braille Pattern Blank
    ],

    // Mapping of non-ASCII characters to their ASCII equivalents
    nonAsciiToAsciiMap: {
        // Quotes and apostrophes
        '\u2018': "'", // Left single quote
        '\u2019': "'", // Right single quote
        '\u201A': "'", // Single low quote
        '\u201B': "'", // Single high reversed quote
        '\u201C': '"', // Left double quote
        '\u201D': '"', // Right double quote
        '\u201E': '"', // Double low quote
        '\u201F': '"', // Double high reversed quote
        '\u2032': "'", // Prime
        '\u2033': '"', // Double prime
        
        // Dashes and hyphens
        '\u2010': '-', // Hyphen
        '\u2011': '-', // Non-breaking hyphen
        '\u2012': '-', // Figure dash
        '\u2013': '-', // En dash
        '\u2014': '--', // Em dash
        '\u2015': '--', // Horizontal bar
        
        // Other punctuation
        '\u2022': '*', // Bullet
        '\u2023': '>', // Triangular bullet
        '\u2026': '...', // Ellipsis
        '\u2039': '<', // Single left angle quote
        '\u203A': '>', // Single right angle quote
        '\u203C': '!!', // Double exclamation mark
        '\u203D': '?!', // Interrobang
        '\u2044': '/', // Fraction slash
        '\u204A': '%', // Tironian sign et
        
        // Spaces
        '\u00A0': ' ', // Non-breaking space
        '\u2000': ' ', // En quad
        '\u2001': ' ', // Em quad
        '\u2002': ' ', // En space
        '\u2003': ' ', // Em space
        '\u2004': ' ', // Three-per-em space
        '\u2005': ' ', // Four-per-em space
        '\u2006': ' ', // Six-per-em space
        '\u2007': ' ', // Figure space
        '\u2008': ' ', // Punctuation space
        '\u2009': ' ', // Thin space
        '\u200A': ' ', // Hair space
        '\u202F': ' ', // Narrow no-break space
        '\u205F': ' ', // Medium mathematical space
        
        // Currency symbols
        '\u00A2': 'c', // Cent sign
        '\u00A3': 'GBP', // Pound sign
        '\u00A4': '$', // Currency sign
        '\u00A5': 'Y', // Yen sign
        '\u20A0': 'EUR', // Euro Currency Sign
        '\u20AC': 'EUR', // Euro sign
        
        // Common symbols
        '\u00A9': '(c)', // Copyright sign
        '\u00AE': '(r)', // Registered sign
        '\u2117': '(p)', // Sound recording copyright
        '\u2120': 'sm', // Service mark
        '\u2122': '(tm)', // Trade mark sign
        '\u00B0': 'deg', // Degree sign
        '\u00B1': '+/-', // Plus-minus sign
        '\u00D7': 'x', // Multiplication sign
        '\u00F7': '/', // Division sign
        
        // Fractions
        '\u00BC': '1/4', // Quarter
        '\u00BD': '1/2', // Half
        '\u00BE': '3/4', // Three quarters
        
        // Common letter replacements
        '\u00C0': 'A', '\u00C1': 'A', '\u00C2': 'A', '\u00C3': 'A', '\u00C4': 'A', '\u00C5': 'A',
        '\u00C6': 'AE',
        '\u00C7': 'C',
        '\u00C8': 'E', '\u00C9': 'E', '\u00CA': 'E', '\u00CB': 'E',
        '\u00CC': 'I', '\u00CD': 'I', '\u00CE': 'I', '\u00CF': 'I',
        '\u00D0': 'D',
        '\u00D1': 'N',
        '\u00D2': 'O', '\u00D3': 'O', '\u00D4': 'O', '\u00D5': 'O', '\u00D6': 'O', '\u00D8': 'O',
        '\u00D9': 'U', '\u00DA': 'U', '\u00DB': 'U', '\u00DC': 'U',
        '\u00DD': 'Y',
        '\u00DE': 'Th',
        '\u00DF': 'ss',
        
        '\u00E0': 'a', '\u00E1': 'a', '\u00E2': 'a', '\u00E3': 'a', '\u00E4': 'a', '\u00E5': 'a',
        '\u00E6': 'ae',
        '\u00E7': 'c',
        '\u00E8': 'e', '\u00E9': 'e', '\u00EA': 'e', '\u00EB': 'e',
        '\u00EC': 'i', '\u00ED': 'i', '\u00EE': 'i', '\u00EF': 'i',
        '\u00F0': 'd',
        '\u00F1': 'n',
        '\u00F2': 'o', '\u00F3': 'o', '\u00F4': 'o', '\u00F5': 'o', '\u00F6': 'o', '\u00F8': 'o',
        '\u00F9': 'u', '\u00FA': 'u', '\u00FB': 'u', '\u00FC': 'u',
        '\u00FD': 'y', '\u00FF': 'y',
        '\u00FE': 'th'
    }
};