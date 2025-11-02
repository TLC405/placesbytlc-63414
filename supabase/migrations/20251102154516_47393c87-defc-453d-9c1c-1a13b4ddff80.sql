-- Force types regeneration by adding a comment
-- This migration triggers the Supabase types to regenerate

COMMENT ON TABLE public.app_settings IS 'Application-wide settings managed by admins';
COMMENT ON TABLE public.app_updates IS 'Changelog and app updates tracking';
COMMENT ON TABLE public.user_roles IS 'User role assignments for access control';