// noinspection ES6PreferShortImport

import {dbConnection} from "@/lib/dbConnection";
import {exit} from "process";
import {seedDb} from "@/test/seed/index";

dbConnection().then(async (db) => {
    await seedDb(db);
    exit(0);
});
