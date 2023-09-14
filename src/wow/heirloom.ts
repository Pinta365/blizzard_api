import { KeyId, KeyNameId, LinkSelfHref, LocalizedString, request, TypeName } from "../shared/index.ts";

interface Heirlooms extends LinkSelfHref {
    heirlooms: KeyNameId[];
}
interface ValueDisplayString {
    value: number;
    display_string: LocalizedString;
}

interface UpgradeStats {
    type: TypeName;
    value: number;
    display: {
        display_string: LocalizedString;
        color: {
            r: number;
            g: number;
            b: number;
            a: number;
        };
    };
}

interface Upgrade {
    item: {
        item: KeyId;
        context: number;
        bonus_list: number[];
        quality: TypeName;
        name: LocalizedString;
        media: KeyId;
        item_class: KeyNameId;
        item_subclass: KeyNameId;
        inventory_type: TypeName;
        binding: TypeName;
        weapon: {
            damage: {
                min_value: number;
                max_value: number;
                display_string: LocalizedString;
                damage_class: TypeName;
            };
            attack_speed: ValueDisplayString;
            dps: ValueDisplayString;
        };
        stats: UpgradeStats[];
        upgrades: {
            value: number;
            max_value: number;
            display_string: LocalizedString;
        };
        requirements: {
            level: {
                display_string: LocalizedString;
            };
        };
        level: ValueDisplayString;
    };
    level: number;
}

interface Heirloom extends LinkSelfHref {
    id: number;
    item: KeyNameId;
    source: {
        type: string;
        name: LocalizedString;
    };
    source_description: LocalizedString;
    upgrades: Upgrade[];
    media: KeyId;
}

/**
 * Returns the Heirloom Index
 *
 * @returns A promise that resolves to an object representing a list of all Heirlooms.
 */
export async function heirlooms(): Promise<Heirlooms> {
    return await request({
        method: "GET",
        url: "/data/wow/heirloom/index",
        namespace: "static",
    });
}

/**
 * Returns a Heirloom
 *
 * @param heirloomId - The unique identifier for the Heirloom
 * @returns A promise that resolves to an object representing details about a Heirloom.
 */
export async function heirloom(heirloomId: number): Promise<Heirloom> {
    return await request({
        method: "GET",
        url: `/data/wow/heirloom/${heirloomId}`,
        namespace: "static",
    });
}
