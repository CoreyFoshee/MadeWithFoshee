-- Insert Lake House listing
insert into listings (name, description, max_guests, min_nights) values (
  'Lake House',
  'Beautiful lakefront property perfect for family getaways. Enjoy stunning water views, private dock, and peaceful surroundings.',
  10,
  2
);

-- Insert sample content blocks for homepage
insert into content_blocks (slug, type, data, position) values 
('home', 'hero', '{
  "title": "Made By Foshee",
  "subtitle": "Your family lake house awaits",
  "cta_text": "Request Dates",
  "background_image": "/images/lake-house-hero.jpg"
}', 1),
('home', 'highlights', '{
  "title": "Lake House Highlights",
  "items": [
    {"title": "Waterfront Views", "description": "Stunning lake views from every room"},
    {"title": "Private Dock", "description": "Your own dock for swimming and boating"},
    {"title": "Family Friendly", "description": "Perfect for gatherings of all ages"},
    {"title": "Peaceful Setting", "description": "Escape the city in nature"}
  ]
}', 2);
