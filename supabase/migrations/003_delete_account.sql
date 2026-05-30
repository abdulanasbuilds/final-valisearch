-- RPC to delete a user's account and all associated data
CREATE OR REPLACE FUNCTION delete_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the ID of the user executing the function
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Delete analysis progress
  DELETE FROM analysis_progress WHERE analysis_id IN (
    SELECT id FROM analysis WHERE user_id = v_user_id
  );

  -- 2. Delete analyses
  DELETE FROM analysis WHERE user_id = v_user_id;

  -- 3. Delete ideas
  DELETE FROM ideas WHERE user_id = v_user_id;

  -- 4. Delete credits
  DELETE FROM credits WHERE user_id = v_user_id;

  -- 5. Delete credit transactions
  DELETE FROM credit_transactions WHERE user_id = v_user_id;

  -- 6. Delete subscriptions
  DELETE FROM subscriptions WHERE user_id = v_user_id;

  -- 7. Delete profile (this might also be handled by auth cascade, but we do it explicitly)
  DELETE FROM profiles WHERE id = v_user_id;

  -- 8. Delete auth user (requires superuser/postgres role which SECURITY DEFINER provides if owned by postgres)
  -- Note: Depending on Supabase configuration, this might require the 'supabase_admin' role
  -- or we might need to delete from auth.users directly.
  DELETE FROM auth.users WHERE id = v_user_id;

END;
$$;
