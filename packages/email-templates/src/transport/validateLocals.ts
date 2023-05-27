import { LOGO_PUBLIC_PATH } from "../constants";

export const validateLocals = (locals: any) => {
  if (locals.clientUrl == null) {
    throw new Error(`locals.clientUrl must be a non-null string`);
  }

  locals.logoUrl ??= new URL(LOGO_PUBLIC_PATH, locals.clientUrl).toString();
  if (locals.logoUrl == null)
    throw new Error(`locals.logoUrl must be a non-null string`);
};
