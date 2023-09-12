import { authenticate, setup } from "./src/shared/index.ts";
import * as wow from "./src/wow/index.ts";
import * as wowClassic from "./src/wow_classic/index.ts";

export const blizzardAPI = {
    setup,
    authenticate,
    wow,
    wowClassic,
};
