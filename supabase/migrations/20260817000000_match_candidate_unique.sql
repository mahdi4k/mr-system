-- ============================================================================
-- Rigora catalog sync follow-up: unique constraint for match candidates
--
-- The initial catalog migration created only a non-unique index on
-- torob_match_candidates. The application upserts candidates keyed by
-- (candidate_torob_product_id, product_id, part_type), so a real unique
-- constraint is required for PostgREST onConflict to behave correctly.
-- ============================================================================

-- A candidate is uniquely identified by the Torob product plus the catalog
-- product it was proposed for.
alter table public.torob_match_candidates
  drop constraint if exists torob_match_candidates_product_key;

create unique index if not exists torob_match_candidates_product_key
  on public.torob_match_candidates (candidate_torob_product_id, product_id, part_type);
