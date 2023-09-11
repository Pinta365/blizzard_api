import { LinkSelfHref, request } from "../shared/index.ts";

export interface WowToken {
    _links: LinkSelfHref;
    last_updated_timestamp: number;
    price: number;
}

export async function token(): Promise<WowToken> {
    const tokenData = await request({
        method: "GET",
        url: "/data/wow/token/index",
        namespace: "dynamic",
    });
    return tokenData;
}
