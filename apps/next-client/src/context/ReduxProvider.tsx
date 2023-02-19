import {HTMLAttributes} from "react";
import {Provider} from "react-redux";
import {store} from "@/store";

export const ReduxProvider = ({children}: HTMLAttributes<any>) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
};