import { TimeUnits,ZodiacSign } from "../types/enums";
import { ForcastorDto,ForcastorListDto,
    ForcastorCreateOrUpdateDto } from "../types/forcastor";
import { apiClient } from "./apClient";


export interface GetForcastorParams {
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
}


export const getForcastors = {
    getAll: async (params: GetForcastorParams):
     Promise<ApiResult<ForcastorListDto[]>> => {
        const response = await apiClient.get<ForcastorListDto[]>("/api/forcastor/get-all",
             { params });    
        return response.data;
    },
    getById: async (id: string): Promise<ApiResult<ForcastorDto>> => {
        const response = await apiClient.get<ForcastorDto>(`/api/forcastor/${id}`);
        return response.data;
    }
}

export const createForcastor =
async (forcastor: ForcastorCreateOrUpdateDto):
 Promise<ApiResult<ForcastorDto>> => {
    const response = await apiClient.post<ForcastorDto>("/api/forcastor/create", forcastor);
    return response.data;
}

export const updateForcastor =
async (forcastor: ForcastorCreateOrUpdateDto):
 Promise<ApiResult<ForcastorDto>> => {
    const response = await apiClient.post<ForcastorDto>("/api/forcastor/update", forcastor);
    return response.data;
}