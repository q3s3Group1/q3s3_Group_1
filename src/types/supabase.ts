// Mold history
export interface MoldHistory {
    production_id: number;
    mold_id: number;
    mold_name: string;

    board: number;
    port: number;
    machine_id: number;

    start_date: string;
    start_time: string;

    end_date: string;
    end_time: string;

    real_amount: number; // in that period

}

export interface Milestone {
    id: number;
    mold_id: number;
    milestone_shots: number;
    maintenance_type: string;
    send_sms: boolean;
    completed: boolean;
}

export interface MachineTimeline {

    average_shot_time: number;
    truncated_timestamp: string;
    total_shots: number;
}

export interface Machine {
    machine_id: number;
    machine_name: string;
    board: number;
    port: number;
    status: 'Actief' | 'Inactief' | 'Stilstand';
    total_shots: number;
    avg_shot_time: number;
    last_update: string;
}

export interface Group {
    id: number,
    name: string,
    created_at: string,
}

export interface Mold {
    mold_id: number;
    mold_name: string;

    board: number | null;
    port: number | null;

    total_shots: number;
    usage_periods: number;

    first_used: string;
    last_used: string;
}

// Extend mold with maintaince
export interface MoldMaintenance extends Mold {
    milestone_shots: number;
    maintenance_status: number;
}


export interface MonitoringData {
    id: number;
    shot_time: number;
    timestamp: string;
    board: number;
    port: number;
    mac_address: string;
}


export interface MaintenanceFull {
    mechanic_name: string;
    mechanic_id: number;
    maintenance_type: "Preventative" | "Corrective";
    description: string;
    mold_name: string;
    mold_id: number;
    mold_description: string;
    id: number;
    planned_date: Date;
    maintenance_action: string;
    assigned_to: number;
    status: string;
    mechanic_specialization: string;
    group_id: number | null;
}


export interface Mechanic {
    id: string;
    name: string;
    specialization: string;
}

export interface Maintenance {
    id: number;
    planned_date: Date
    mold_id: number,
    maintenance_type: "Preventative" | "Corrective",
    description: string,
    assigned_to: number,
    status: "Planned" | "Busy" | "Finished"
    maintenance_action: string
}


export enum NotificationStatus {
    offline = 'offline',
    online = 'online',
    error = 'error',
    maintenance = 'maintenance',
    milestone = 'milestone'
}

export interface Notification {
    id: number;
    board: number;
    port: number;

    status: NotificationStatus;

    message: string;

    detected_at: Date;
    
    send_sms: boolean;

    sms_sent: boolean;

    read_at?: Date;

    mold_id?: number;
    machine_id?: number;
}