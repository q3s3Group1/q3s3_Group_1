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


//   Mold
// name	
// character varying

// string	
// board	
// smallint

// number	
// port	
// smallint

// number	
// description	
// character varying

// string	
// id	
// integer

// number	
// current_machine_id	
// integer

// number	
// current_machine_name	
// character varying

// string

export interface Mold {
    name: string;
    board: number;
    port: number;
    description: string;
    id: number;
    current_machine_id: number;
    current_machine_name: string;

    total_shots_since_last_maintenance?: number;
    last_maintenance?: string;
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