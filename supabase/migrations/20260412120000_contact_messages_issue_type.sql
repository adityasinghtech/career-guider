-- Issue routing for contact form (nullable for legacy rows)
ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS issue_type text;

COMMENT ON COLUMN public.contact_messages.issue_type IS
  'quiz | login | result | career | other — mirrors PathFinder Contact page';
