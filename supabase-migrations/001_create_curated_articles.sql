-- Create curated_articles table for admin news curation
CREATE TABLE curated_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  image_url TEXT,
  issue TEXT NOT NULL CHECK (issue IN ('ICE_RAIDS', 'CLIMATE')),
  priority INTEGER DEFAULT 0 CHECK (priority IN (0, 1)), -- 0=regular, 1=featured
  source TEXT, -- 'guardian', 'rss', 'manual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_curated_articles_issue_priority ON curated_articles(issue, priority DESC);
CREATE INDEX idx_curated_articles_created_at ON curated_articles(created_at DESC);

-- Enable RLS
ALTER TABLE curated_articles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admin access (using service role)
-- This will be handled by supabaseAdmin client
