import { api } from "@/lib/api-client";
import type { Section } from "../types/section";
import type { SectionFormData } from "../schemas/section-schema";

type SectionPayload = SectionFormData & {
  course_id: number;
};

export async function getCourseSections(courseId: number): Promise<Section[]> {
  const response = await api.get<Section[]>("/admin/sections", {
    params: { course_id: courseId },
  });

  return response.data;
}

export async function createSection(payload: SectionPayload): Promise<Section> {
  const response = await api.post<Section>("/admin/sections", payload);
  return response.data;
}

export async function updateSection(
  sectionId: number,
  payload: Partial<SectionFormData>,
): Promise<Section> {
  const response = await api.put<Section>(
    `/admin/sections/${sectionId}`,
    payload,
  );
  return response.data;
}

export async function deleteSection(
  sectionId: number,
): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(
    `/admin/sections/${sectionId}`,
  );
  return response.data;
}

export async function reorderSections(
  sectionIds: number[],
): Promise<{ message: string }> {
  const response = await api.patch("/admin/sections/reorder", {
    ids: sectionIds,
  });
  return response.data;
}
