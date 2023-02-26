import {parseCurrency} from "./parseCurrency";

describe.each([
    ["400 200 kr", 400200],
    ["400 200kr", 400200],
    ["400200kr", 400200],
    ["$400200", 400200],
])("parseCurrency", (str, res) => {
    it("should return parse correctly", () => {
        expect(parseCurrency(str)).toBe(res);
    });
});
