import { ReactElement } from "react";

export type LinkType = {
  path: string;
  label: string;
  children?: LinkType[];
  icon?: ReactElement;
};
