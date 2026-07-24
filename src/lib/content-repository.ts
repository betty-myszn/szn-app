import { createClient } from "@/lib/supabase/client";

// Foundation for the content_modules table (see supabase/schema.sql). Nothing in the app
// requires this to return anything yet, every content function that could use an override still
// works entirely off its own compiled-in TypeScript content. This exists so that content can
// start moving into the database one override at a time, without a rewrite: call
// getContentModule() first, fall back to the existing hardcoded text when it returns null.
//
// Deliberately fails soft everywhere. A missing table, an RLS miss, a network blip, anything
// that isn't "found a published row" just returns null/[] rather than throwing, so a content
// override can never be the reason a page breaks.

export interface ContentModuleQuery {
  contentType: string;
  sign?: string;
  house?: number;
  planet?: string;
  aspectType?: string;
  lifeArea?: string;
  season?: string;
}

export interface ContentModule {
  id: string;
  contentType: string;
  astrologyObjectType: string | null;
  sign: string | null;
  house: number | null;
  planet: string | null;
  aspectType: string | null;
  lifeArea: string | null;
  season: string | null;
  tone: string;
  depthLevel: string;
  body: string;
  status: string;
  version: number;
  source: string | null;
  reviewStatus: string;
  fallbackPriority: number;
}

function mapRow(row: {
  id: string;
  content_type: string;
  astrology_object_type: string | null;
  sign: string | null;
  house: number | null;
  planet: string | null;
  aspect_type: string | null;
  life_area: string | null;
  season: string | null;
  tone: string;
  depth_level: string;
  body: string;
  status: string;
  version: number;
  source: string | null;
  review_status: string;
  fallback_priority: number;
}): ContentModule {
  return {
    id: row.id,
    contentType: row.content_type,
    astrologyObjectType: row.astrology_object_type,
    sign: row.sign,
    house: row.house,
    planet: row.planet,
    aspectType: row.aspect_type,
    lifeArea: row.life_area,
    season: row.season,
    tone: row.tone,
    depthLevel: row.depth_level,
    body: row.body,
    status: row.status,
    version: row.version,
    source: row.source,
    reviewStatus: row.review_status,
    fallbackPriority: row.fallback_priority,
  };
}

// The single best published module matching every facet given, highest fallback_priority first.
// Returns null on no match, no table, or any error, callers should always have their own
// hardcoded content ready to use when this comes back null.
export async function getContentModule(query: ContentModuleQuery): Promise<ContentModule | null> {
  try {
    const supabase = createClient();
    let q = supabase.from("content_modules").select("*").eq("content_type", query.contentType).eq("status", "published");
    if (query.sign !== undefined) q = q.eq("sign", query.sign);
    if (query.house !== undefined) q = q.eq("house", query.house);
    if (query.planet !== undefined) q = q.eq("planet", query.planet);
    if (query.aspectType !== undefined) q = q.eq("aspect_type", query.aspectType);
    if (query.lifeArea !== undefined) q = q.eq("life_area", query.lifeArea);
    if (query.season !== undefined) q = q.eq("season", query.season);

    const { data, error } = await q.order("fallback_priority", { ascending: false }).limit(1).maybeSingle();
    if (error || !data) return null;
    return mapRow(data);
  } catch {
    return null;
  }
}

// Every published module for a content type, e.g. for an admin listing or bulk-checking what's
// already been overridden. Same fail-soft contract as getContentModule.
export async function listContentModules(contentType: string): Promise<ContentModule[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("content_modules")
      .select("*")
      .eq("content_type", contentType)
      .eq("status", "published")
      .order("fallback_priority", { ascending: false });
    if (error || !data) return [];
    return data.map(mapRow);
  } catch {
    return [];
  }
}
