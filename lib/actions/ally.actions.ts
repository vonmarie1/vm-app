'use server';

import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";

const PLAN_ALLY_LIMITS: Record<string, number> = {
  free_user: 3,
  core: 10,
};

export const getAllyLimit = async () => {
  const { has } = await auth();

  if (has({ plan: "proactive_learner" })) return Infinity;
  if (has({ plan: "core" })) return PLAN_ALLY_LIMITS.core;
  return PLAN_ALLY_LIMITS.free_user;
};

export const getUserAlliesCount = async (userId: string) => {
  const supabase = createSupabaseClient();

  const { count, error } = await supabase
    .from("allies")
    .select("*", { count: "exact", head: true })
    .eq("author", userId);

  if (error) throw new Error(error.message);

  return count ?? 0;
};

export const createAlly = async (formData: CreateAlly) => {
    const { userId: author} = await auth();
    if (!author) throw new Error("You must be signed in to create an ally");

    const limit = await getAllyLimit();
    if (limit !== Infinity) {
        const currentCount = await getUserAlliesCount(author);
        if (currentCount >= limit) {
            throw new Error(
                `You've reached your plan's limit of ${limit} allies. Upgrade your plan to create more.`
            );
        }
    }

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

export const getAlly = async (id: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("allies")
    .select()
    .eq("id", id);

  if (error) throw new Error(error.message);

  return data[0];
};

export const getUserAllies = async (userId: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("allies")
    .select()
    .eq("author", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};

export const toggleBookmark = async (allyId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in to bookmark allies");

  const supabase = createSupabaseClient();

  const { data: existing, error: fetchError } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("ally_id", allyId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) throw new Error(fetchError.message);

  if (existing) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", existing.id);

    if (error) throw new Error(error.message);
    return { bookmarked: false };
  }

  const { error } = await supabase
    .from("bookmarks")
    .insert({ ally_id: allyId, user_id: userId });

  if (error) throw new Error(error.message);
  return { bookmarked: true };
};

export const getBookmarkedAllyIds = async (userId: string) => {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("bookmarks")
    .select("ally_id")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  return data.map((row) => row.ally_id as string);
};

export const getBookmarkedAllies = async (userId: string) => {
  const allyIds = await getBookmarkedAllyIds(userId);
  if (allyIds.length === 0) return [];

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("allies")
    .select()
    .in("id", allyIds);

  if (error) throw new Error(error.message);

  return data;
};

const SESSION_RATE_LIMIT = 5;
const SESSION_RATE_WINDOW_MINUTES = 10;

export const recordSessionStart = async (allyId: string) => {
  const { userId } = await auth();
  if (!userId) throw new Error("You must be signed in to start a session");

  const supabase = createSupabaseClient();
  const windowStart = new Date(
    Date.now() - SESSION_RATE_WINDOW_MINUTES * 60_000
  ).toISOString();

  const { count, error: countError } = await supabase
    .from("session_starts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", windowStart);

  if (countError) throw new Error(countError.message);

  if ((count ?? 0) >= SESSION_RATE_LIMIT) {
    throw new Error(
      `You've started too many sessions recently. Please wait a few minutes before starting another.`
    );
  }

  const { error: insertError } = await supabase
    .from("session_starts")
    .insert({ ally_id: allyId, user_id: userId });

  if (insertError) throw new Error(insertError.message);
};