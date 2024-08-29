import { Checkbox } from "primeng/checkbox";

export class DbPosition {
    public PositionId : number | undefined;
    public Code : string | undefined;
    public Name: string | undefined;
    public LevelId: number | undefined;    
    public PositionName: string | undefined;
    public FirstNote: Checkbox | undefined;
    public CompanyId: number | undefined;
    public ProjectId: number | undefined;
    public CreatedAt: Date | undefined;
    public UpdatedAt: Date | undefined;
    public CreatedById: number | undefined;
    public UpdatedById: number | undefined;
    public Note : string | undefined;
    IsNotification: boolean | undefined;

}