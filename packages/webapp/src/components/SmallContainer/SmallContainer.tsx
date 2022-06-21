import { Container } from '@wille430/ui'
import { ReactNode } from 'react'

export interface SmallContainerProps {
    title?: string
    children?: ReactNode
    footer?: ReactNode
    header?: ReactNode
}

const SmallContainer = ({ title, children, footer, header }: SmallContainerProps) => {
    return (
        <Container className='mx-auto max-w-lg'>
            <Container.Header className='pt-2 pb-6'>
                {header}
                <h3 className='text-center'>{title}</h3>
            </Container.Header>
            <Container.Content>{children}</Container.Content>
            <Container.Footer>
                <div className='pt-6'>{footer}</div>
            </Container.Footer>
        </Container>
    )
}

export default SmallContainer
