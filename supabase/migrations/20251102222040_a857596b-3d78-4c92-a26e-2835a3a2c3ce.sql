-- Remove public read access from app_settings table
DROP POLICY IF EXISTS "Anyone can read app settings" ON public.app_settings;

-- Allow only admins to read app settings
CREATE POLICY "Only admins can read app settings"
ON public.app_settings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));