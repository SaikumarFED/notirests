-- Supabase DB setup for NotiRest

-- 1. Create a table for Notion connections
CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  database_id TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on RLS for connections
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own connections
CREATE POLICY "Users can view their own connections" 
ON connections FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own connections
CREATE POLICY "Users can insert their own connections" 
ON connections FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own connections
CREATE POLICY "Users can delete their own connections" 
ON connections FOR DELETE 
USING (auth.uid() = user_id);


-- 2. Create a table for API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  preview TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on RLS for api_keys
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own api keys" 
ON api_keys FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own api keys" 
ON api_keys FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own api keys" 
ON api_keys FOR DELETE 
USING (auth.uid() = user_id);


-- 3. Create a table for user Notion auth tokens (optional but required for OAuth)
CREATE TABLE notion_workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  access_token TEXT NOT NULL,
  workspace_id TEXT,
  workspace_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on RLS
ALTER TABLE notion_workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own workspace auth" 
ON notion_workspaces FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workspace auth" 
ON notion_workspaces FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workspace auth" 
ON notion_workspaces FOR UPDATE 
USING (auth.uid() = user_id);
