import type { Collection, Connection } from "mongoose";
import {createHandler} from "@/lib/middlewares/createHandler";
import { Server } from "http";
import { ScrapersController } from "../../scrapers.controller";
import { User } from "@mewi/entities";
import { adminUserPayloadStub } from "@/lib/modules/users/test/stubs/admin-user-payload.stub";
import { dbConnection } from "@/lib/dbConnection";
import { adminStub } from "@/lib/modules/users/test/stubs/admin.stub";
import { createTestClient } from "@/test/createTestClient";

describe("ScrapersController", () => {
    let dbConn: Connection;
    let usersCollection: Collection<User>;
    let httpServer: Server;

    beforeAll(async () => {
        dbConn = await dbConnection();
        httpServer = createTestClient(createHandler(ScrapersController), adminUserPayloadStub());
        usersCollection = dbConn.collection("users");

        jest.resetAllMocks();
    });

    afterAll(() => {
        httpServer.close();
    });

    beforeEach(async () => {
        await usersCollection.deleteMany({});
        await usersCollection.insertOne(adminStub());
    });

    it("should", () => {
        expect(true).toBe(true);
    });
});
