import {ComponentType, useEffect} from "react";
import {getUser} from "@/store/user";
import {useAppDispatch, useAppSelector} from "@/hooks";

export const withUser = <P extends object>(Component: ComponentType<P>) => (props: P) => {
    const dispatch = useAppDispatch();
    const {isReady} = useAppSelector(state => state.user);

    useEffect(() => {
        if (!isReady) {
            dispatch(getUser());
        }
    }, []);

    return <Component {...props}/>;
};