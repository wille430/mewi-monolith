import * as assert from "assert";

export class SmtpConfig {
  public readonly cred = {
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  };

  public readonly host = process.env.SMTP_HOST;
  public static smtpConfig = new SmtpConfig();

  constructor(test = !(process.env.NODE_ENV === "production")) {
    if (!test) {
      assert(process.env.SMTP_USERNAME);
      assert(process.env.SMTP_PASSWORD);
      assert(process.env.SMTP_HOST);
    }
  }

  public static getInstance() {
    return this.smtpConfig;
  }
}
