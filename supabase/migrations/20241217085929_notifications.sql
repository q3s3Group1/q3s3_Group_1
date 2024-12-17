CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    board INT NOT NULL,
    port INT NOT NULL,
    status VARCHAR(50) NOT NULL, -- Bijvoorbeeld: 'offline', 'online', 'error'
    message TEXT NOT NULL,       -- Omschrijving van de notificatie
    detected_at TIMESTAMP DEFAULT NOW(), -- Tijdstip van detectie
    send_sms BOOLEAN DEFAULT FALSE -- Of er een SMS verstuurd moet worden
);