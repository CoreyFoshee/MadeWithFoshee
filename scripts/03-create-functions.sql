-- Create is_owner function for RLS policies
create or replace function is_owner() returns boolean
language sql stable as $$
  select exists (select 1 from profiles p where p.user_id = auth.uid() and p.role='owner');
$$;

-- Overlap helper functions
create or replace function booking_overlap(p_listing uuid, p_start date, p_end date)
returns table (id uuid) language sql as $$
  select id from bookings
  where listing_id=p_listing
    and status in ('approved','pending')
    and daterange(start_date,end_date,'[]') && daterange(p_start,p_end,'[]')
  limit 1;
$$;

create or replace function blackout_overlap(p_listing uuid, p_start date, p_end date)
returns table (id uuid) language sql as $$
  select id from blackout_dates
  where listing_id=p_listing
    and daterange(start_date,end_date,'[]') && daterange(p_start,p_end,'[]')
  limit 1;
$$;
