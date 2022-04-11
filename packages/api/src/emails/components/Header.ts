
const Header = ({
    tagName: 'mj-wrapper',
    attributes: {
        width: '100%',
        'background-color': '#253C4C',
    },
    children: [
        {
            tagName: 'mj-image',
            attributes: {
                src: 'http://localhost:3001/logo.png',
                height: 'auto',
                width: '100px',
            }
        },
    ]
})

export default Header