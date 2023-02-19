import type { FindAllUserDto } from "@/lib/modules/users/dto/find-all-user.dto";
import { stringify } from "querystring";
import { client } from "../index";
import {UserDto} from "@mewi/models";

export const getUsers = (filters: FindAllUserDto) => {
    return client.get<never, UserDto[]>(`/users?${stringify({ ...filters })}`);
};
