import { BugError } from "../types.js";
import { randomId } from "../utils.js";

interface ProxyRequest {
  method: string;
  path: string;
  statusCode: number;
  responseBody: string;
}

// Supabase 프록시를 통해 잡은 응답을 파싱
export function parseSupabaseResponse(req: ProxyRequest): BugError | null {
  if (req.statusCode < 400) return null;

  const { method, path, statusCode, responseBody } = req;

  let message = `${method} ${path}`;
  let detail = `${statusCode}`;

  try {
    const body = JSON.parse(responseBody);
    const hint = body.hint ?? body.message ?? body.error_description ?? body.error ?? "";
    const code = body.code ?? "";

    if (statusCode === 401) {
      detail = classifySupabase401(path, body);
    } else if (statusCode === 406) {
      detail = "406 Not Acceptable — Accept 헤더 누락 (supabase-js 버전 확인)";
    } else if (code === "42P01") {
      detail = `relation "${extractTableName(path)}" does not exist`;
    } else if (code === "42501" || hint.includes("permission denied")) {
      detail = "permission denied — RLS 정책 또는 role 확인";
    } else if (hint) {
      detail = `${statusCode} — ${hint}`;
    } else {
      detail = `${statusCode} ${JSON.stringify(body).slice(0, 100)}`;
    }
  } catch {
    detail = `${statusCode} ${responseBody.slice(0, 80)}`;
  }

  return {
    id: randomId(),
    source: "supabase",
    timestamp: new Date(),
    message,
    detail,
    resolved: false,
  };
}

function classifySupabase401(path: string, body: Record<string, unknown>): string {
  const table = extractTableName(path);
  const msg = String(body.message ?? body.error ?? "").toLowerCase();

  if (msg.includes("jwt") || msg.includes("token")) {
    return "401 Unauthorized — JWT 토큰 만료 또는 잘못된 ANON_KEY";
  }
  if (table) {
    return `401 Unauthorized — "${table}" 테이블 RLS 정책 없음 (또는 anon role 차단)`;
  }
  return "401 Unauthorized — 인증 필요 또는 RLS 정책 확인";
}

function extractTableName(path: string): string | null {
  // /rest/v1/boards?select=* → "boards"
  const match = path.match(/\/rest\/v1\/([^?/]+)/);
  return match ? match[1] : null;
}
