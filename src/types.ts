export type ErrorSource = "nextjs" | "supabase" | "vercel";

export interface BugError {
  id: string;
  source: ErrorSource;
  timestamp: Date;
  message: string;
  detail?: string;
  file?: string;
  line?: number;
  resolved: boolean;
}

export interface ProjectConfig {
  hasNextjs: boolean;
  hasSupabase: boolean;
  hasVercel: boolean;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  projectRoot: string;
}
