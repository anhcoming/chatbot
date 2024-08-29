import { TypeCardProject } from "./type-card-project";

export class TypeCard {
    Id: number;
    CreatedAt: Date;
    UpdatedAt: Date;
    Name: string; 
    Description: string;
    GroupCard: number;
    VehicleId: number;
    IsActive: boolean;
    ListProject: Array<TypeCardProject>;
}
