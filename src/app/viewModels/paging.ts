export interface Paging {
    page: number;
    page_size: number;
    order_by: string;
    query: string;
    groupCard: number;
    vehicleId: number;
    select: string;
    ProjectId: string ;
    TowerId: string;
    FloorId: string;
    ApartmentId: string;
    ResidentId: string;
    type: string;
    dateStart: string;
    dateEnd: string;
    ZoneId : string;
    id : string;
    residentStatus: string;
    status: string;
    DateStart: string;
    DateEnd: string;
}
export interface PagingInvoice{
    keyword:string;
    pageIndex:number;
    pageSize: number;
} 
export interface PagingInvoiceService extends PagingInvoice{
    type: number;
}
export interface PagingInvoiceServices extends PagingInvoice{
    type: number;
    InvServiceGroupId:number;
    
}
export interface PagingInvoiceConfig extends PagingInvoice{
    type: number;
    ProjectId:number;
    TowerId:number;
    ZoneId:number;
    InvServiceGroupId:number;
    InvServiceId:number;

}
export interface PagingInvoiceContract extends PagingInvoice{
    Code: string;
    InvContractTypeId:number;
    InvContractGroupId:number;
    CustomerId:number;
    ProjectId:number;
    TowerId:number;
    ZoneId:number;
    FloorId:number;
    ApartmentId:number;
}
export interface PagingContractService extends PagingInvoice{
    Code: string;
    CustomerId:number;
    ProjectId:number;
    TowerId:number;
    FloorId:number;
    ApartmentId:number;
}
