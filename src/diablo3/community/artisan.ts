import { request } from "../../shared/index.ts";

interface Item {
    id: string;
    slug: string;
    name: string;
    icon: string;
    path: string;
}

interface Reagent {
    quantity: number;
    item: Item;
}

interface Recipe {
    id: string;
    slug: string;
    name: string;
    cost: number;
    reagents: Reagent[];
    itemProduced: Item;
}

interface Tier {
    tier: number;
    trainedRecipes: Recipe[];
    taughtRecipes?: Recipe[];
}

interface Training {
    tiers: Tier[];
}

interface Artisan {
    slug: string;
    name: string;
    portrait: string;
    training: Training;
}

/**
 * Returns a single artisan by slug.
 *
 * @param artisanSlug - The slug of the artisan to retrieve.
 * @returns A promise that resolves to an object representing the data for a single artisan by slug.
 */
export async function artisan(artisanSlug: string): Promise<Artisan> {
    return await request({
        method: "GET",
        url: `/d3/data/artisan/${artisanSlug}`,
    });
}

/**
 * Returns a single recipe by slug for the specified artisan.
 *
 * @param artisanSlug - The slug of the artisan to retrieve.
 * @param recipeSlug - The slug of the recipe to retrieve.
 * @returns A promise that resolves to an object representing the data for a single recipe by slug for the specified artisan.
 */
export async function artisanRecipe(artisanSlug: string, recipeSlug: string): Promise<Recipe> {
    return await request({
        method: "GET",
        url: `/d3/data/artisan/${artisanSlug}/recipe/${recipeSlug}`,
    });
}
