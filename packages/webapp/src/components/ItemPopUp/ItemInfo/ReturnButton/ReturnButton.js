import { SmallButton } from 'common/components/Button.style'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

const ReturnButton = () => {
    const history = useNavigate()

    const onClick = () => {
        history.goBack()
    }

    const StyledButton = styled(SmallButton)`
        border: none;
        min-width: 100px;
        background-color: transparent;
    `

    return <StyledButton onClick={onClick}>{'<< Tillbaka'}</StyledButton>
}

export default ReturnButton
