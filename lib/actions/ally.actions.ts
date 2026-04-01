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

export const getAllAllies = async ({
  limit = 10,
  page = 1,
  subject,
  topic
}: GetAllAllies) => {

  const supabase = createSupabaseClient();

  let query = supabase.from('allies').select('*');

  if (subject && topic) {
    query = query
      .eq('subject', subject)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } 
  else if (subject) {
    query = query.eq('subject', subject);
  } 
  else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  query = query.range((page - 1) * limit, page * limit - 1);

  const { data: allies, error } = await query;

  if (error) throw new Error(error.message);

  return allies;
};