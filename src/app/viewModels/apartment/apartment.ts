export class Apartment {
    public Id: number | undefined;
    public Name: string | undefined;
    public Code: string | undefined;
    public Note: string | undefined;
    public ProjectId: number | undefined;    
    public ZoneId: number | undefined;
    public TowerId: number | undefined;
    public FloorId: number | undefined; 
    public Status: number | undefined;     
    public StatusName: String | undefined;     
    public UpdatedAt: Date | undefined;
    public CreatedById: number | undefined;
    public UpdatedById: number | undefined;
    public UpdatedBy: string | undefined;
    public CreateBy: string | undefined;
    public UsableArea: number | undefined;
    public NumberFloor: number | undefined;
    public Area: number | undefined;
    public NumberBedroom: number | undefined;
    public NumberBathroom: number | undefined;
    public NumberWindow: number | undefined;
    public NumberBalcony: number | undefined;
    public Direction: string | undefined;
    public CompanyId: number | undefined;
    listAttacments: Array<ListAttactments>
}
export class ListAttactments{
    public Id : number | undefined;
    public Status : number | undefined;
    public CreatedAt: Date | undefined;
    public UpdatedAt: Date | undefined;
    public CreatedById: number | undefined;
    public UpdatedById: number | undefined;
    public CompanyId: number | undefined;
    public Name: string | undefined;
    public TargetId : number | undefined;
    public TargetType: number | undefined;
    public Url: string | undefined;
    public Thumb : string | undefined;
    public Note: string | undefined;
}