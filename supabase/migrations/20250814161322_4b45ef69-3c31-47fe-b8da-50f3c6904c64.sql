-- Fix foreign key relationship for appointments table
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_doctor_id_fkey;

ALTER TABLE appointments ADD CONSTRAINT appointments_doctor_id_fkey 
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE;