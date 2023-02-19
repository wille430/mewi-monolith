import "reflect-metadata";
import { container } from "tsyringe";
import { EmailService } from "./email.service";

describe("EmailService", () => {
    let service: EmailService;

    beforeEach(async () => {
        service = container.resolve(EmailService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
