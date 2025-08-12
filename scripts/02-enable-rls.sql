-- Enable Row Level Security on all tables
alter table profiles enable row level security;
alter table listings enable row level security;
alter table bookings enable row level security;
alter table blackout_dates enable row level security;
alter table site_settings enable row level security;
alter table content_blocks enable row level security;
