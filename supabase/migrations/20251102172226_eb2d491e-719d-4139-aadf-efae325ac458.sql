-- Add 'tester' role to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'tester';

-- Function to assign tester role (admin use only)
CREATE OR REPLACE FUNCTION assign_tester_role(user_email TEXT)
RETURNS void AS $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, 'tester'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;