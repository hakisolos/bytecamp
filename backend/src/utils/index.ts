import db from "../config/database";
import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";
function getRank(expoints: number) {
  if (expoints >= 100) return "legend";
  if (expoints >= 80) return "diamond";
  if (expoints >= 60) return "platinum";
  if (expoints >= 40) return "gold";
  if (expoints >= 20) return "silver";
  return "bronze";
}

export async function enrollCourse(email: string, courseid: string) {
  const query = `
    UPDATE users
    SET courses = courses || jsonb_build_array(jsonb_build_object('courseid', $2, 'completed', false))
    WHERE email = $1
      AND NOT EXISTS (
        SELECT 1 FROM jsonb_array_elements(courses) elem
        WHERE elem->>'courseid' = $2
      )
    RETURNING courses;
  `;
  const res = await db.query(query, [email, courseid]);
  return res.rows[0]?.courses;
}

export async function completeCourse(email: string, courseid: string, exp: number) {
  const updateCourseQuery = `
    UPDATE users
    SET courses = (
      SELECT jsonb_agg(
        CASE
          WHEN elem->>'courseid' = $2 THEN elem || jsonb_build_object('completed', true)
          ELSE elem
        END
      )
      FROM jsonb_array_elements(courses) elem
    ),
    expoints = expoints + $3
    WHERE email = $1
    RETURNING expoints;
  `;
  const res = await db.query(updateCourseQuery, [email, courseid, exp]);
  const newExp = res.rows[0]?.expoints || 0;
  const level = Math.floor(Math.sqrt(newExp / 50));
  const rank = getRank(newExp);
  await db.query(`UPDATE users SET level = $2, rank = $3 WHERE email = $1`, [email, level, rank]);
  return { expoints: newExp, level, rank };
}

export async function addExpoints(email: string, points: number) {
  const res = await db.query(
    `UPDATE users SET expoints = expoints + $2 WHERE email = $1 RETURNING expoints`,
    [email, points]
  );
  const newExp = res.rows[0]?.expoints || 0;
  const level = Math.floor(Math.sqrt(newExp / 50));
  const rank = getRank(newExp);
  await db.query(`UPDATE users SET level = $2, rank = $3 WHERE email = $1`, [email, level, rank]);
  return { expoints: newExp, level, rank };
}

export async function getCourseProgress(email: string) {
  const res = await db.query(`SELECT courses FROM users WHERE email = $1`, [email]);
  return res.rows[0]?.courses || [];
}


export async function uploadToCdn(
  bufferOrPath: Buffer | string,
  type: "normal" | "temp" = "normal"
): Promise<string> {
  try {
    const formData = new FormData();

    if (Buffer.isBuffer(bufferOrPath)) {
      const fileType = await fileTypeFromBuffer(bufferOrPath);
      const fileName = fileType ? `file.${fileType.ext}` : "file";
      formData.append("file", bufferOrPath, fileName);
    } else if (typeof bufferOrPath === "string" && fs.existsSync(bufferOrPath)) {
      const fileName = bufferOrPath.split("/").pop() || "file";
      formData.append("file", fs.createReadStream(bufferOrPath), fileName);
    } else {
      throw new Error("Invalid file input. Provide a buffer or a valid file path.");
    }

    const uploadUrl =
      type === "normal"
        ? "https://cdn.kord.live/upload"
        : "https://cdn.kord.live/temp-upload";

    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "X-API-Key": "kordAi.key",
        ...formData.getHeaders()
      },
      timeout: 30000
    });

    const filename = response.data?.data?.filename;
    if (!filename) {
      throw new Error("Upload failed: No filename returned from server.");
    }

    return `https://cdn.kord.live/serve/${filename}`;
  } catch (error: any) {
    throw new Error(`Upload error: ${error.response?.data || error.message}`);
  }
}
