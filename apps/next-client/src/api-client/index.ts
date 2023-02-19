import axios from "axios";
import type { mutate } from "swr";

export * from "./users/users";
export * from "./auth/auth";

export const client = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

client.interceptors.response.use(
    ({data}) => data,
    (err) => {
        throw err.response.data;
    }
);

export type MutationArgs = Parameters<typeof mutate>
