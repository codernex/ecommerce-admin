import {z} from "zod";

export const createStoreSchema=z.object({
    name:z.string().min(4,"Store Name Must have at least 4 char")
})

export const storeUpdateSchema=z.object({
    name:z.string().min(4,"Store Name Must have at least 4 char")
})