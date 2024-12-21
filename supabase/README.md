# Q3 Supabase

## Mysql 5.7 data naar Supabase migreren
[Initial migration](/supabase/migrations/20241217080955_empty_q3_migration.sql) is een lege database met de structuur van de Q3 database. Deze kan gebruikt worden om de structuur van de database in Supabase te zetten.

### Seeds

[Seeds](/supabase/seeds) is de data om de lege database te vullen. De seeds zijn in SQL formaat en kunnen gebruikt worden om de data in de database te zetten.



# Dev setup

## Requirements
- Docker
- Supabase CLI

## Setup
1. cd supabase
2. `supabase start`
3. import [manual migration](/supabase/manual) in Supabase Studio, Table Editor -> Import [monitoring_data_202009.csv](/supabase/manual/monitoring_data_202009.csv)
4. SQL Editor -> Run `refresh materialized view mv_molds_history;`
