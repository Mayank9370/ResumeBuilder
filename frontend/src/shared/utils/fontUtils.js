export const FONTS = [
    // Sans Serif
    { name: 'Inter', value: 'font-inter', category: 'Sans Serif' },
    { name: 'Roboto', value: 'font-roboto', category: 'Sans Serif' },
    { name: 'Open Sans', value: 'font-opensans', category: 'Sans Serif' },
    { name: 'Lato', value: 'font-lato', category: 'Sans Serif' },
    { name: 'Montserrat', value: 'font-montserrat', category: 'Sans Serif' },
    { name: 'Poppins', value: 'font-poppins', category: 'Sans Serif' },
    { name: 'Raleway', value: 'font-raleway', category: 'Sans Serif' },
    { name: 'Nunito', value: 'font-nunito', category: 'Sans Serif' },
    { name: 'Source Sans 3', value: 'font-source', category: 'Sans Serif' },
    { name: 'Ubuntu', value: 'font-ubuntu', category: 'Sans Serif' },
    { name: 'Work Sans', value: 'font-work', category: 'Sans Serif' },
    { name: 'Fira Sans', value: 'font-fira', category: 'Sans Serif' },
    { name: 'Quicksand', value: 'font-quicksand', category: 'Sans Serif' },
    { name: 'Barlow', value: 'font-barlow', category: 'Sans Serif' },
    { name: 'Mulish', value: 'font-mulish', category: 'Sans Serif' },
    { name: 'Titillium Web', value: 'font-titillium', category: 'Sans Serif' },
    { name: 'DM Sans', value: 'font-dm', category: 'Sans Serif' },
    { name: 'Heebo', value: 'font-heebo', category: 'Sans Serif' },
    { name: 'Josefin Sans', value: 'font-josefin', category: 'Sans Serif' },
    { name: 'Manrope', value: 'font-manrope', category: 'Sans Serif' },
    { name: 'Cairo', value: 'font-cairo', category: 'Sans Serif' },
    { name: 'Oxygen', value: 'font-oxygen', category: 'Sans Serif' },
    { name: 'Hind', value: 'font-hind', category: 'Sans Serif' },
    { name: 'Karla', value: 'font-karla', category: 'Sans Serif' },
    { name: 'Signika', value: 'font-signika', category: 'Sans Serif' },
    { name: 'Cabin', value: 'font-cabin', category: 'Sans Serif' },
    { name: 'Catamaran', value: 'font-catamaran', category: 'Sans Serif' },
    { name: 'Asap', value: 'font-asap', category: 'Sans Serif' },
    { name: 'Varela Round', value: 'font-varela', category: 'Sans Serif' },

    // Serif
    { name: 'Merriweather', value: 'font-merriweather', category: 'Serif' },
    { name: 'Playfair Display', value: 'font-playfair', category: 'Serif' },
    { name: 'EB Garamond', value: 'font-garamond', category: 'Serif' },
    { name: 'PT Serif', value: 'font-ptserif', category: 'Serif' },
    { name: 'Crimson Text', value: 'font-crimson', category: 'Serif' },
    { name: 'Lora', value: 'font-lora', category: 'Serif' },
    { name: 'Libre Baskerville', value: 'font-librebaskerville', category: 'Serif' },
    { name: 'Arvo', value: 'font-arvo', category: 'Serif' },
    { name: 'Bitter', value: 'font-bitter', category: 'Serif' },

    // Mono
    { name: 'Inconsolata', value: 'font-inconsolata', category: 'Monospace' },

    // Display
    { name: 'Oswald', value: 'font-oswald', category: 'Display' },
    { name: 'Anton', value: 'font-anton', category: 'Display' },
    { name: 'Teko', value: 'font-teko', category: 'Display' },
    { name: 'Fjalla One', value: 'font-fjalla', category: 'Display' },
];

/**
 * Normalizes a font family string to a Tailwind utility class.
 * Handles legacy names ("Inter") and utility classes ("font-inter").
 * Defaults to 'font-inter' if not found.
 */
export const getFontClass = (fontName) => {
    if (!fontName) return 'font-inter';
    if (fontName.startsWith('font-')) return fontName;

    const font = FONTS.find(f => f.name === fontName || f.value === fontName);
    return font ? font.value : 'font-inter';
};
