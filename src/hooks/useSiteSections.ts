import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface SiteSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  content: Record<string, unknown>;
  background_type: string;
  background_value: string | null;
  is_visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Helper to safely convert Json to Record<string, unknown>
function jsonToRecord(json: Json): Record<string, unknown> {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    return json as Record<string, unknown>;
  }
  return {};
}

export function useSiteSections() {
  return useQuery({
    queryKey: ["site-sections"],
    queryFn: async (): Promise<SiteSection[]> => {
      const { data, error } = await supabase
        .from("site_sections")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      return (data || []).map((item) => ({
        ...item,
        content: jsonToRecord(item.content),
      }));
    },
  });
}

export function useSiteSection(sectionKey: string) {
  return useQuery({
    queryKey: ["site-sections", sectionKey],
    queryFn: async (): Promise<SiteSection | null> => {
      const { data, error } = await supabase
        .from("site_sections")
        .select("*")
        .eq("section_key", sectionKey)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        content: jsonToRecord(data.content),
      };
    },
  });
}

export function useUpdateSiteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: Partial<SiteSection> & { id: string }) => {
      const updateData: Record<string, unknown> = {};
      
      if (section.title !== undefined) updateData.title = section.title;
      if (section.subtitle !== undefined) updateData.subtitle = section.subtitle;
      if (section.content !== undefined) updateData.content = section.content as Json;
      if (section.background_type !== undefined) updateData.background_type = section.background_type;
      if (section.background_value !== undefined) updateData.background_value = section.background_value;
      if (section.is_visible !== undefined) updateData.is_visible = section.is_visible;
      if (section.display_order !== undefined) updateData.display_order = section.display_order;

      const { error } = await supabase
        .from("site_sections")
        .update(updateData)
        .eq("id", section.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-sections"] });
    },
  });
}

export function useCreateSiteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (section: {
      section_key: string;
      title?: string | null;
      subtitle?: string | null;
      content?: Record<string, unknown>;
      background_type?: string;
      background_value?: string | null;
      is_visible?: boolean;
      display_order?: number;
    }) => {
      const { error } = await supabase
        .from("site_sections")
        .insert({
          section_key: section.section_key,
          title: section.title,
          subtitle: section.subtitle,
          content: (section.content || {}) as Json,
          background_type: section.background_type || "color",
          background_value: section.background_value,
          is_visible: section.is_visible ?? true,
          display_order: section.display_order ?? 0,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-sections"] });
    },
  });
}

export function useDeleteSiteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("site_sections")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-sections"] });
    },
  });
}
