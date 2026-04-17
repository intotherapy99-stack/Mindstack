import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ── Environment ──────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// ── Clients ──────────────────────────────────────────────────────

/**
 * Server-side admin client with service-role privileges.
 * Use for file uploads, bucket management, and any operation that
 * needs to bypass Row Level Security.
 *
 * NEVER expose this client to the browser.
 */
export const supabaseAdmin: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

/**
 * Browser-safe client using the anonymous key.
 * Use for presigned URLs and any client-side operations
 * that respect Row Level Security.
 */
export const supabaseClient: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

// ── Types ────────────────────────────────────────────────────────
interface UploadResult {
  url: string;
  path: string;
}

// ── Helpers ──────────────────────────────────────────────────────

/**
 * Upload a file to a Supabase Storage bucket via the admin client.
 *
 * @param bucket      - Storage bucket name
 * @param path        - Destination path within the bucket (e.g. "invoices/abc.pdf")
 * @param file        - File contents as a Buffer
 * @param contentType - MIME type (e.g. "application/pdf")
 * @returns Object with the public URL and storage path
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: Buffer,
  contentType: string,
): Promise<UploadResult> {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error("[supabase] upload failed:", error.message);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return { url: publicUrl, path };
}

/**
 * Generate a signed (time-limited) URL for a private file.
 *
 * @param bucket    - Storage bucket name
 * @param path      - File path within the bucket
 * @param expiresIn - Seconds until the URL expires (default: 3600 = 1 hour)
 * @returns Signed URL string
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600,
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data?.signedUrl) {
    console.error("[supabase] signed URL failed:", error?.message);
    throw new Error(
      `Signed URL failed: ${error?.message || "No URL returned"}`,
    );
  }

  return data.signedUrl;
}

/**
 * Delete a file from a Supabase Storage bucket.
 *
 * @param bucket - Storage bucket name
 * @param path   - File path within the bucket
 */
export async function deleteFile(
  bucket: string,
  path: string,
): Promise<void> {
  const { error } = await supabaseAdmin.storage.from(bucket).remove([path]);

  if (error) {
    console.error("[supabase] delete failed:", error.message);
    throw new Error(`Delete failed: ${error.message}`);
  }
}
