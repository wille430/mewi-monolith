module.exports = {
    ...require('../../prettier.config'),
    plugins: [require('prettier-plugin-tailwindcss')],
    tailwindConfig: './tailwind.config.js',
}
