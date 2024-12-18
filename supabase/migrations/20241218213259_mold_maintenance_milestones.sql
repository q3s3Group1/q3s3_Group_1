CREATE TABLE mold_maintenance_milestones (
    id SERIAL PRIMARY KEY, -- Uniek ID voor elke mijlpaal

    mold_id INT NOT NULL, -- Verwijzing naar de mold_id
    milestone_shots INT NOT NULL, -- Aantal shots waarop onderhoud nodig is
    maintenance_type VARCHAR(255) NOT NULL, -- Type onderhoud
    send_sms BOOLEAN NOT NULL DEFAULT FALSE, -- SMS sturen?

    -- Defaulted
    created_at TIMESTAMP DEFAULT NOW(), -- Tijdstip van aanmaak
    updated_at TIMESTAMP DEFAULT NOW() -- Tijdstip van laatste update
);
