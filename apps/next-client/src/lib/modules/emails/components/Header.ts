const Header = {
    tagName: 'mj-wrapper',
    attributes: {
        width: '100%',
        'background-color': '#253C4C',
    },
    children: [
        {
            tagName: 'mj-image',
            attributes: {
                src:
                    (process.env.NODE_ENV !== 'production'
                        ? 'http://localhost:3001'
                        : 'https://api.mewi.se') + '/logo.png',
                height: 'auto',
                width: '100px',
            },
        },
    ],
}

export default Header
