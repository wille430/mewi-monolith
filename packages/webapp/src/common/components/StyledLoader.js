import Loader from 'react-loader-spinner'
import theme from 'themes/theme';

const StyledLoader = () => {
    return (
        <Loader
            type="TailSpin"
            height="40px"
            width="40px"
            color={theme.accent1}
        />
    );
}

export default StyledLoader;