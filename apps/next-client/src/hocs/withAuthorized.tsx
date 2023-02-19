import {ComponentType, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks";
import {RedirectTo} from "@/components/RedirectTo";
import {UNAUTHORIZED_REDIRECT_TO} from "@/lib/constants/paths";
import {getUser} from "@/store/user";
import StyledLoader from "@/components/StyledLoader";

export const withAuthorized = <P extends object>(Component: ComponentType<P>) => (props: P) => {
    const {isReady, isLoggedIn} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getUser());
    }, []);

    if (!isReady) return <div className="flex-grow centered">
        <StyledLoader/>
    </div>;
    if (!isLoggedIn) return <RedirectTo to={UNAUTHORIZED_REDIRECT_TO}/>;

    return <Component {...props}/>;
};
