// Auth types
export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

// Profile types
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name: string | null;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'canceled' | 'expired';
  subscription_start_date: string;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}

// Connection types
export interface NotionConnection {
  id: string;
  user_id: string;
  name: string;
  notion_database_id: string;
  notion_workspace_name: string | null;
  status: 'active' | 'disconnected' | 'error';
  last_synced_at: string | null;
  sync_error: string | null;
  created_at: string;
  updated_at: string;
}

// API Key types
export interface APIKey {
  id: string;
  user_id: string;
  key_preview: string;
  name: string;
  last_used_at: string | null;
  created_at: string;
  revoked_at: string | null;
}

// API Usage types
export interface APIUsageRecord {
  id: string;
  user_id: string;
  connection_id: string | null;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status_code: number | null;
  response_time_ms: number | null;
  created_at: string;
}

// Schema Snapshot types
export interface SchemaSnapshot {
  id: string;
  user_id: string;
  connection_id: string;
  schema_data: Record<string, any>;
  snapshot_date: string;
  created_at: string;
}
