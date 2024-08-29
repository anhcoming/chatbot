import { Tracing } from "trace_events";

export class Document {
    public Id : number;
    public Status : number | undefined;
    public CreatedById : number | undefined;
    public UpdatedById : number | undefined;
    public CompanyId : number | undefined;
    public ProjectId : number | undefined;
    public TowerId : number | undefined;
    public FloorId : number | undefined;
    public ApartmentId : number | undefined;
    public Location : number | undefined;
    public Name : string | undefined;
    public Description : string | undefined;
    public Note : string | undefined;
    public DateCreated: Date | undefined;
    public DateUpdated: Date | undefined;
    public Type: number | undefined;
    public listAttactments: Array<ListAttactments> | undefined;
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