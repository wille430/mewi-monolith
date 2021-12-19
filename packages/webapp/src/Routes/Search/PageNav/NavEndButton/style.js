import styled from "styled-components";

export const Button = styled.button`
    height: 50px;
    width: 50px;
    border: none;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;

    &:last-child & {
        border-radius: 0px 5px 5px 0px;
    }
    &:first-child & {
        border-radius: 5px 0px 0px 5px;
    }
    &:hover {
        background-color: lightgray;
    }
    &:active {
        background-color: rgb(230,230,230);
    }
`