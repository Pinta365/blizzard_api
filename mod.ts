import { authenticate, setup } from "./src/shared/index.ts";
import * as wow from "./src/wow/index.ts";
import * as wowClassic from "./src/wow_classic/index.ts";

const blizzardAPI = {
    setup,
    authenticate,
    wow,
    wowClassic,
};

export default blizzardAPI;
