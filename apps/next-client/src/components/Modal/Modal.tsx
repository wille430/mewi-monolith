import {ReactElement} from "react";
import {Container} from "../Container/Container";

import {HorizontalLine} from "../HorizontalLine/HorizontalLine";

export interface ModalProps {
    actions?: ReactElement
    bodyText?: string
    heading?: string
}

export const Modal = ({actions, bodyText, heading}: ModalProps) => {
    return (
        <Container className="mx-auto max-w-lg rounded-md">
            <Container.Header>
                <h4>{heading}</h4>
                <HorizontalLine/>
            </Container.Header>

            <Container.Content>
                <p className="text-gray-600">{bodyText}</p>
            </Container.Content>

            <Container.Footer className="flex justify-end space-x-2 mt-2">{actions}</Container.Footer>
        </Container>
    );
};
