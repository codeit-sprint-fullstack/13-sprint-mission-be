import { z } from "zod";

export const presignedUploadSchema = z.object({
  files: z
    .array(
      z.object({
        filename: z
          .string({ error: "파일명은 필수입니다." })
          .trim()
          .min(1, "파일명은 필수입니다."),
        // Presigned URL 방식은 파일이 서버를 거치지 않으므로 서버가 내용을 검사할 수 없다.
        // 대신 서명에 Content-Type을 고정해 두고, 여기서 이미지인지만 미리 걸러낸다.
        contentType: z
          .string({ error: "contentType은 필수입니다." })
          .trim()
          .regex(/^image\//, "이미지 파일만 업로드할 수 있습니다."),
      })
    )
    .min(1, "업로드할 파일 정보가 필요합니다.")
    .max(3, "이미지는 최대 3장까지 가능합니다."),
});

export type PresignedUploadInput = z.infer<typeof presignedUploadSchema>;
