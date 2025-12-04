-- Alter i_maintenance_plans table to rename mold_id to machine_id
ALTER TABLE IF EXISTS "public"."i_maintenance_plans"
RENAME COLUMN "mold_id" TO "machine_id";

-- Update the foreign key constraint if it exists
ALTER TABLE IF EXISTS "public"."i_maintenance_plans"
DROP CONSTRAINT IF EXISTS "fk_mold_id" CASCADE;

-- Add a foreign key constraint for machine_id (if i_machines table exists with id as primary key)
-- Uncomment if i_machines table exists:
-- ALTER TABLE "public"."i_maintenance_plans"
-- ADD CONSTRAINT "fk_machine_id" FOREIGN KEY ("machine_id") REFERENCES "public"."i_machines"("id");
