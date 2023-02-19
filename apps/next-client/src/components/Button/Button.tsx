import React, {useState, ButtonHTMLAttributes} from "react";
import clsx from "clsx";

export const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
    const {
        onClick,
        className,
        ...rest
    } = props;
    const [isLoading, setLoading] = useState(false);

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick && !isLoading) {
            setLoading(true);
            await onClick(e);
            setLoading(false);
        }
    };

    return (
        <button
            data-testid="button"
            onClick={handleClick}
            disabled={isLoading}
            className={clsx("btn", className)}
            {...rest}
        />
    );
};
