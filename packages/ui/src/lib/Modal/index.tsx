import { ReactNode } from 'react'
import { Container } from '../Container'
import { HorizontalLine } from '../HorizontalLine'
// import styles from './index.module.scss'

interface ModalProps {
    actions?: ReactNode[]
    bodyText?: string
    heading?: string
}

const Modal = ({ actions, bodyText, heading }: ModalProps) => {
    return (
        <Container>
            <Container.Header>
                <h3>{heading}</h3>
                <HorizontalLine />
            </Container.Header>

            <Container.Content>
                <p className='text-gray-600'>{bodyText}</p>
            </Container.Content>

            <Container.Footer className='flex justify-end'>{actions}</Container.Footer>
        </Container>
    )
}

export default Modal
