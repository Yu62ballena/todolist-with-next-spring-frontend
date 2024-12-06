import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "ファイルがアップロードされていません。" }, { status: 400 });
    }

    // ファイル名をユニークに
    const uniqueId = uuidv4();
    const extension = path.extname(file.name);
    const filename = `${uniqueId}${extension}`;

    // public/ uploadに保存
    const publicPath = path.join(process.cwd(), "public/uploads");
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(`${publicPath}/${filename}`, buffer);

    // クライアントで使用する相対パスを返す
    const relativePath = `/uploads/${filename}`;
    return NextResponse.json({ path: relativePath });
  } catch (error) {
    console.error("アップロードエラー：", error);
    return NextResponse.json({ error: "ファイルのアップロードに失敗しました。" }, { status: 500 });
  }
}
