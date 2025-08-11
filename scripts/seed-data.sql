-- Insert sample venues
INSERT INTO public.venues (name, location, description, image_url, rating, review_count, price_per_hour, amenities, sports, contact_phone, contact_email, address) VALUES
('Ace Sports Complex', 'Koramangala, Bangalore', 'Modern sports complex with state-of-the-art facilities', '/modern-sports-complex.png', 4.8, 124, 800, ARRAY['Parking', 'Wifi', 'Washroom', 'Equipment'], ARRAY['Basketball', 'Tennis', 'Badminton'], '+91 98765 43210', 'info@acesports.com', '123 Koramangala Ring Road, Bangalore'),
('Green Valley Courts', 'Indiranagar, Bangalore', 'Premium outdoor courts with professional lighting', '/outdoor-tennis-courts.png', 4.6, 89, 600, ARRAY['Parking', 'Washroom'], ARRAY['Tennis', 'Cricket'], '+91 98765 43211', 'contact@greenvalley.com', '456 Indiranagar Main Road, Bangalore'),
('Urban Sports Hub', 'HSR Layout, Bangalore', 'Indoor multi-sport facility with air conditioning', '/indoor-basketball-court.png', 4.9, 203, 1200, ARRAY['Parking', 'Wifi', 'Washroom', 'Equipment'], ARRAY['Basketball', 'Volleyball', 'Badminton'], '+91 98765 43212', 'hello@urbansports.com', '789 HSR Layout Sector 1, Bangalore'),
('Sporting Arena', 'Whitefield, Bangalore', 'Affordable courts with basic amenities', '/indoor-badminton-court.png', 4.4, 67, 500, ARRAY['Washroom', 'Equipment'], ARRAY['Badminton', 'Tennis'], '+91 98765 43213', 'info@sportingarena.com', '321 Whitefield Main Road, Bangalore'),
('Champion Courts', 'BTM Layout, Bangalore', 'Outdoor sports facility with floodlights', '/outdoor-football-field.png', 4.7, 156, 900, ARRAY['Parking', 'Washroom', 'Wifi'], ARRAY['Football', 'Cricket'], '+91 98765 43214', 'contact@championcourts.com', '654 BTM Layout 2nd Stage, Bangalore'),
('Elite Sports Center', 'Jayanagar, Bangalore', 'Premium indoor facility with professional coaching', '/indoor-volleyball-court.png', 4.5, 92, 700, ARRAY['Parking', 'Washroom'], ARRAY['Volleyball', 'Basketball'], '+91 98765 43215', 'info@elitesports.com', '987 Jayanagar 4th Block, Bangalore');

-- Insert sample venue availability for the next 7 days
DO $$
DECLARE
    venue_record RECORD;
    date_offset INTEGER;
    time_slot TEXT;
    time_slots TEXT[] := ARRAY['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
BEGIN
    FOR venue_record IN SELECT id FROM public.venues LOOP
        FOR date_offset IN 0..6 LOOP
            FOREACH time_slot IN ARRAY time_slots LOOP
                INSERT INTO public.venue_availability (venue_id, date, time_slot, is_available)
                VALUES (
                    venue_record.id,
                    CURRENT_DATE + INTERVAL '1 day' * date_offset,
                    time_slot,
                    CASE 
                        WHEN time_slot IN ('09:00', '14:00', '19:00') AND RANDOM() < 0.3 THEN false
                        ELSE true
                    END
                );
            END LOOP;
        END LOOP;
    END LOOP;
END $$;
