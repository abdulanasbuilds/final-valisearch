ALTER TABLE analysis ADD COLUMN IF NOT EXISTS kanban_state JSONB DEFAULT '[]'::jsonb;

ALTER TABLE analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can update kanban state on own analysis"
  ON analysis
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
