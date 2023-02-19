import { createRepositoryMock } from "@/test/createRepositoryMock";
import { userStub } from "../test/stubs/user.stub";

export const UsersRepository = createRepositoryMock(userStub());
