import logo from 'assets/logo.png'
import { Link } from 'react-router-dom'

const MewiLogo = () => {
    return (
        <Link to='/'>
            <img alt='Mewi Logo' className='h-full w-auto' src={logo} />
        </Link>
    )
}

export default MewiLogo
