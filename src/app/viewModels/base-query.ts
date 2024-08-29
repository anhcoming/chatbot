export class CheckRole {
    View: boolean = false;
    Create: boolean = false;
    Update: boolean = false;
    Delete: boolean = false;
    Import: boolean = false;
    Export: boolean = false;
    Print: boolean = false;
    Other: boolean = false;
    Menu: boolean = false;
}
export class Paging {
    page: number = 1;
    page_size: number = 10;
    groupCard: number = 1;
    vehicleId: number = 0;
    query: string = "1=1";
    type: string = "1";
    ProjectId: string = "";
    TowerId: string = "";
    FloorId: string = "";
    ApartmentId: string = "";
    order_by: string = "";
    item_count: number = 0;
    select: string = "";
    dateStart: any;
    dateEnd: any;
    status?: number;
  }

  export class QueryFilter {
    txtSearch: string | undefined;
    type: number | undefined;
    title: number | undefined;
    typeAttributeId: number | undefined;
    typeFormId: number | undefined;
    dateStart: any;
    dateEnd: any;
    targetId_1: number | undefined;
    targetId_2: number | undefined;
    targetId_3: number | undefined;
    targetId_4: number | undefined;
    targetId_5: number | undefined;
    targetId_6: number | undefined;
    targetId_7: number | undefined;
    targetId_8: number | undefined;
    targetId_9: number | undefined;
    projectId: number | undefined;
    contractId: number | undefined;
  }
