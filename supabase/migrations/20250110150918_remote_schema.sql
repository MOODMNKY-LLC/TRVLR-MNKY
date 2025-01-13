CREATE INDEX idx_bungie_tokens_membership_id ON public.bungie_tokens USING btree (membership_id);

CREATE INDEX idx_bungie_tokens_user_id ON public.bungie_tokens USING btree (user_id);

create policy "Users can only access their own tokens"
on "public"."bungie_tokens"
as permissive
for all
to public
using ((auth.uid() = user_id));



