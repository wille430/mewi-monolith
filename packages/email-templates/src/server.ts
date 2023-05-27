import express from "express";
import { renderTemplate } from "./renderTemplate";
import { EmailTemplate } from "@mewi/models";
import { validateLocals } from "./transport/validateLocals";

const app = express();
const port = 3001;

app.get("/", (req, res) => {
  let { template, ...locals } = req.query as any;
  locals ??= {};
  locals.clientUrl ??= "http://localhost:3000/";

  if (template == null) {
    throw new Error(
      "Query parameter 'template' must be one of " +
        Object.values(EmailTemplate).join(", ")
    );
  }

  validateLocals(locals);
  const { html } = renderTemplate(template as EmailTemplate, locals);
  res.send(html);
});

app.listen(port);
