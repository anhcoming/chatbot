export class YardConfig {
    public Id : number;
    public Name: string ;
    public Code: string ;
    public CompanyId: number ; 
    public CreatedById: number ;  
    public UpdatedById: number ; 
    public Priority: number ;  
    public Note: string ;
    public CreatedAt: Date ;
    public UpdatedAt: Date ;
    listYardSettings = Array<listYardSettings>
}
export class listYardSettings {
    public Id: number;
    public Status: number;
    public CreatedAt: string;
    public UpdatedAt: string;
    public CompanyId: number;
    public CreatedById: number;
    public UpdatedById: number;
    public CreatedBy: string;
    public UpdatedBy: string;
    public ConfigBookingId: number;
    public Name: string;
    public Image: string;
    public Address: string;
    public IsDeposit: true;
    public PriceDeposit: number;
    public NoteDeposit: string;
    public ContentDeposit: string;
    public IsFee: true;
    public PriceFee: number;
    public NoteFee: string;
    public ContentFee: string;
    public Type: number;
    public Regulations: string;
    public BookEditing: string;
    public DateStart: string;
    public DateEnd: string;
    listYardTypeSettings = Array<listYardTypeSettings>
}
export class listYardTypeSettings {
    public Id: number;
    public Status: number;
    public CreatedAt: string;
    public UpdatedAt: string;
    public CompanyId: number;
    public CreatedById: number;
    public UpdatedById: number;
    public CreatedBy: string;
    public UpdatedBy: string;
    public yardSettingId: number;
    public Name: string;
    public Type: string;
    public TimeStart: string;
    public TimeEnd: true;
    public Price: number;
}