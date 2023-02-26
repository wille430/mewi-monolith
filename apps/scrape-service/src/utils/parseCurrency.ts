import { dropWhile, flow, join, takeWhile } from "lodash";

const predicate = (c: string) => {
  return (c >= "0" && c <= "9") || c === "," || c === ".";
};

const not = (f: (args: any) => boolean) => {
  return (args: any) => !f(args);
}

export const parseCurrency = (str: string) =>
  flow(
    // split
    (str: string) => str.replace(" ", "").split(""),
    // take numbers
    (arr: string[]) => dropWhile(arr, not(predicate)),
    (arr: string[]) => takeWhile(arr, predicate),
    (arr: string[]) => join(arr, ""),
    parseFloat
  )(str);
