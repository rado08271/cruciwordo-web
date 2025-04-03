export const getRandomTailwindColor = () => {
    // All Tailwind colors excluding 'sky'
    const colors = [
        // 'slate', 'gray', 'zinc', 'neutral', 'stone',
        // 'red', 'orange', 'amber', 'yellow', 'lime',
        // 'green', 'emerald', 'teal', 'cyan', 'blue',
        'green', 'red', 'yellow', 'blue',
        // 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
    ];

    // Possible shade values in range 50-400
    const shades = [200, 300, 400];

    // Get random color (excluding 'sky')
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Get random shade
    const randomShade = shades[Math.floor(Math.random() * shades.length)];

    console.log(`bg-${randomColor}-${randomShade}`)
    return `bg-${randomColor}-${randomShade}`;
}

