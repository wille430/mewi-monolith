import { EmailTemplate } from "@mewi/models";
import path from "path";
import pug from "pug";

const getTemplatePath = (
  template: EmailTemplate,
  templatesPath = __dirname + "./emails"
) => {
  const templateToPathMap = {
    [EmailTemplate.FORGOTTEN_PASSWORD]: "forgottenPassword",
  };

  const filename = templateToPathMap[template];

  if (filename == null) {
    throw new Error(`No template for ${template} has been implemented`);
  }

  return path.join(templatesPath, filename);
};

const getHtmlFile = (templateRootFolder: string) => {
  return path.join(templateRootFolder, "html.pug");
};

const getSubjectFile = (templateRootFolder: string) => {
  return path.join(templateRootFolder, "subject.pug");
};

type RenderTemplateResult = {
  html: string;
  subject: string;
};

export const renderTemplate = (
  template: EmailTemplate,
  locals: any,
  templatesPath: string = undefined
): RenderTemplateResult => {
  const templatePath = getTemplatePath(template, templatesPath);
  console.log(`Rendering ${path.join(templatePath, "html.pug")}`);
  const html = pug.renderFile(getHtmlFile(templatePath), {
    locals: locals,
  });

  const subject = pug.renderFile(getSubjectFile(templatePath), {
    locals: locals,
  });

  return {
    html,
    subject,
  };
};
