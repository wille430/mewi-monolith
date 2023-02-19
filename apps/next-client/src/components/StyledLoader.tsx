import * as Loader from "react-loader-spinner";

const StyledLoader = (...props: Partial<Parameters<typeof Loader["TailSpin"]>>) => {
    return (
        <Loader.TailSpin
            height='40px'
            width='40px'
            wrapperClass='color-secondary'
            data-testid='spinner'
            {...props[0]}
        />
    );
};

export default StyledLoader;
