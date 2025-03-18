export interface Summary {
     id: string
     podName: string;
     usage: number;
     cost: number;
}

export interface Detail {
     id: string
     podName: string
     creationTimestamp: string
     deletionTimestamp: string
     cpuLimit: string
     memoryLimit: string
     gpuLimit: string
     volumes: string
     namespace: string
     notebook_duration: string
     session_cost: number
     instance_id: string
     instance_type: string
     region: string
     pricing_type: string
     cost: string
     instanceRAM: number
     instanceCPU: number
     instanceGPU: number
     instanceId: string
}

export interface Logs {
     summary: Summary[]
     details: Detail[]
}