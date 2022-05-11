import { ReactElement } from 'react'
import { Container } from '../Container'
import { HorizontalLine } from '../HorizontalLine'

export interface ModalProps {
    actions?: ReactElement
    bodyText?: string
    heading?: string
}

export const Modal = ({ actions, bodyText, heading }: ModalProps) => {
    return (
        <Container className='max-w-lg mx-auto'>
            <Container.Header>
                <h4>{heading}</h4>
                <HorizontalLine />
            </Container.Header>

            <Container.Content>
                <p className='text-gray-600'>{bodyText}</p>
            </Container.Content>

            <Container.Footer className='flex justify-end space-x-2'>{actions}</Container.Footer>
        </Container>
    )
}
