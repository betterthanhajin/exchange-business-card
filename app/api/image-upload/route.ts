// app/api/image-upload/route.ts
import { uploadImageFile } from "@/lib/storage/r2Client";

// Vercel에서 최대 30초 동안 API를 실행하도록 요청하는 상수
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    // FormData에서 파일 추출
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    // 파일 업로드 처리
    const buffer = await file.arrayBuffer();
    const responseOfR2 = await uploadImageFile({
      buffer,
      folder: "my-melody-album-covers",
    });

    // 성공 응답 반환
    return Response.json({
      success: true,
      url: responseOfR2,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return Response.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
