import { authenticate, setup } from "./src/shared/index.ts";
import * as wow from "./src/wow/index.ts";
import * as wowClassic from "./src/wow_classic/index.ts";
import * as hearthstone from "./src/hearthstone/index.ts";
import * as sc2 from "./src/starcraft2/index.ts";
import * as errors from "./src/shared/errors.ts";

export { authenticate, errors, hearthstone, sc2, setup, wow, wowClassic };
