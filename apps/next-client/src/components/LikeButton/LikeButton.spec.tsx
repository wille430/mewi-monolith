import { render } from "@testing-library/react";
import { LikeButton } from "./LikeButton";

describe("LikeButton", () => {
    it("renders correctly", () => {
        const { queryByTestId } = render(<LikeButton data-testid='like-button' />);
        expect(queryByTestId("like-button"));
    });

    it("should be liked", async () => {
        const { queryByTestId } = render(<LikeButton data-testid='like-button' liked={true} />);
        const button = queryByTestId("like-button") as Element;

        expect(button.getAttribute("data-liked")).toBe("true");
    });

    it("should not be liked", async () => {
        const { queryByTestId } = render(<LikeButton data-testid='like-button' liked={false} />);
        const button = queryByTestId("like-button") as Element;

        expect(button.getAttribute("data-liked")).toBe("false");
    });
});
