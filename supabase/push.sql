-- Padel+ Joueur : notifications « C'est à toi ! » et rappel de la veille (n°673)
-- À exécuter UNE fois dans Supabase › SQL Editor, au moment de l'activation. Gratuit.

create table if not exists public.padel_push (
  endpoint text primary key,
  lic text not null,
  uid text,
  sub jsonb not null,
  created_at timestamptz default now()
);
alter table public.padel_push enable row level security;  -- aucune lecture publique

-- Le joueur (licence + code) enregistre son téléphone
create or replace function public.padel_push_sub(p_lic text, p_pin text, p_sub jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r jsonb; j record;
begin
  r := public.padel_joueur_check(p_lic, p_pin);
  if coalesce((r->>'ok')::boolean,false) is not true then return r; end if;
  select * into j from public.padel_joueur where lic = public.padel_lic_norm(p_lic) limit 1;
  insert into public.padel_push(endpoint, lic, uid, sub)
  values (p_sub->>'endpoint', j.lic, j.uid, p_sub)
  on conflict (endpoint) do update set lic = excluded.lic, uid = excluded.uid, sub = excluded.sub, created_at = now();
  return jsonb_build_object('ok', true);
end $$;
revoke all on function public.padel_push_sub(text,text,jsonb) from public;
grant execute on function public.padel_push_sub(text,text,jsonb) to anon, authenticated;

-- Rappel de la veille, chaque jour à 18h (heure de Paris = 17h UTC l'hiver) :
-- remplacer <CRON_SECRET> par le secret choisi à l'activation.
-- select cron.schedule('padel-veille','0 17 * * *',$$
--   select net.http_post(url:='https://nikfwvmrrytshvlrgqae.supabase.co/functions/v1/padel-push',
--     headers:='{"Content-Type":"application/json","x-cron":"<CRON_SECRET>"}'::jsonb,
--     body:='{"mode":"veille"}'::jsonb) $$);
