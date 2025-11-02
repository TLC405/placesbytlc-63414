-- Force complete types regeneration with structural change
-- Add a new dummy table and immediately drop it to trigger type generation

CREATE TABLE IF NOT EXISTS public._force_types_refresh (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now()
);

-- Drop it immediately
DROP TABLE IF EXISTS public._force_types_refresh;

-- Also refresh all table comments to ensure types pick up changes
COMMENT ON TABLE public.profiles IS 'User profile information';
COMMENT ON TABLE public.user_analytics IS 'User engagement and analytics data';
COMMENT ON TABLE public.discovered_places IS 'Curated places for dates and activities';