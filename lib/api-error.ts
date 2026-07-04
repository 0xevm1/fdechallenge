import { AirtableError } from "@/lib/airtable";

/**
 * Maps a caught error to a clean JSON error response.
 * Only our own constructed messages are surfaced — never Airtable's raw
 * response body or anything that could contain the PAT.
 */
export function errorResponse(error: unknown): Response {
  if (error instanceof AirtableError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("Unexpected API error:", error);
  return Response.json({ error: "Internal server error." }, { status: 500 });
}
