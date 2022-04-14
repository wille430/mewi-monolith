module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
        '@storybook/preset-scss',
    ],
    framework: '@storybook/react',
    webpackFinal: async (config) => {
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        })
        return config
    },
}
