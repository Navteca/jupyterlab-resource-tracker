export interface Summary {
     id: number;
     nbTime: string;
     username: string;
     cost: number;
}

export interface Detail {
     id: number
     username: string
     ec2StandardTime: string
     ec2StandardCost: number
     ec2LargeTime: string
     ec2LargeCost: number
     ec2ExtraTime: string
     ec2ExtraCost: number
     ec22xLargeTime: string
     ec22xLargeCost: number
     ec28xLargeTime: string
     ec28xLargeCost: number
     gpuNodeTime: string
     gpuNodeCost: number
}

export interface Logs {
     summary: Summary[]
     details: Detail[]
}