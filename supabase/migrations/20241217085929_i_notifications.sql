CREATE TABLE i_notifications (
    id SERIAL PRIMARY KEY,
    status VARCHAR(50) NOT NULL, -- Bijvoorbeeld: 'offline', 'online', 'error', 'maintenance', 'milestone'
    message TEXT NOT NULL,       -- Omschrijving van de notificatie
    detected_at TIMESTAMP DEFAULT NOW(), -- Tijdstip van detectie
    send_sms BOOLEAN DEFAULT FALSE,-- Of er een SMS verstuurd moet worden


    -- sms sent success
    sms_sent BOOLEAN DEFAULT FALSE,

    read_at TIMESTAMP, -- Tijdstip van lezen


    -- Nullable mold_id and machine_id
    mold_id INT,
    machine_id INT,

    -- Foreign keys to views
    CONSTRAINT fk_i_notifications_mold_id FOREIGN KEY (mold_id) REFERENCES treeview(id),
    CONSTRAINT fk_i_notifications_machine_id FOREIGN KEY (machine_id) REFERENCES machine_monitoring_poorten(id)
);