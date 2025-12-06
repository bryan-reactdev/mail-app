export interface User {
    id: number,
    name: string;
    email: string;
    role?: string;
    createdAt: Date;
    updatedAt: Date;
    isBlocked: boolean;
    projectUsers?: ProjectUser[];
}

export interface AuditLog {
    id: number;
    usuario: {
        id: number;
        name: string;
        email: string;
    };
    affectedId: string;
    description: string;
    actionType: string;
    entityType: string;
    timestamp: Date;
}

export interface Project {
    id: number,
    creator: User,
    title: string,
    description: string,
    startDateTime: Date | null,
    endDateTime: Date | null,
    location: string,
    contact: string,
    alarmCode: string,
    notes: string,
    additionalInformation: string,
    hoursPerProject: number,
    hourWage: number,
    isPublicForUsers: boolean,
    status: string,
    sections: Section[],
    projectTools?: ProjectTool[],
    projectUsers?: ProjectUser[],
    createdAt: Date,
    updatedAt: Date,
}

export interface Section {
    id: number;
    name: string;
    subSections: SubSection[];
    photoGroups?: PhotoGroup[];
}

export interface PhotoGroup {
    id: number;
    name?: string;
    beforePhotoIds: number[];
    afterPhotoIds: number[];
    beforePhotos?: Photo[];
    afterPhotos?: Photo[];
    createdAt: Date;
    updatedAt: Date;
}

export interface SubSection {
    id: number;
    name: string;
    photos: Photo[];
}

export interface Photo {
    id: number;
    url: string;
    thumbnailUrl?: string; // Optional thumbnail for fast-loading previews
    description: string;
    creator: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface Report {
    id: number;
    project: Project;
    author: User;
    text: string;
    interventionDate: Date;
    client: string;
    motive: string;
    interventionLocation: string;
    installationType: string;
    initialSystemCondition: string;
    detectedProblems: string;
    servicedSystemType: string;
    tasksPerformed: string;
    productsAndToolsUsed: string;
    postInterventionTests: string;
    finalSystemCondition: string;
    anomaliesCorrected: boolean;
    pendingWork: string;
    importantObservations: string;
    completionDateTime: Date;
    additionalComments: string;
}

export interface Document {
    id: number;
    name: string;
    fileName: string;
    description?: string;
    mimeType: string;
    fileSize: number;
    uploadedBy: User;
    project: Project;
    createdAt: Date;
    updatedAt: Date;
}

export interface Appointment {
    id: number,
    dateTime: Date,
    client: string,
    projectName: string,
    onSiteContact: string,
    evaluationDateTime: Date,
    appointmentDateTime: Date,
    cellphone: string,
    location: string,
    evaluator: User,
    status: string,
    estadoEvaluacion?: string,
}

export interface AppointmentPhoto {
    id: number;
    url: string;
    thumbnailUrl?: string;
    description: string | null;
    creator: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface ToolPhoto {
    id: number;
    url: string;
    thumbnailUrl?: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectTool {
    id: number;
    project: Project;
    tool: Tool;
    cantidadAsignada: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectUser {
    id: number;
    project: Project;
    user: User;
    isActive: boolean;
    isTeamLeader: boolean;
    createdAt: Date;
    updatedAt: Date;
    timeEntries?: ProjectUserTimeEntry[];
}

export interface ProjectUserTimeEntry {
    id: number;
    projectUser: ProjectUser;
    startDateTime: Date;
    endDateTime: Date | null;
    totalHours: number | null;
    notes?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Tool {
    id: number;
    nombre: string;
    cantidad: number;
    codigo: string;
    estado: "disponible" | "asignada" | "en_uso" | "dañada" | "perdida" | "retirada";
    photos?: ToolPhoto[];
    projectTools?: ProjectTool[];
    cantidadDisponible?: number;
    createdAt: Date;
    updatedAt: Date;
}

export const EstadoEvaluacion = {
    SIN_EVALUAR: "sin_evaluar",
    EVALUADO: "evaluado",
    CANCELADO: "cancelado",
} as const;

export type EstadoEvaluacion = typeof EstadoEvaluacion[keyof typeof EstadoEvaluacion];

export type DreStatus = "pending" | "pending_schedule" | "scheduled" | "cancelled";

export interface DreNote {
    id: number;
    content: string;
    creator: User;
    createdAt: Date;
}

export interface DreEntry {
    id: number;
    title: string;
    description?: string;
    status: DreStatus;
    startDateTime?: Date | null;
    location?: string;
    contact?: string;
    creator?: User;
    notes?: DreNote[];
    createdAt: Date;
    updatedAt: Date;
}

export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "in_progress" | "completed";

export interface TaskWorkSession {
    id: number;
    taskId: number;
    userId: number;
    user?: User;
    startTime: Date;
    endTime?: Date;
    durationHours?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductionTask {
    id: number;
    title: string;
    description?: string;
    priority: TaskPriority;
    status: TaskStatus;
    positionX: number;
    positionY: number;
    width: number;
    height: number;
    color: string;
    creator?: User;
    assignedUsers?: User[];
    completedAt?: Date;
    workSessions?: TaskWorkSession[];
    createdAt: Date;
    updatedAt: Date;
}

export interface AppointmentForm {
    id: number;
    nombre_cliente: string;
    tipo_edificio: string;
    nombre_evaluador: string;
    persona_contacto: string;
    mantenimiento_historia: number;
    fecha_hora_ultimo_mantenimiento: Date | null;
    tipo_sistema: string;
    accesibilidad: string;
    puertas_acceso_existentes: string;
    puertas_acceso_a_anadir: string;
    conductos_visibles: number;
    tipo_material: string;
    acumulacion_polvillo: number;
    acumulacion_polvillo_comentario: string | null;
    escombros_visibles: number;
    escombros_visibles_comentario: string | null;
    moho: number;
    moho_comentario: string | null;
    roedores_insectos: number;
    roedores_insectos_comentario: string | null;
    grasa_hotte: number;
    grasa_hotte_comentario: string | null;
    olores_sospechosos: number;
    olores_sospechosos_comentario: string | null;
    estado_rejillas: string;
    estado_motor: string;
    estado_filtros: string;
    cantidad_conductos: number;
    longitud_estimacion: string;
    cantidad_codos: number;
    cantidad_salidas: number;
    altura_trabajo: string;
    observaciones: string | null;
    limpieza_completa: number;
    instalar_puertas_acceso: number;
    reemplazo_filtros: number;
    productos_recomendados: string | null;
    direccion: string | null;
    futuro: number;
    conductos_visibles_valor: number | null;
    conductos_visibles_factor: number | null;
    conductos_visibles_total: number | null;
    nombre_proyecto: string | null;
    telefono: string | null;
    email: string | null;
    fecha_hora_visita: Date | null;
    fecha_hora_evaluacion: Date | null;
    fecha_evaluado?: Date | null;
    fecha_rechazado?: Date | null;
    estado_evaluacion: EstadoEvaluacion;
    photos: AppointmentPhoto[];

    creator: User;
    usuario?: User;
    createdAt: Date;
    updatedAt: Date;
}