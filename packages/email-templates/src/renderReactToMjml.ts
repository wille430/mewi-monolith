import { renderToMjml } from "@faire/mjml-react/utils/renderToMjml";
import mjml2html from "mjml";
import { ReactElement } from "react";

export const renderReactToMjml = (email: ReactElement) => {
  return mjml2html(renderToMjml(email));
};
