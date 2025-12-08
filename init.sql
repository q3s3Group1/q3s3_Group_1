


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_monitoring_intervals"("start_date" timestamp without time zone, "end_date" timestamp without time zone, "interval_input" character varying, "board_input" integer, "port_input" integer) RETURNS TABLE("truncated_timestamp" timestamp without time zone, "total_shots" integer, "average_shot_time" double precision)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    WITH intervals AS (
        SELECT generate_series(
            start_date,
            end_date,
            CASE 
                WHEN interval_input = 'minute' THEN INTERVAL '1 minute'
                WHEN interval_input = '5 minute' THEN INTERVAL '5 minutes'
                WHEN interval_input = 'hour' THEN INTERVAL '1 hour'
                WHEN interval_input = 'day' THEN INTERVAL '1 day'
                WHEN interval_input = 'week' THEN INTERVAL '1 week'
                ELSE INTERVAL '1 day'
            END
        )::TIMESTAMP AS truncated_timestamp
    )
    SELECT
        intervals.truncated_timestamp,
        CAST(COUNT(v.id) AS INT) AS total_shots,
        COALESCE(AVG(v.shot_time), 0) AS average_shot_time
    FROM
        intervals
    LEFT JOIN v_monitoring_data v
    ON
        DATE_TRUNC(
            CASE 
                WHEN interval_input = 'minute' THEN 'minute'
                WHEN interval_input = '5 minute' THEN 'minute'
                WHEN interval_input = 'hour' THEN 'hour'
                WHEN interval_input = 'day' THEN 'day'
                WHEN interval_input = 'week' THEN 'week'
            END, v.timestamp AT TIME ZONE 'UTC'
        ) = intervals.truncated_timestamp
        AND (interval_input != '5 minute' OR EXTRACT(MINUTE FROM v.timestamp) % 5 = 0)
        AND v.board = board_input
        AND v.port = port_input
    GROUP BY
        intervals.truncated_timestamp
    ORDER BY
        intervals.truncated_timestamp;
END;
$$;


ALTER FUNCTION "public"."get_monitoring_intervals"("start_date" timestamp without time zone, "end_date" timestamp without time zone, "interval_input" character varying, "board_input" integer, "port_input" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notify_new_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  query_url TEXT;
  response TEXT;
BEGIN
  -- Construct the query string with URL-encoded parameters
  query_url := 'https://pmxcsnscsngbfrqkxufg.supabase.co/functions/v1/new_notification?' ||
               'id=' || url_encode(NEW.id::text) || '&' ||
               'message=' || url_encode(NEW.message) || '&' ||
               'detected_at=' || url_encode(NEW.detected_at::text) || '&' ||
               'machine_id=' || url_encode(NEW.machine_id::text) || '&' ||
               'status=' || url_encode(NEW.status::text);

  -- Perform the GET request and store the response
  response := http_get(query_url);

  -- Optionally, log or handle the response
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notify_new_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."send_notification_to_edge_function"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  notification jsonb;
BEGIN
  -- Prepare notification
  SELECT row_to_json(NEW) INTO notification
  FROM public.i_notifications
  WHERE id = NEW.id;

  -- Trigger the Edge function (HTTP POST request)
  PERFORM pg_notify(
    'send_notification', 
    notification::text
  );

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."send_notification_to_edge_function"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."url_encode"("input" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  encoded TEXT := '';
  i INT;
  c CHAR;
BEGIN
  FOR i IN 1..LENGTH(input) LOOP
    c := SUBSTRING(input FROM i FOR 1);
    IF c ~ '[a-zA-Z0-9_.~-]' THEN
      encoded := encoded || c;
    ELSE
      encoded := encoded || '%' || TO_HEX(ASCII(c));
    END IF;
  END LOOP;
  RETURN encoded;
END;
$$;


ALTER FUNCTION "public"."url_encode"("input" "text") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."i_maintenance_groups" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" DEFAULT 'Group'::"text" NOT NULL,
    "id" integer NOT NULL
);


ALTER TABLE "public"."i_maintenance_groups" OWNER TO "postgres";


ALTER TABLE "public"."i_maintenance_groups" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."i_maintenance_groups_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."i_maintenance_plans" (
    "id" integer NOT NULL,
    "planned_date" timestamp with time zone NOT NULL,
    "machine_id" integer NOT NULL,
    "maintenance_type" character varying(20) NOT NULL,
    "description" "text" NOT NULL,
    "assigned_to" integer NOT NULL,
    "status" character varying(20) DEFAULT 'Planned'::character varying,
    "maintenance_action" "text",
    "group_id" integer,
    CONSTRAINT "maintenance_plans_maintenance_type_check" CHECK ((("maintenance_type")::"text" = ANY (ARRAY[('Preventative'::character varying)::"text", ('Corrective'::character varying)::"text"]))),
    CONSTRAINT "maintenance_plans_status_check" CHECK ((("status")::"text" = ANY (ARRAY[('Planned'::character varying)::"text", ('Busy'::character varying)::"text", ('Finished'::character varying)::"text"])))
);


ALTER TABLE "public"."i_maintenance_plans" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_maintenance_plans_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."i_maintenance_plans_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_maintenance_plans_id_seq" OWNED BY "public"."i_maintenance_plans"."id";



CREATE TABLE IF NOT EXISTS "public"."i_mechanics" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "specialization" "text" NOT NULL
);


ALTER TABLE "public"."i_mechanics" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_mechanics_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."i_mechanics_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_mechanics_id_seq" OWNED BY "public"."i_mechanics"."id";



CREATE TABLE IF NOT EXISTS "public"."i_mold_maintenance_milestones" (
    "id" integer NOT NULL,
    "mold_id" integer NOT NULL,
    "milestone_shots" integer NOT NULL,
    "maintenance_type" character varying(255) NOT NULL,
    "send_sms" boolean DEFAULT false NOT NULL,
    "sms_sent" boolean DEFAULT false NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."i_mold_maintenance_milestones" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_mold_maintenance_milestones_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."i_mold_maintenance_milestones_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_mold_maintenance_milestones_id_seq" OWNED BY "public"."i_mold_maintenance_milestones"."id";



CREATE TABLE IF NOT EXISTS "public"."i_notifications" (
    "id" integer NOT NULL,
    "status" character varying(50) NOT NULL,
    "message" "text" NOT NULL,
    "detected_at" timestamp without time zone DEFAULT "now"(),
    "send_sms" boolean DEFAULT false,
    "sms_sent" boolean DEFAULT false,
    "read_at" timestamp without time zone,
    "mold_id" integer,
    "machine_id" integer,
    "resolved_at" timestamp without time zone
);


ALTER TABLE "public"."i_notifications" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."i_notifications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."i_notifications_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."i_notifications_id_seq" OWNED BY "public"."i_notifications"."id";



CREATE TABLE IF NOT EXISTS "public"."machine_monitoring_poorten" (
    "id" integer NOT NULL,
    "board" integer DEFAULT 0 NOT NULL,
    "port" integer DEFAULT 0 NOT NULL,
    "name" character varying(255),
    "volgorde" integer DEFAULT 0 NOT NULL,
    "visible" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."machine_monitoring_poorten" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."machine_monitoring_poorten_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."machine_monitoring_poorten_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."machine_monitoring_poorten_id_seq" OWNED BY "public"."machine_monitoring_poorten"."id";



CREATE TABLE IF NOT EXISTS "public"."monitoring_data_202009" (
    "id" integer NOT NULL,
    "board" smallint DEFAULT 0 NOT NULL,
    "port" smallint DEFAULT 0 NOT NULL,
    "com" smallint DEFAULT 0 NOT NULL,
    "code" integer DEFAULT 0 NOT NULL,
    "code2" integer DEFAULT 0 NOT NULL,
    "timestamp" timestamp(6) without time zone,
    "datum" "date",
    "mac_address" character varying(50) DEFAULT ''::character varying NOT NULL,
    "shot_time" double precision DEFAULT 0.000000 NOT NULL,
    "previous_shot_id" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."monitoring_data_202009" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."monitoring_data_202009_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."monitoring_data_202009_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."monitoring_data_202009_id_seq" OWNED BY "public"."monitoring_data_202009"."id";



CREATE TABLE IF NOT EXISTS "public"."monitoring_data_202010" (
    "id" integer NOT NULL,
    "board" smallint DEFAULT 0 NOT NULL,
    "port" smallint DEFAULT 0 NOT NULL,
    "com" smallint DEFAULT 0 NOT NULL,
    "code" integer DEFAULT 0 NOT NULL,
    "code2" integer DEFAULT 0 NOT NULL,
    "timestamp" timestamp(6) without time zone,
    "datum" "date",
    "mac_address" character varying(50) DEFAULT ''::character varying NOT NULL,
    "shot_time" double precision DEFAULT 0.000000 NOT NULL,
    "previous_shot_id" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."monitoring_data_202010" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."monitoring_data_202010_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."monitoring_data_202010_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."monitoring_data_202010_id_seq" OWNED BY "public"."monitoring_data_202010"."id";



CREATE TABLE IF NOT EXISTS "public"."production_data" (
    "id" integer NOT NULL,
    "treeview_id" integer DEFAULT 0 NOT NULL,
    "treeview2_id" integer DEFAULT 0 NOT NULL,
    "start_date" "date" DEFAULT '0001-01-01'::"date" NOT NULL,
    "start_time" time without time zone DEFAULT '00:00:00'::time without time zone NOT NULL,
    "end_date" "date" DEFAULT '0001-01-01'::"date" NOT NULL,
    "end_time" time without time zone DEFAULT '00:00:00'::time without time zone NOT NULL,
    "amount" double precision DEFAULT 0.00 NOT NULL,
    "name" character varying(255) DEFAULT ''::character varying NOT NULL,
    "description" "text" NOT NULL,
    "port" smallint DEFAULT 0 NOT NULL,
    "board" smallint DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."production_data" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."treeview" (
    "id" integer NOT NULL,
    "object" character(1) DEFAULT ''::"bpchar" NOT NULL,
    "naam" character varying(255) DEFAULT ''::character varying NOT NULL,
    "omschrijving" character varying(255) DEFAULT ''::character varying NOT NULL,
    "boom_volgorde" integer DEFAULT 0 NOT NULL,
    "stamkaart" "text" NOT NULL,
    "treeviewtype_id" integer DEFAULT 0 NOT NULL,
    "serienummer" character varying(255) DEFAULT ''::character varying NOT NULL,
    "bouwjaar" character varying(255) DEFAULT ''::character varying NOT NULL,
    "actief" boolean DEFAULT true NOT NULL,
    "wijzigactief" integer DEFAULT 0 NOT NULL,
    "vrijgegeven" boolean DEFAULT false NOT NULL,
    "installatiedatum" integer DEFAULT 0 NOT NULL,
    "garantietot" integer DEFAULT 0 NOT NULL,
    "aanschafwaarde" numeric(11,2) DEFAULT 0.00 NOT NULL,
    "afschrijving" integer DEFAULT 0 NOT NULL,
    "jaarafschrijving" integer DEFAULT 0 NOT NULL,
    "afschrijvingeen" smallint DEFAULT 0 NOT NULL,
    "budgetvorig" numeric(11,2) DEFAULT 0.00 NOT NULL,
    "budgetnu" numeric(11,2) DEFAULT 0.00 NOT NULL,
    "melden" boolean DEFAULT true NOT NULL,
    "correctief" boolean DEFAULT false NOT NULL,
    "werkopdracht" boolean DEFAULT false NOT NULL,
    "fabrikanten_id" integer DEFAULT 0 NOT NULL,
    "leverancieren_id" integer DEFAULT 0 NOT NULL,
    "locaties_id" integer DEFAULT 0 NOT NULL,
    "kostenplaats_id" integer DEFAULT 0 NOT NULL,
    "parent" integer DEFAULT 0 NOT NULL,
    "new_id" integer DEFAULT 0 NOT NULL,
    "old_datum" "date" DEFAULT '0001-01-01'::"date" NOT NULL
);


ALTER TABLE "public"."treeview" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_monitoring_data" AS
 SELECT "monitoring_data_202009"."id",
    "monitoring_data_202009"."board",
    "monitoring_data_202009"."port",
    "monitoring_data_202009"."com",
    "monitoring_data_202009"."code",
    "monitoring_data_202009"."code2",
    "monitoring_data_202009"."timestamp",
    "monitoring_data_202009"."datum",
    "monitoring_data_202009"."mac_address",
    "monitoring_data_202009"."shot_time",
    "monitoring_data_202009"."previous_shot_id"
   FROM "public"."monitoring_data_202009"
UNION ALL
 SELECT "monitoring_data_202010"."id",
    "monitoring_data_202010"."board",
    "monitoring_data_202010"."port",
    "monitoring_data_202010"."com",
    "monitoring_data_202010"."code",
    "monitoring_data_202010"."code2",
    "monitoring_data_202010"."timestamp",
    "monitoring_data_202010"."datum",
    "monitoring_data_202010"."mac_address",
    "monitoring_data_202010"."shot_time",
    "monitoring_data_202010"."previous_shot_id"
   FROM "public"."monitoring_data_202010";


ALTER VIEW "public"."v_monitoring_data" OWNER TO "postgres";


CREATE MATERIALIZED VIEW "public"."mv_molds_history" AS
 SELECT "pd"."id" AS "production_id",
    "pd"."treeview_id" AS "mold_id",
    "t"."naam" AS "mold_name",
    "pd"."board",
    "pd"."port",
    "mmp"."id" AS "machine_id",
    "pd"."start_date",
    "pd"."start_time",
    "pd"."end_date",
    "pd"."end_time",
    COALESCE("count"("md"."id"), (0)::bigint) AS "real_amount",
    "pd"."name" AS "production_name",
    "pd"."description" AS "production_description"
   FROM ((("public"."production_data" "pd"
     JOIN "public"."treeview" "t" ON (("pd"."treeview_id" = "t"."id")))
     LEFT JOIN "public"."v_monitoring_data" "md" ON ((("md"."board" = "pd"."board") AND ("md"."port" = "pd"."port") AND ("md"."timestamp" >= ((("pd"."start_date" || ' '::"text") || "pd"."start_time"))::timestamp without time zone) AND ("md"."timestamp" <= ((("pd"."end_date" || ' '::"text") || "pd"."end_time"))::timestamp without time zone))))
     LEFT JOIN "public"."machine_monitoring_poorten" "mmp" ON ((("pd"."board" = "mmp"."board") AND ("pd"."port" = "mmp"."port"))))
  GROUP BY "pd"."id", "pd"."treeview_id", "t"."naam", "pd"."board", "pd"."port", "mmp"."id", "pd"."start_date", "pd"."start_time", "pd"."end_date", "pd"."end_time", "pd"."name", "pd"."description"
  ORDER BY "pd"."start_date", "pd"."start_time"
  WITH NO DATA;


ALTER MATERIALIZED VIEW "public"."mv_molds_history" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."production_data_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."production_data_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."production_data_id_seq" OWNED BY "public"."production_data"."id";



CREATE TABLE IF NOT EXISTS "public"."tellerbasis" (
    "id" integer NOT NULL,
    "naam" character varying(255) DEFAULT ''::character varying NOT NULL,
    "omschrijving" character varying(255) DEFAULT ''::character varying NOT NULL,
    "optie" integer DEFAULT 0 NOT NULL,
    "actief" boolean NOT NULL,
    "afkorting" character varying(255) NOT NULL,
    "max_waarde" double precision NOT NULL
);


ALTER TABLE "public"."tellerbasis" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."tellerbasis_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."tellerbasis_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."tellerbasis_id_seq" OWNED BY "public"."tellerbasis"."id";



CREATE TABLE IF NOT EXISTS "public"."tellerstanden" (
    "id" integer NOT NULL,
    "waarde" numeric(11,2) DEFAULT 0.00 NOT NULL,
    "totaal" numeric(11,2) DEFAULT 0.00 NOT NULL,
    "treeview_id" integer DEFAULT 0 NOT NULL,
    "datum" integer DEFAULT 0 NOT NULL,
    "tellerbasis_id" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."tellerstanden" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."tellerstanden_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."tellerstanden_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."tellerstanden_id_seq" OWNED BY "public"."tellerstanden"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."treeview_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."treeview_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."treeview_id_seq" OWNED BY "public"."treeview"."id";



CREATE OR REPLACE VIEW "public"."v_machine_status" AS
 WITH "aggregated_monitoring" AS (
         SELECT "md"."board",
            "md"."port",
            "max"("md"."timestamp") AS "last_shot_time",
            "count"(*) AS "total_shots",
            "avg"("md"."shot_time") AS "avg_shot_time"
           FROM "public"."v_monitoring_data" "md"
          GROUP BY "md"."board", "md"."port"
        ), "latest_shots" AS (
         SELECT "mp"."id" AS "machine_id",
            "mp"."name" AS "machine_name",
            "mp"."board",
            "mp"."port",
            "am"."last_shot_time",
            "am"."total_shots",
            "am"."avg_shot_time",
            ("now"() - ("am"."last_shot_time")::timestamp with time zone) AS "time_since_last_shot"
           FROM ("public"."machine_monitoring_poorten" "mp"
             LEFT JOIN "aggregated_monitoring" "am" ON ((("am"."board" = "mp"."board") AND ("am"."port" = "mp"."port"))))
          WHERE ("mp"."visible" = true)
        )
 SELECT "ls"."machine_id",
    "ls"."machine_name",
    "ls"."board",
    "ls"."port",
        CASE
            WHEN ("ls"."last_shot_time" IS NULL) THEN 'Stilstand'::"text"
            WHEN ("ls"."time_since_last_shot" <= '01:00:00'::interval) THEN 'Actief'::"text"
            WHEN ("ls"."time_since_last_shot" <= '10:00:00'::interval) THEN 'Inactief'::"text"
            ELSE 'Stilstand'::"text"
        END AS "status",
    COALESCE("ls"."total_shots", (0)::bigint) AS "total_shots",
    COALESCE("ls"."avg_shot_time", (0.0)::double precision) AS "avg_shot_time",
    "ls"."last_shot_time" AS "last_update"
   FROM "latest_shots" "ls";


ALTER VIEW "public"."v_machine_status" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_molds" AS
 SELECT "mh"."mold_id",
    "mh"."mold_name",
    "max"(
        CASE
            WHEN ((CURRENT_DATE >= "mh"."start_date") AND (CURRENT_DATE <= "mh"."end_date")) THEN "mh"."board"
            ELSE NULL::smallint
        END) AS "board",
    "max"(
        CASE
            WHEN ((CURRENT_DATE >= "mh"."start_date") AND (CURRENT_DATE <= "mh"."end_date")) THEN "mh"."port"
            ELSE NULL::smallint
        END) AS "port",
    "count"(DISTINCT "mh"."production_id") AS "usage_periods",
    COALESCE("sum"("mh"."real_amount"), (0)::numeric) AS "total_shots",
    ("min"((("mh"."start_date" || ' '::"text") || "mh"."start_time")))::timestamp without time zone AS "first_used",
    ("max"((("mh"."end_date" || ' '::"text") || "mh"."end_time")))::timestamp without time zone AS "last_used"
   FROM "public"."mv_molds_history" "mh"
  GROUP BY "mh"."mold_id", "mh"."mold_name";


ALTER VIEW "public"."v_molds" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_maintenance" AS
 SELECT DISTINCT "ma"."id",
        "ma"."planned_date",
        "ma"."machine_id",
        "vm"."machine_name",
        "ma"."maintenance_type",
        "ma"."description" AS "maintenance_description",
        "ma"."assigned_to",
        "ma"."status",
        "ma"."maintenance_action",
        "ma"."group_id",
        "me"."name" AS "mechanic_name",
        "me"."id" AS "mechanic_id",
        "me"."specialization" AS "mechanic_specialization",
        "vm"."mold_name"
     FROM (("public"."i_maintenance_plans" "ma"
         LEFT JOIN "public"."i_mechanics" "me" ON (("me"."id" = "ma"."assigned_to")))
         LEFT JOIN "public"."v_machine_activity" "vm" ON (("vm"."machine_id" = "ma"."machine_id")));


ALTER VIEW "public"."v_maintenance" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_molds_with_maintenance" AS
 SELECT "vm"."mold_id",
    "vm"."mold_name",
    "vm"."board",
    "vm"."port",
    "vm"."usage_periods",
    "vm"."total_shots",
    "vm"."first_used",
    "vm"."last_used",
    "mm"."milestone_shots",
        CASE
            WHEN ("vm"."total_shots" >= ("mm"."milestone_shots")::numeric) THEN 'Maintenance Required'::"text"
            ELSE 'OK'::"text"
        END AS "maintenance_status"
   FROM ("public"."v_molds" "vm"
     LEFT JOIN "public"."i_mold_maintenance_milestones" "mm" ON (("vm"."mold_id" = "mm"."mold_id")))
  ORDER BY "vm"."mold_id", "mm"."milestone_shots";


ALTER VIEW "public"."v_molds_with_maintenance" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_notifications" AS
 SELECT "i"."id",
    "i"."status",
    "i"."message",
    "i"."detected_at",
    "i"."send_sms",
    "i"."sms_sent",
    "i"."read_at",
    "i"."mold_id",
    "i"."machine_id",
    "mh"."board",
    "mh"."port"
   FROM ("public"."i_notifications" "i"
     LEFT JOIN "public"."mv_molds_history" "mh" ON ((("i"."mold_id" = "mh"."mold_id") AND (("i"."detected_at" >= "mh"."start_date") AND ("i"."detected_at" <= COALESCE("mh"."end_date", CURRENT_DATE))))));


ALTER VIEW "public"."v_notifications" OWNER TO "postgres";


ALTER TABLE ONLY "public"."i_maintenance_plans" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_maintenance_plans_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_mechanics" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_mechanics_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_mold_maintenance_milestones" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_mold_maintenance_milestones_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_notifications" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."i_notifications_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."machine_monitoring_poorten" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."machine_monitoring_poorten_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."monitoring_data_202009" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."monitoring_data_202009_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."monitoring_data_202010" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."monitoring_data_202010_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."production_data" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."production_data_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."tellerbasis" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."tellerbasis_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."tellerstanden" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."tellerstanden_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."treeview" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."treeview_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."i_maintenance_groups"
    ADD CONSTRAINT "i_maintenance_groups_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_mold_maintenance_milestones"
    ADD CONSTRAINT "i_mold_maintenance_milestones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_notifications"
    ADD CONSTRAINT "i_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."machine_monitoring_poorten"
    ADD CONSTRAINT "machine_monitoring_poorten_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_maintenance_plans"
    ADD CONSTRAINT "maintenance_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."i_mechanics"
    ADD CONSTRAINT "mechanics_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."monitoring_data_202009"
    ADD CONSTRAINT "monitoring_data_202009_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."monitoring_data_202010"
    ADD CONSTRAINT "monitoring_data_202010_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."production_data"
    ADD CONSTRAINT "production_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tellerbasis"
    ADD CONSTRAINT "tellerbasis_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tellerstanden"
    ADD CONSTRAINT "tellerstanden_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."treeview"
    ADD CONSTRAINT "treeview_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_actief_tellerbasis" ON "public"."tellerbasis" USING "btree" ("actief");



CREATE INDEX "idx_actief_treeview" ON "public"."treeview" USING "btree" ("actief");



CREATE INDEX "idx_board_monitoring_202009" ON "public"."monitoring_data_202009" USING "btree" ("board");



CREATE INDEX "idx_board_monitoring_202010" ON "public"."monitoring_data_202010" USING "btree" ("board");



CREATE INDEX "idx_board_port_datum_monitoring_202009" ON "public"."monitoring_data_202009" USING "btree" ("board", "port", "datum");



CREATE INDEX "idx_board_port_datum_monitoring_202010" ON "public"."monitoring_data_202010" USING "btree" ("board", "port", "datum");



CREATE INDEX "idx_board_port_monitoring_202009" ON "public"."monitoring_data_202009" USING "btree" ("board", "port");



CREATE INDEX "idx_board_port_monitoring_202010" ON "public"."monitoring_data_202010" USING "btree" ("board", "port");



CREATE INDEX "idx_board_production_data" ON "public"."production_data" USING "btree" ("board");



CREATE INDEX "idx_bouwjaar_treeview" ON "public"."treeview" USING "btree" ("bouwjaar");



CREATE INDEX "idx_code_monitoring_202009" ON "public"."monitoring_data_202009" USING "btree" ("code");



CREATE INDEX "idx_code_monitoring_202010" ON "public"."monitoring_data_202010" USING "btree" ("code");



CREATE INDEX "idx_datum_monitoring_202009" ON "public"."monitoring_data_202009" USING "btree" ("datum");



CREATE INDEX "idx_datum_monitoring_202010" ON "public"."monitoring_data_202010" USING "btree" ("datum");



CREATE INDEX "idx_end_date_end_time_production_data" ON "public"."production_data" USING "btree" ("end_date", "end_time");



CREATE INDEX "idx_fabrikanten_id_treeview" ON "public"."treeview" USING "btree" ("fabrikanten_id");



CREATE INDEX "idx_locaties_id_treeview" ON "public"."treeview" USING "btree" ("locaties_id");



CREATE INDEX "idx_naam_tellerbasis" ON "public"."tellerbasis" USING "btree" ("naam");



CREATE INDEX "idx_naam_treeview" ON "public"."treeview" USING "btree" ("naam");



CREATE INDEX "idx_port_monitoring_202009" ON "public"."monitoring_data_202009" USING "btree" ("port");



CREATE INDEX "idx_port_monitoring_202010" ON "public"."monitoring_data_202010" USING "btree" ("port");



CREATE INDEX "idx_port_production_data" ON "public"."production_data" USING "btree" ("port");



CREATE INDEX "idx_serienummer_treeview" ON "public"."treeview" USING "btree" ("serienummer");



CREATE INDEX "idx_start_date_start_time_production_data" ON "public"."production_data" USING "btree" ("start_date", "start_time");



CREATE INDEX "idx_tellerbasis_id_tellerstanden" ON "public"."tellerstanden" USING "btree" ("tellerbasis_id");



CREATE INDEX "idx_timestamp_monitoring_202009" ON "public"."monitoring_data_202009" USING "btree" ("timestamp");



CREATE INDEX "idx_timestamp_monitoring_202010" ON "public"."monitoring_data_202010" USING "btree" ("timestamp");



CREATE INDEX "idx_treeview_id_production_data" ON "public"."production_data" USING "btree" ("treeview_id");



CREATE INDEX "idx_treeview_id_tellerstanden" ON "public"."tellerstanden" USING "btree" ("treeview_id");



CREATE OR REPLACE TRIGGER "New Notification" AFTER INSERT ON "public"."i_notifications" FOR EACH ROW EXECUTE FUNCTION "public"."notify_new_notification"();



ALTER TABLE ONLY "public"."i_maintenance_plans"
    ADD CONSTRAINT "fk_assigned_to" FOREIGN KEY ("assigned_to") REFERENCES "public"."i_mechanics"("id");



ALTER TABLE ONLY "public"."i_notifications"
    ADD CONSTRAINT "fk_i_notifications_machine_id" FOREIGN KEY ("machine_id") REFERENCES "public"."machine_monitoring_poorten"("id");



ALTER TABLE ONLY "public"."i_notifications"
    ADD CONSTRAINT "fk_i_notifications_mold_id" FOREIGN KEY ("mold_id") REFERENCES "public"."treeview"("id");



ALTER TABLE ONLY "public"."i_maintenance_plans"
    ADD CONSTRAINT "i_maintenance_plans_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."i_maintenance_groups"("id") ON DELETE SET NULL;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";








GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";































































































































































































































































GRANT ALL ON FUNCTION "public"."get_monitoring_intervals"("start_date" timestamp without time zone, "end_date" timestamp without time zone, "interval_input" character varying, "board_input" integer, "port_input" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_monitoring_intervals"("start_date" timestamp without time zone, "end_date" timestamp without time zone, "interval_input" character varying, "board_input" integer, "port_input" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_monitoring_intervals"("start_date" timestamp without time zone, "end_date" timestamp without time zone, "interval_input" character varying, "board_input" integer, "port_input" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."notify_new_notification"() TO "anon";
GRANT ALL ON FUNCTION "public"."notify_new_notification"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."notify_new_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."send_notification_to_edge_function"() TO "anon";
GRANT ALL ON FUNCTION "public"."send_notification_to_edge_function"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."send_notification_to_edge_function"() TO "service_role";



GRANT ALL ON FUNCTION "public"."url_encode"("input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."url_encode"("input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."url_encode"("input" "text") TO "service_role";
























GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_maintenance_groups" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_maintenance_groups" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_maintenance_groups" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_maintenance_groups_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_maintenance_groups_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_maintenance_groups_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_maintenance_plans" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_maintenance_plans" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_maintenance_plans" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_maintenance_plans_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_maintenance_plans_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_maintenance_plans_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_mechanics" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_mechanics" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_mechanics" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_mechanics_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_mechanics_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_mechanics_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_mold_maintenance_milestones" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_mold_maintenance_milestones" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_mold_maintenance_milestones" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_mold_maintenance_milestones_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_mold_maintenance_milestones_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_mold_maintenance_milestones_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_notifications" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_notifications" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."i_notifications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."i_notifications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."i_notifications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."i_notifications_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."machine_monitoring_poorten" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."machine_monitoring_poorten" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."machine_monitoring_poorten" TO "service_role";



GRANT ALL ON SEQUENCE "public"."machine_monitoring_poorten_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."machine_monitoring_poorten_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."machine_monitoring_poorten_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."monitoring_data_202009" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."monitoring_data_202009" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."monitoring_data_202009" TO "service_role";



GRANT ALL ON SEQUENCE "public"."monitoring_data_202009_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."monitoring_data_202009_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."monitoring_data_202009_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."monitoring_data_202010" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."monitoring_data_202010" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."monitoring_data_202010" TO "service_role";



GRANT ALL ON SEQUENCE "public"."monitoring_data_202010_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."monitoring_data_202010_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."monitoring_data_202010_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."production_data" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."production_data" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."production_data" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."treeview" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."treeview" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."treeview" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_monitoring_data" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_monitoring_data" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_monitoring_data" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."mv_molds_history" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."mv_molds_history" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."mv_molds_history" TO "service_role";



GRANT ALL ON SEQUENCE "public"."production_data_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."production_data_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."production_data_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."tellerbasis" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."tellerbasis" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."tellerbasis" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tellerbasis_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tellerbasis_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tellerbasis_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."tellerstanden" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."tellerstanden" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."tellerstanden" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tellerstanden_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tellerstanden_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tellerstanden_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."treeview_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."treeview_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."treeview_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_machine_status" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_machine_status" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_machine_status" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_molds" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_molds" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_molds" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_maintenance" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_maintenance" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_maintenance" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_molds_with_maintenance" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_molds_with_maintenance" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_molds_with_maintenance" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_notifications" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_notifications" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."v_notifications" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "service_role";































RESET ALL;
