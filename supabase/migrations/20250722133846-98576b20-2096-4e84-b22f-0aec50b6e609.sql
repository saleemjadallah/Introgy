-- Fix missing RLS policies for relationship tables

-- Enable RLS on tables that don't have it yet
ALTER TABLE public.relationship_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_nurturing_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_communication_prefs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for relationship_contexts
CREATE POLICY "Users can view their own relationship contexts"
ON public.relationship_contexts
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_contexts.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own relationship contexts"
ON public.relationship_contexts
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_contexts.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can update their own relationship contexts"
ON public.relationship_contexts
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_contexts.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own relationship contexts"
ON public.relationship_contexts
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_contexts.relationship_id 
  AND relationships.user_id = auth.uid()
));

-- Create RLS policies for relationship_interactions
CREATE POLICY "Users can view their own relationship interactions"
ON public.relationship_interactions
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_interactions.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own relationship interactions"
ON public.relationship_interactions
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_interactions.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can update their own relationship interactions"
ON public.relationship_interactions
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_interactions.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own relationship interactions"
ON public.relationship_interactions
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_interactions.relationship_id 
  AND relationships.user_id = auth.uid()
));

-- Create RLS policies for relationship_interests
CREATE POLICY "Users can view their own relationship interests"
ON public.relationship_interests
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_interests.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own relationship interests"
ON public.relationship_interests
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_interests.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can update their own relationship interests"
ON public.relationship_interests
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_interests.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own relationship interests"
ON public.relationship_interests
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_interests.relationship_id 
  AND relationships.user_id = auth.uid()
));

-- Create RLS policies for relationship_memories
CREATE POLICY "Users can view their own relationship memories"
ON public.relationship_memories
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_memories.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own relationship memories"
ON public.relationship_memories
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_memories.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can update their own relationship memories"
ON public.relationship_memories
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_memories.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own relationship memories"
ON public.relationship_memories
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_memories.relationship_id 
  AND relationships.user_id = auth.uid()
));

-- Create RLS policies for relationship_nurturing_status
CREATE POLICY "Users can view their own relationship nurturing status"
ON public.relationship_nurturing_status
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_nurturing_status.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own relationship nurturing status"
ON public.relationship_nurturing_status
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_nurturing_status.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can update their own relationship nurturing status"
ON public.relationship_nurturing_status
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_nurturing_status.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own relationship nurturing status"
ON public.relationship_nurturing_status
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_nurturing_status.relationship_id 
  AND relationships.user_id = auth.uid()
));

-- Create RLS policies for relationship_social_profiles
CREATE POLICY "Users can view their own relationship social profiles"
ON public.relationship_social_profiles
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_social_profiles.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own relationship social profiles"
ON public.relationship_social_profiles
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_social_profiles.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can update their own relationship social profiles"
ON public.relationship_social_profiles
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_social_profiles.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own relationship social profiles"
ON public.relationship_social_profiles
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_social_profiles.relationship_id 
  AND relationships.user_id = auth.uid()
));

-- Create RLS policies for relationship_topics
CREATE POLICY "Users can view their own relationship topics"
ON public.relationship_topics
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_topics.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own relationship topics"
ON public.relationship_topics
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_topics.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can update their own relationship topics"
ON public.relationship_topics
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_topics.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own relationship topics"
ON public.relationship_topics
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_topics.relationship_id 
  AND relationships.user_id = auth.uid()
));

-- Create RLS policies for relationship_communication_prefs
CREATE POLICY "Users can view their own relationship communication prefs"
ON public.relationship_communication_prefs
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_communication_prefs.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own relationship communication prefs"
ON public.relationship_communication_prefs
FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_communication_prefs.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can update their own relationship communication prefs"
ON public.relationship_communication_prefs
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_communication_prefs.relationship_id 
  AND relationships.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own relationship communication prefs"
ON public.relationship_communication_prefs
FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.relationships 
  WHERE relationships.id = relationship_communication_prefs.relationship_id 
  AND relationships.user_id = auth.uid()
));

-- Fix database function security by updating existing functions with proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, phone, provider)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', 'Guest User'),
    new.email,
    new.phone,
    new.raw_user_meta_data->>'provider'
  );
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.upgrade_to_premium(plan_type text DEFAULT 'monthly'::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  new_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Set expiration based on plan type
  IF plan_type = 'monthly' THEN
    new_expires_at := now() + INTERVAL '1 month';
  ELSIF plan_type = 'yearly' THEN
    new_expires_at := now() + INTERVAL '1 year';
  ELSE
    new_expires_at := now() + INTERVAL '1 month';
  END IF;

  -- Insert or update subscription
  INSERT INTO public.premium_subscriptions (user_id, plan_type, expires_at)
  VALUES (auth.uid(), plan_type, new_expires_at)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    is_active = TRUE,
    plan_type = EXCLUDED.plan_type,
    expires_at = EXCLUDED.expires_at,
    updated_at = now()
  WHERE public.premium_subscriptions.user_id = EXCLUDED.user_id;
  
  RETURN TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_waiting_list_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;