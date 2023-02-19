import clsx from "clsx";
import { TableHTMLAttributes } from "react";
import styles from "./Table.module.scss";

export const Table = ({ children, className, ...props }: TableHTMLAttributes<HTMLTableElement>) => {
    return (
        <table
            className={clsx({
                [styles.table]: true,
                [className ?? ""]: className,
            })}
            {...props}
        >
            {children}
        </table>
    );
};
