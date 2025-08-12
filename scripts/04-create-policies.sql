-- RLS Policies

-- Listings policies
create policy "everyone read listings" on listings for select using (true);

-- Profiles policies  
create policy "profiles self/owner" on profiles for select using (auth.uid()=user_id or is_owner());

-- Bookings policies
create policy "bookings read" on bookings for select using (true);
create policy "bookings insert self" on bookings for insert with check (user_id=auth.uid());
create policy "bookings update/delete owner" on bookings for update using (is_owner());

-- Blackout dates policies
create policy "blackout read" on blackout_dates for select using (true);
create policy "blackout write owner" on blackout_dates for all using (is_owner()) with check (is_owner());

-- Site settings policies
create policy "cms read" on site_settings for select using (true);
create policy "cms write owner" on site_settings for all using (is_owner()) with check (is_owner());

-- Content blocks policies
create policy "blocks read" on content_blocks for select using (true);
create policy "blocks write owner" on content_blocks for all using (is_owner()) with check (is_owner());
