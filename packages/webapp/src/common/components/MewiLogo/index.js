import logo from 'assets/logo.png'
import { Link } from 'react-router-dom'

const MewiLogo = () => {
    return (
        <Link to="/">
            <img alt="Mewi Logo" className="w-auto h-full" src={logo} />
        </Link>
    );
}

export default MewiLogo;