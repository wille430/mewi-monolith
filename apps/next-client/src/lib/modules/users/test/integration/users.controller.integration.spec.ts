import type { Collection, Connection } from "mongoose";
import { faker } from "@faker-js/faker";
import {createHandler} from "@/lib/middlewares/createHandler";
import { hash } from "bcrypt";
import { container } from "tsyringe";
import { Server } from "http";
import { userStub } from "../stubs/user.stub";
import { adminStub } from "../stubs/admin.stub";
import { CreateUserDto } from "../../dto/create-user.dto";
import { AuthorizedUpdateEmailDto, RequestEmailUpdateDto } from "../../dto/update-email.dto";
import ChangePasswordDto, {
    ChangePasswordAuth,
    ChangePasswordWithToken,
} from "../../dto/change-password.dto";
import { UsersController } from "../../users.controller";
import { adminUserPayloadStub } from "../stubs/admin-user-payload.stub";
import { userPayloadStub } from "../stubs/user-payload.stub";
import { UpdateUserDto } from "../../dto/update-user.dto";
import { dbConnection } from "@/lib/dbConnection";
import { createTestClient } from "@/test/createTestClient";
import { Listing, User } from "@mewi/entities";
import { transformDate } from "@/lib/modules/listings/helpers/transform-dates";
import request from "supertest";
import { listingStub } from "@/lib/modules/listings/test/stubs/listing.stub";
import { ListingsService } from "@/lib/modules/listings/listings.service";

describe("UsersController", () => {
    let dbConn: Connection;
    let usersCollection: Collection<User>;
    let listingsCollection: Collection<Listing>;
    let httpServer: Server;

    describe("when authenticated as admin", () => {
        beforeAll(async () => {
            dbConn = await dbConnection();
            httpServer = createTestClient(createHandler(UsersController), adminUserPayloadStub());

            usersCollection = dbConn.collection("users");
            listingsCollection = dbConn.collection("listings");

            jest.resetAllMocks();
        });

        afterAll(() => {
            httpServer.close();
        });

        beforeEach(async () => {
            await usersCollection.deleteMany({});
            await usersCollection.insertOne(adminStub());
        });

        describe("GET /api/users", () => {
            it("should return an array of users", async () => {
                await usersCollection.insertOne(userStub());
                const response = await request(httpServer).get("/api/users");

                expect(response.status).toBe(200);
                expect(response.body).toMatchObject([
                    transformDate(adminStub()),
                    transformDate(userStub()),
                ]);
            });
        });

        describe("POST /api/users", () => {
            it("should create a user", async () => {
                const createUserDto: CreateUserDto = {
                    email: userStub().email.toUpperCase(),
                    password: faker.internet.password(),
                };
                const res = await request(httpServer).post("/api/users").send(createUserDto);

                expect(res.status).toBe(201);
                expect(res.body).toMatchObject({
                    email: createUserDto.email.toLowerCase(),
                });

                // Assert that the user was created
                const user = await usersCollection.findOne({
                    email: createUserDto.email.toLowerCase(),
                });

                // Password will never the same as input
                expect(user).toMatchObject({
                    email: createUserDto.email.toLowerCase(),
                });
                expect(user?.password).not.toBe(createUserDto.password);
            });

            describe("with malformed input data", () => {
                it("then it should return error obj", async () => {
                    const malformedInput: Partial<CreateUserDto> = {
                        email: userStub().email,
                    };

                    const response = await request(httpServer)
                        .post("/api/users")
                        .send(malformedInput);
                    expect(response.status).toBe(400);
                });
            });
        });

        describe("GET /api/users/:id", () => {
            it("should return user", async () => {
                await usersCollection.insertOne(userStub());
                const response = await request(httpServer).get(`/api/users/${userStub().id}`);

                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(transformDate(userStub()));
            });
        });

        describe("PUT /api/users/:id", () => {
            it("should return user and update document", async () => {
                await usersCollection.insertOne(userStub());

                const dto: UpdateUserDto = {
                    email: faker.internet.email().toLowerCase(),
                };
                const response = await request(httpServer)
                    .put(`/api/users/${userStub().id}`)
                    .send(dto);
                const newUser = await usersCollection.findOne({
                    id: userStub().id,
                });

                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(transformDate(newUser!));
            });
        });

        describe("DELETE /api/users/:id", () => {
            it("should return user and remove document", async () => {
                await usersCollection.insertOne(userStub());

                const response = await request(httpServer).delete(`/api/users/${userStub().id}`);

                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(transformDate(userStub()));

                const user = await usersCollection.findOne({
                    id: userStub().id,
                });

                expect(user).toBe(null);
            });
        });
    });

    describe("when authenticated as user", () => {
        beforeAll(async () => {
            dbConn = await dbConnection();
            httpServer = createTestClient(createHandler(UsersController), userPayloadStub());

            usersCollection = dbConn.collection("users");
            listingsCollection = dbConn.collection("listings");

            jest.resetAllMocks();
        });

        afterAll(() => {
            httpServer.close();
        });

        beforeEach(async () => {
            await usersCollection.deleteMany({});
            await usersCollection.insertOne(userStub());
        });

        describe("GET /api/users/me", () => {
            it("should return user", async () => {
                const response = await request(httpServer).get("/api/users/me");

                expect(response.status).toBe(200);
                expect(response.body).toMatchObject(transformDate(userStub()));
            });
        });

        // TODO: test post
        describe("PUT /api/users/email", () => {
            describe("with oldEmail and token", () => {
                let newEmail: string;
                let token: string;

                beforeEach(async () => {
                    // Request email change first
                    newEmail = faker.internet.email().toLowerCase();

                    await request(httpServer).put("/api/users/email").send({
                        newEmail,
                    });
                });

                it("then it should return OK and update user", async () => {
                    const updatedUser = await dbConn.collection<User>("users").findOne({
                        id: userStub().id,
                    });
                    token = updatedUser?.emailUpdate?.tokenHash as string;

                    const updateEmailDto: AuthorizedUpdateEmailDto = {
                        token: token,
                        oldEmail: userStub().email,
                    };
                    const response = await request(httpServer)
                        .put("/api/users/email")
                        .send(updateEmailDto);

                    expect(response.status).toBe(200);

                    const user = await dbConn.collection<User>("users").findOne({
                        id: userStub().id,
                    });
                    expect(user?.email).toBe(newEmail);
                });
            });

            describe("with newEmail", () => {
                // TODO: check for sent email
                it("then it should return OK and update user", async () => {
                    const verifyEmailDto: RequestEmailUpdateDto = {
                        newEmail: faker.internet.email(),
                    };
                    const response = await request(httpServer)
                        .put("/api/users/email")
                        .send(verifyEmailDto);

                    expect(response.status).toBe(200);

                    const user = await dbConn.collection<User>("users").findOne({
                        email: userStub().email,
                    });
                    const { emailUpdate } = user!;

                    expect(emailUpdate?.expiration.getTime()).toBeGreaterThan(Date.now());
                    expect(emailUpdate?.newEmail).toBe(verifyEmailDto.newEmail?.toLowerCase());
                    expect(emailUpdate?.tokenHash).toEqual(expect.any(String));
                });
            });
        });

        describe("PUT /api/users/password", () => {
            describe("with password and passwordConfirm (authenticated)", () => {
                it("should return OK and update user", async () => {
                    const originalUser = await dbConn
                        .collection<User>("users")
                        .findOne({ id: userStub().id });
                    const oldPassHash = originalUser?.password;

                    const newPassword = faker.internet.password();
                    const changePasswordAuthDto: ChangePasswordAuth = {
                        password: newPassword,
                        passwordConfirm: newPassword,
                    };

                    const response = await request(httpServer)
                        .put("/api/users/password")
                        .send(changePasswordAuthDto);

                    expect(response.status).toBe(200);

                    const user = await dbConn
                        .collection<User>("users")
                        .findOne({ id: userStub().id });

                    expect(user?.password).not.toBe(oldPassHash);
                });
            });

            describe("with email", () => {
                it("should send email and update user", async () => {
                    const changePasswordDto: ChangePasswordDto = {
                        email: userStub().email,
                    };

                    const response = await request(httpServer)
                        .put("/api/users/password")
                        .send(changePasswordDto);

                    expect(response.status).toBe(200);

                    const user = await usersCollection.findOne({
                        id: userStub().id,
                    });

                    expect(user?.passwordReset).toMatchObject({
                        tokenHash: expect.any(String),
                        expiration: expect.any(Number),
                    });

                    // TODO: assert email was sent
                });
            });
        });

        describe("GET /api/users/me/likes", () => {
            it("should return listings", async () => {
                await listingsCollection.insertOne(listingStub());

                const listingsService = container.resolve(ListingsService);
                await listingsService.like(userStub().id, listingStub().id);

                const res = await request(httpServer).get("/api/users/me/likes");

                expect(res.status).toBe(200);
                expect(res.body).toMatchObject([transformDate(listingStub())]);
            });
        });
    });

    describe("when unauthenticated", () => {
        beforeAll(async () => {
            dbConn = await dbConnection();
            httpServer = createTestClient(createHandler(UsersController));

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

        describe("GET /api/users", () => {
            it("should return status 401", async () => {
                const response = await request(httpServer).get("/api/users");
                expect(response.status).toBe(401);
            });
        });

        describe("POST /api/users", () => {
            it("should return status 401", async () => {
                const response = await request(httpServer).post("/api/users");
                expect(response.status).toBe(401);
            });
        });

        describe("PUT /api/users/password", () => {
            let tokenHash: string;
            let password: string;

            beforeEach(async () => {
                tokenHash = faker.random.alphaNumeric(32);
                password = faker.internet.password(16, true);

                await usersCollection.insertOne({
                    ...userStub(),
                    password: await hash(password, 10),
                    passwordReset: {
                        expiration: Date.now() + 999999,
                        tokenHash,
                    },
                });
            });

            describe("with invalid token", () => {
                it("should return status 400", async () => {
                    const response = await request(httpServer)
                        .put("/api/users/password")
                        .send({
                            email: userStub().email,
                            password: userStub().password,
                            passwordConfirm: userStub().password,
                            token: faker.random.alphaNumeric(32),
                        } as ChangePasswordWithToken);

                    expect(response.status).toBe(400);
                });
            });

            describe("with same password as before", () => {
                it("should return status 400", async () => {
                    const response = await request(httpServer)
                        .put("/api/users/password")
                        .send({
                            email: userStub().email,
                            password: password,
                            passwordConfirm: password,
                            token: tokenHash,
                        } as ChangePasswordWithToken);

                    expect(response.status).toBe(400);
                });
            });
        });

        describe("GET /api/users/:id", () => {
            it("should return status 401", async () => {
                const response = await request(httpServer).get(`/api/users/${userStub().id}`);

                expect(response.status).toBe(401);
            });
        });

        describe("PUT /api/users/:id", () => {
            it("should return status 401", async () => {
                const response = await request(httpServer).put(`/api/users/${userStub().id}`);

                expect(response.status).toBe(401);
            });
        });

        describe("DELETE /api/users/:id", () => {
            it("should return status 401", async () => {
                const response = await request(httpServer).delete(`/api/users/${userStub().id}`);

                expect(response.status).toBe(401);
            });
        });

        describe("GET /api/users/me/likes", () => {
            it("should return status 401", async () => {
                const response = await request(httpServer).get("/api/users/me/likes");
                expect(response.status).toBe(401);
            });
        });
    });
});
