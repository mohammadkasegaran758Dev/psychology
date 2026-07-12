import { api } from "@/lib/api-client";

export type UploadType = "course_image" | "lesson_video";

type UploadResponseLoose =
  | {
      message?: string;
      path?: string;
      url?: string;
      data?: {
        path?: string;
        url?: string;
        full_url?: string;
      };
    }
  | any;

function extractUploadedPath(res: UploadResponseLoose): string {
  // Try common shapes
  const path =
    res?.path ??
    res?.data?.path ??
    res?.url ??
    res?.data?.url ??
    res?.data?.full_url;

  if (!path || typeof path !== "string") {
    throw new Error("Unexpected upload response shape");
  }

  return path;
}

export const uploadsApi = {
  upload: async (params: { file: File; type: UploadType }) => {
    const formData = new FormData();
    formData.append("file", params.file);
    formData.append("type", params.type);

    const { data } = await api.post<UploadResponseLoose>(
      "/admin/uploads",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    const path = extractUploadedPath(data);

    return { raw: data, path };
  },
};
