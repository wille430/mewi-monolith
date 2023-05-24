import {
  MjmlColumn,
  MjmlDivider,
  MjmlSection,
  MjmlText,
} from "@faire/mjml-react";
import { Template } from "./components/Template";
import { renderReactToMjml } from "../renderReactToMjml";

type VerifyEmailTemplateProps = {
  link: string;
};

export const VerifyEmailTemplate = ({ link }: VerifyEmailTemplateProps) => {
  return renderReactToMjml(
    <Template>
      <MjmlSection backgroundColor="#EFEFEF">
        <MjmlColumn>
          <MjmlText align="center">
            <h1>Förfrågan om e-postadressändring</h1>
          </MjmlText>
          <MjmlDivider borderWidth="1px"></MjmlDivider>
        </MjmlColumn>
      </MjmlSection>

      <MjmlSection
        backgroundColor="#EFEFEF"
        paddingTop="22px"
        paddingBottom="42px"
      >
        <MjmlColumn>
          <MjmlText
            fontSize="20px"
            color="#569bd8"
            textDecoration="underline"
            paddingBottom="4px"
            align="center"
          >
            <a href={link}>Verifiera e-postadress</a>
          </MjmlText>

          <MjmlText fontSize="12px" align="center">
            <span>{link}</span>
          </MjmlText>
        </MjmlColumn>
      </MjmlSection>
    </Template>
  );
};
