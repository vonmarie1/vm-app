'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

export const createAlly = async (formData: CreateAlly) => {
    const { userId: author} = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase
    .from("allies")
    .insert({... formData, author})
    .select();

    if(error || !data) throw new Error(error?.message || 'Failed to create a companion');

    return data[0];
}