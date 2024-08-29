import { ConfigCardDetail } from "./config-card-detail";
import { ConfigCardTower } from "./config-card-tower";

export class ConfigCard {
    IdIndex: string;
    ProjectId: number;
    IsActive: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
    CreatedById: number;
    UpdatedById: number;
    CompanyId: number;
    TowerIds: Array<ConfigCardTower>;
    ConfigCardDetail: Array<ConfigCardDetail>;
}
