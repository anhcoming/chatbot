export class TypeAttribute {
    public Id : number | undefined;
    public Name: string | undefined;
    public Code: string | undefined;    
    public CompanyId: number | undefined;    
    public CreatedById: number | undefined;    
    public UpdatedById: number | undefined;    
    public Priority: number | undefined;    
    public Note: string | undefined;
    public CreatedAt: Date | undefined;
    public UpdatedAt: Date | undefined;
    public IsUpdate : Boolean | undefined;
    public IsDelete : Boolean | undefined;
    public listAttributeItem : Array<ListAttributeItem> | undefined;
}
export class ListAttributeItem {
    public Id : number | undefined;
    public Status : number | undefined;
    public CreatedAt: Date | undefined;
    public UpdatedAt: Date | undefined;
    public CreatedById: number | undefined;    
    public UpdatedById: number | undefined;    
    public Code : string | undefined;
    public Name : string | undefined;
    public TypeAttributeId : number | undefined;
    public Icon : string | undefined;
    public Image : string | undefined;
    public Location : string | undefined;
}