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
    machine_id: number;
    milestone_shots: number;
    maintenance_type: string;
    send_sms: boolean;
    sms_sent: boolean;
    created_at: string;
    updated_at: string;
}
export type MachineTimeline = {
  truncated_timestamp: string;    
  total_shots: number;           
  average_shot_time: number | null; 
};

export interface Machine {
  machine_id: number;                 
  machine_name: string | null;
  board: number;
  port: number;
  mold_name: string | null;
    last_ts: string | null;       
    time_since_last_shot: string | null; 
  status: 'operational' | 'standby' | 'idle' | 'inactive';
  total_shots: number;                 
  avg_shot_time: number;               
}

export interface Group {
    id: number,
    name: string,
    created_at: string,
}

export interface Mold {
    mold_id: number;
    mold_name: string;
    mold_description?: string;

    board: number | null;
    port: number | null;

    total_shots: number;
    usage_periods: number;

    first_used: string;
    last_used: string;
}

// Extend mold with maintaince
export interface MachineMaintenance extends Machine {
    milestone_shots: number | null;
    maintenance_status: 'Maintenance Required' | 'OK';
}

export interface MoldMaintenance extends Mold {
    milestone_shots: number | null;
    maintenance_status: 'Maintenance Required' | 'OK';
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
    maintenance_description?: string;
    machine_name: string;
    machine_id: number;
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

export interface MaintenanceMachine {
    id: number;
    planned_date: Date
    machine_id: number,
    maintenance_type: "Preventative" | "Corrective",
    description: string,
    assigned_to: number,
    status: "Planned" | "Busy" | "Finished"
    maintenance_action: string
}

export interface MaintenanceMold {
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
    board: number | null;
    port: number | null;

    status: NotificationStatus;

    message: string;

    detected_at: Date;
    
    send_sms: boolean;

    sms_sent: boolean;

    read_at?: Date;
    resolved_at?: Date;

    machine_id?: number;
}