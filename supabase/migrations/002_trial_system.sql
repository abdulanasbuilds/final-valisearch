ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_trial_active BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS billing_period TEXT DEFAULT 'monthly'
    CHECK (billing_period IN ('monthly', 'annual'));

-- Update signup trigger for reverse trial
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  trial_end TIMESTAMPTZ := NOW() + INTERVAL '7 days';
BEGIN
  INSERT INTO profiles (id, email, plan, trial_started_at, trial_ends_at, is_trial_active)
  VALUES (NEW.id, NEW.email, 'pro', NOW(), trial_end, TRUE)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO credits (user_id, balance)
  VALUES (NEW.id, 100)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO subscriptions (user_id, plan, status)
  VALUES (NEW.id, 'pro', 'trialing')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO credit_transactions (user_id, amount, reason)
  VALUES (NEW.id, 100, 'trial_bonus');

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION expire_trials()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE profiles
  SET plan = 'starter', is_trial_active = FALSE
  WHERE is_trial_active = TRUE AND trial_ends_at < NOW();

  UPDATE credits
  SET balance = LEAST(balance, 6)
  WHERE user_id IN (
    SELECT id FROM profiles WHERE is_trial_active = FALSE AND plan = 'starter'
  );

  UPDATE subscriptions
  SET plan = 'starter', status = 'active'
  WHERE status = 'trialing'
    AND user_id IN (
      SELECT id FROM profiles WHERE is_trial_active = FALSE
    );
END;
$$;
