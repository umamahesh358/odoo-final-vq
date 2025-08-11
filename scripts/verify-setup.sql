-- Verify that all tables exist and have the correct structure
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'venues', 'bookings', 'reviews', 'venue_availability')
ORDER BY tablename;

-- Verify that all tables exist and have data
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'venues', 'bookings', 'reviews', 'venue_availability')
ORDER BY tablename;

-- Check row counts in each table
SELECT 'venues' as table_name, COUNT(*) as row_count FROM public.venues
UNION ALL
SELECT 'venue_availability' as table_name, COUNT(*) as row_count FROM public.venue_availability
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as row_count FROM public.profiles
UNION ALL
SELECT 'bookings' as table_name, COUNT(*) as row_count FROM public.bookings
UNION ALL
SELECT 'reviews' as table_name, COUNT(*) as row_count FROM public.reviews
ORDER BY table_name;

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'venues', 'bookings', 'reviews', 'venue_availability')
ORDER BY tablename;

-- Verify policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public';

-- Verify sample venue data
SELECT 
  name,
  location,
  rating,
  price_per_hour,
  array_length(sports, 1) as sports_count,
  array_length(amenities, 1) as amenities_count
FROM public.venues
ORDER BY rating DESC
LIMIT 5;

-- Check venue availability data
SELECT 
  v.name,
  COUNT(va.id) as availability_slots
FROM public.venues v
LEFT JOIN public.venue_availability va ON v.id = va.venue_id
GROUP BY v.id, v.name
ORDER BY v.name;

-- Check if functions exist
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('handle_new_user', 'generate_booking_id');

-- Check if triggers exist
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
