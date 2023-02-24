"use client";
import {HTMLAttributes, useState} from "react";
import AddWatcherPopUp from "./AddWatcherPopUp";
import {Button} from "../Button/Button";

const WatcherPopUpButton = (props: HTMLAttributes<HTMLButtonElement>) => {
    const [show, setShow] = useState(false);

    const handleClick = () => {
        setShow(true);
    };

    return (
        <>
            <AddWatcherPopUp useShow={{show, setShow}}/>
            <Button onClick={handleClick} {...props}>
                Skapa bevakning
            </Button>
        </>
    );
};

export default WatcherPopUpButton;
