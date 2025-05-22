export enum ResponseResultCode
{
    Success = 1,
    Failed = 2,
    NothingFound = 3
}

export class ResponseResult
{
    code: ResponseResultCode
    message: string
    value: any
    values: any[]
}