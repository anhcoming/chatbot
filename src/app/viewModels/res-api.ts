export interface ResApi {
    data: any;
    meta: ResApiMeta;
    metadata: number;
}

export interface ResApiMeta {
    error_code: number;
    error_message: string;
}
