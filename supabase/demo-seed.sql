-- =====================================================================
--  OPTIONAL demo content — for your sales demo site only.
--  For a real client, skip this file; they fill everything in from /admin.
--  Re-running it wipes and re-creates the demo content.
-- =====================================================================

delete from public.rooms;
delete from public.gallery_images;
delete from public.facilities;
delete from public.rules;
delete from public.notices;
delete from public.testimonials;
delete from public.faqs;

update public.site_settings set
  hostel_name   = 'The Purple Nest',
  hostel_type   = 'Student Hostel',
  tagline       = 'Safe, clean and homely stay for students in the heart of Kathmandu.',
  hero_slides   = '[
    {"image":"/images/hero-exterior.jpg","title":"Study hard, live easy","subtitle":"A safe, friendly home for students and professionals — located in peaceful Pilachhen, Lalitpur."},
    {"image":"/images/hero-room.jpg","title":"Homely Comfort in Kathmandu","subtitle":"Spacious, well-ventilated rooms with private study tables, daily cleaning and 24/7 solar hot water."},
    {"image":"/images/hero-rooftop.jpg","title":"Admissions open for 2026","subtitle":"Join our vibrant student community. Scenic rooftop lounge, quiet study hall & fresh homely meals."}
  ]'::jsonb,
  about_title   = 'Namaste!',
  about_text    = 'The Purple Nest Hostel has been designed to provide ambitious students and working professionals with a peaceful, safe, and vibrant home away from home in Pilachhen, Lalitpur.

Our premises feature 24/7 CCTV surveillance, biometric security, dedicated in-house warden supervision, and daily room housekeeping. Fresh, hygienic meals prepared in our modern kitchen ensure students stay energized and healthy throughout their academic journey.',
  about_image   = '/images/hero-exterior.jpg',
  established_year = 2015,
  phone         = '+977 976-1158651',
  phone_alt     = null,
  whatsapp      = '9779761158651',
  email         = 'stayatthepurplenest@gmail.com',
  address       = 'Sinpa Marg, Pilachhen, Lalitpur 44700, Nepal',
  map_embed_url = 'https://www.google.com/maps?q=Sinpa+Marg,+Pilachhen,+Lalitpur+44700,+Nepal&output=embed',
  office_hours  = 'Every day, 7:00 AM – 8:00 PM',
  facebook_url  = 'https://www.facebook.com/p/The-Purple-Nest-61589625489923/',
  instagram_url = 'https://instagram.com',
  admission_open = true,
  promo_title   = 'Homely Meals Cooked Daily',
  promo_subtitle = 'Fresh dal bhat, snacks and dinner — cooked daily in our own kitchen and included in your fee',
  promo_image   = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1920&q=80',
  promo_badge_top = 'meals',
  promo_badge_value = '4 / day',
  promo_button_label = 'See food menu',
  promo_button_link = '#menu',
  theme_color   = '#43106c',
  secondary_color = '#8b5cf6',
  price_note    = 'Fees include 4 daily meals, high-speed Wi-Fi, electricity, solar hot water, and laundry.',
  meta_description = 'The Purple Nest Hostel, Kathmandu — safe, clean rooms with homely meals, Wi-Fi and 24/7 security. Admissions open.',
  updated_at    = now()
where id = 1;

insert into public.rooms (name, description, beds_per_room, total_beds, available_beds, monthly_fee, admission_fee, features, images, sort_order) values
 ('Single Seater', 'A private room for students who want full focus. Study table, chair, wardrobe and a large window.', 1, 6, 1, 18000, 5000,
  array['Private room','Study table & chair','Wardrobe','Attached bathroom'],
  array['https://images.unsplash.com/photo-1588939349575-7ab15c8bd1ef?w=1200&q=80'], 1),
 ('Double Seater', 'Share with one roommate. Each student gets a bed, study table and wardrobe.', 2, 20, 4, 14500, 5000,
  array['Two beds','Study tables','Wardrobes','Common bathroom'],
  array['https://images.unsplash.com/photo-1636917754428-60ece5e521df?w=1200&q=80'], 2),
 ('Triple Seater', 'Our most popular choice — spacious, sunny and budget friendly.', 3, 30, 7, 12500, 5000,
  array['Three beds','Study tables','Shoe rack','Balcony'],
  array['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80'], 3),
 ('Four Seater', 'The most affordable option, ideal for friends joining together.', 4, 24, 0, 11000, 5000,
  array['Four beds','Study tables','Wardrobes','Common bathroom'],
  array['https://images.unsplash.com/photo-1709805619372-40de3f158e83?w=1200&q=80'], 4);

insert into public.gallery_images (image_url, caption, category, sort_order) values
 ('https://images.unsplash.com/photo-1721743169043-dda0212ce3d4?w=1200&q=80', 'Double seater room', 'Rooms', 1),
 ('https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=1200&q=80', 'Friday momo night', 'Dining', 2),
 ('https://images.unsplash.com/photo-1766506075730-f1d871df530a?w=1200&q=80', 'Study hall', 'Study', 3),
 ('https://images.unsplash.com/photo-1768289269971-6171457bed13?w=1200&q=80', 'Triple seater room', 'Rooms', 4),
 ('https://images.unsplash.com/photo-1698844035759-099a24409d93?w=1200&q=80', 'Dining hall', 'Dining', 5),
 ('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80', 'Weekend outing', 'Life', 6),
 ('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80', 'Four seater room', 'Rooms', 7),
 ('https://images.unsplash.com/photo-1552858725-a019f14f0cec?w=1200&q=80', 'Corridor', 'Building', 8),
 ('https://images.unsplash.com/photo-1680993032090-1ef7ea9b51e5?w=1200&q=80', 'Dal bhat thali', 'Dining', 9),
 ('https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=80', 'Group study', 'Study', 10),
 ('https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=80', 'Our neighbourhood', 'Building', 11),
 ('https://images.unsplash.com/photo-1723258343563-7d71a55d6dfa?w=1200&q=80', 'Room with a view', 'Rooms', 12);

insert into public.facilities (title, slug, description, icon, image_url, content, highlights, sort_order) values
 ('High-speed Wi-Fi', 'high-speed-wifi', 'Dedicated dual-band fibre on every floor for online classes & study.', 'wifi',
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80',
  'In modern college education, reliable internet is as essential as textbooks. At The Purple Nest, we have installed enterprise-grade dual-band optical fibre connections with separate Wi-Fi access points on every single residential floor. Redundant dual ISP backup guarantees maximum uptime.',
  array['Dual-band 5 GHz & 2.4 GHz coverage','Separate dedicated router on every floor','Redundant dual ISP backup line','Inverter battery backup keeps Wi-Fi active 24/7'], 1),
 ('4 Homely Meals', 'homely-meals', 'Fresh morning tea, dal bhat lunch, snacks and dinner cooked daily.', 'utensils',
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&q=80',
  'Nothing replaces the comfort and nutrition of home-cooked food while living away from family. Our in-house kitchen prepares four wholesome meals every day using fresh market produce, premium basmati rice, and pure cooking oil.',
  array['4 meals daily (Breakfast, Lunch, Snacks, Dinner)','Chicken curry twice a week & paneer options','Fresh seasonal vegetables and green leafy saag','Saturday special Momo feast'], 2),
 ('24/7 Security & CCTV', 'security-cctv', 'CCTV cameras, biometric entry, night guard and on-site warden.', 'shield',
  '/images/hero-exterior.jpg',
  'Safety and peace of mind are our absolute top priority. The Purple Nest is equipped with an integrated multi-tier security framework to protect our residents day and night with full-time on-site warden.',
  array['HD CCTV cameras across all corridors and gates','Biometric fingerprint entrance security','Strict gate closing at 8:30 PM','Resident on-site warden available 24/7'], 3),
 ('Solar & Geyser Hot Water', 'solar-hot-water', 'Solar and geyser hot water available all year round.', 'droplets',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80',
  'Kathmandu mornings in winter can be brutally cold. We have engineered a dual solar and electric geyser heating infrastructure that ensures instant hot water is on tap 24 hours a day, 365 days a year.',
  array['High-capacity rooftop solar thermal system','Automated electric geyser backup for winter','Available 24/7 across all bathrooms'], 4),
 ('Quiet Study Hall', 'study-hall', 'A quiet, well-lit study hall open until midnight.', 'book',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80',
  'Our dedicated ground-floor Study Hall provides a serene, noise-free sanctuary designed specifically for intense academic focus with personal study carrels, glare-free lamps, and device power sockets.',
  array['Strict silence policy enforced','Individual study desks with personal LED lamps','Multiple charging points per desk','Open until 12:00 Midnight every night'], 5),
 ('Rooftop Laundry', 'rooftop-laundry', 'Washing machines and sunny rooftop clothes drying terrace.', 'shirt',
  '/images/hero-rooftop.jpg',
  'Residents have access to modern automatic washing machines on designated weekly schedules, along with extensive covered and open-air drying clotheslines overlooking the scenic Kathmandu valley.',
  array['Fully automatic multi-cycle washing machines','Expansive open and covered clothes drying terrace','Designated weekly washing schedule'], 6),
 ('Inverter Power Backup', 'power-backup', 'Inverter backup keeps lights and Wi-Fi on without interruption.', 'zap',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
  'Whenever the municipal electricity grid goes down, our heavy duty pure sine-wave inverter switches over seamlessly within milliseconds to keep lights, study desks and Wi-Fi routers powered.',
  array['Pure sine-wave heavy duty inverter system','Seamless millisecond automatic switchover','Wi-Fi routers remain active during outages'], 7),
 ('RO Filtered Water', 'ro-drinking-water', 'Filtered RO purified drinking water on every floor.', 'glass',
  'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=1200&q=80',
  'We have installed commercial-grade 5-stage Reverse Osmosis (RO) with Ultraviolet (UV) water filtration dispensers on every floor. Students can refill bottles anytime with hot and normal temperature options.',
  array['5-stage RO + UV + TDS filtration technology','Dedicated water stations on every single floor','Instant Hot and Normal temperature taps'], 8);

insert into public.rules (category, content, sort_order) values
 ('General', 'The main gate closes at 8:30 PM. Late entry requires prior permission from the warden.', 1),
 ('General', 'Visitors are allowed only in the reception area, between 9:00 AM and 6:00 PM.', 2),
 ('General', 'Smoking, alcohol and drugs are strictly prohibited on the premises.', 3),
 ('Rooms', 'Keep your room clean and tidy. Rooms are inspected every Saturday.', 4),
 ('Rooms', 'Switch off lights, fans and chargers when leaving the room.', 5),
 ('Rooms', 'Cooking inside rooms is not allowed.', 6),
 ('Fees', 'Monthly fees must be paid by the 10th of each month.', 7),
 ('Fees', 'One month''s notice is required before leaving the hostel. The security deposit is refunded after clearance.', 8),
 ('Study', 'Silence hours are 9:00 PM to 6:00 AM. Please respect others'' study time.', 9);

insert into public.notices (title, body, is_pinned, show_as_popup, popup_until, published_at, image_url) values
 ('Admissions open for the new session',
  'Admissions are now open for the new academic session. Limited beds are available in double and triple seater rooms. Visit the hostel between 7 AM and 8 PM or call us to book a visit. Early admissions get 10% off the admission fee.',
  true, true, now() + interval '30 days', now(), 'https://images.unsplash.com/photo-1758270705555-015de348a48a?w=1200&q=80'),
 ('Dashain holiday schedule',
  'The hostel kitchen will remain closed from Ghatasthapana to Tika. Students staying during the holidays should inform the warden by the end of this week.',
  false, false, null, now() - interval '3 days', 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=1200&q=80'),
 ('Water tank cleaning on Saturday',
  'Water supply will be off from 10 AM to 2 PM this Saturday for tank cleaning. Please store water in advance.',
  false, false, null, now() - interval '8 days', null);

update public.meal_menu set breakfast = 'Tea, biscuits', lunch = 'Dal bhat, seasonal veg, pickle', snacks = 'Chowmein', dinner = 'Dal bhat, chicken curry' where day = 0;
update public.meal_menu set breakfast = 'Tea, bread & egg', lunch = 'Dal bhat, aloo tama, pickle', snacks = 'Chiura, aloo', dinner = 'Dal bhat, mixed veg' where day = 1;
update public.meal_menu set breakfast = 'Tea, biscuits', lunch = 'Dal bhat, saag, pickle', snacks = 'Samosa', dinner = 'Dal bhat, egg curry' where day = 2;
update public.meal_menu set breakfast = 'Tea, puri tarkari', lunch = 'Dal bhat, cauliflower curry', snacks = 'Noodles', dinner = 'Dal bhat, paneer' where day = 3;
update public.meal_menu set breakfast = 'Tea, bread & jam', lunch = 'Dal bhat, rajma, pickle', snacks = 'Chana chatpate', dinner = 'Dal bhat, chicken curry' where day = 4;
update public.meal_menu set breakfast = 'Tea, biscuits', lunch = 'Dal bhat, mushroom curry', snacks = 'Pakoda', dinner = 'Dal bhat, mixed veg' where day = 5;
update public.meal_menu set breakfast = 'Tea, sel roti', lunch = 'Khana set, curd', snacks = 'Momo', dinner = 'Fried rice, soup' where day = 6;

insert into public.testimonials (name, role, message, rating, photo_url, sort_order) values
 ('Aayush Shrestha', 'BBS student, Shanker Dev Campus', 'Clean rooms, good food and very close to my college. The warden dai is strict but caring — my parents are happy.', 5, 'https://images.unsplash.com/photo-1611181355758-089959e2cfb2?w=600&q=80', 1),
 ('Sujan Tamang', '+2 Science student', 'The study room is quiet until midnight and the Wi-Fi never drops. Best hostel I have stayed in Kathmandu.', 5, 'https://images.unsplash.com/photo-1761963108315-739eb365d446?w=600&q=80', 2),
 ('Bikash Adhikari', 'Loksewa aspirant', 'Homely dal bhat twice a day and hot water even in winter. Great value for the price.', 4, 'https://images.unsplash.com/photo-1625241152315-4a698f74ceb7?w=600&q=80', 3);

insert into public.faqs (question, answer, sort_order) values
 ('What is included in the monthly fee?', 'The monthly fee includes your bed, three meals a day, Wi-Fi, water, electricity and room cleaning. Laundry detergent and personal items are not included.', 1),
 ('Is there an admission fee or security deposit?', 'Yes. A one-time admission fee is charged when you join, plus a refundable security deposit equal to one month''s fee.', 2),
 ('Can parents visit?', 'Of course. Parents and guardians are welcome any day between 9 AM and 6 PM.', 3),
 ('How do I book a bed?', 'Fill in the enquiry form on this page or call us. We will confirm availability and arrange a visit before you join.', 4),
 ('What documents are needed for admission?', 'A copy of your citizenship or college ID, two passport-size photos and your guardian''s contact number.', 5);
