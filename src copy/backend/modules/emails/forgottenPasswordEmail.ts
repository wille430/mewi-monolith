import mjml2html from 'mjml'
import Header from './components/Header'

export interface ForgottenPasswordEmailProps {
    link: string
}

const forgottenPasswordEmail = ({link}: ForgottenPasswordEmailProps): any => mjml2html({
    tagName: 'mjml',
    attributes: {},
    children: [
        {
            tagName: 'mj-head',
            attributes: {},
            children: [
                {
                    tagName: 'mj-attributes',
                    attributes: {},
                    children: [
                        {
                            tagName: 'mj-all',
                            attributes: {
                                'font-family': 'Inter'
                            }
                        }
                    ]
                }
            ]
        },
        {
            tagName: 'mj-body',
            attributes: {},
            children: [
                {
                    tagName: 'mj-section',
                    attributes: {},
                    children: [
                        {
                            tagName: 'mj-column',
                            attributes: {},
                            children: [
                                Header,
                                {
                                    tagName: 'mj-text',
                                    attributes: {},
                                        content:
                                            'En begäran om lösenordsändring har skickats till oss. Om det var du, klicka på knappen nedan, annars kan du ignorera detta meddelande.',
                                    },
                                    {
                                        tagName: 'mj-button',
                                        attributes: {
                                            href: link,
                                        },
                                    content: 'Ändra lösenord'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
})

export default forgottenPasswordEmail