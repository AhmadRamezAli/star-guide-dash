import { TimeUnits,ZodiacSign } from "../types/enums";
import { ForcastorDto,ForcastorListDto,
    ForcastorCreateOrUpdateDto } from "../types/forcastor";
import { apiClient } from "./apiClient";


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

const buildForcastorFormData = (dto: ForcastorCreateOrUpdateDto): FormData => {
  const formData = new FormData();
  if (dto.id) formData.append("Id", dto.id);
  formData.append("Name", dto.name);
  formData.append("Description", dto.description);
  
  if (dto.rate !== null) formData.append("Rate", dto.rate.toString());
  if (dto.imageFile) formData.append("ImageFile", dto.imageFile);

  return formData;
};
export const createForcastor =
async (forcastor: ForcastorCreateOrUpdateDto):
 Promise<ApiResult<ForcastorDto>> => {
    const formData = buildForcastorFormData(forcastor);
    const response = await apiClient.post<ForcastorDto>("/api/forcastor/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}


export const updateForcastor =
async (forcastor: ForcastorCreateOrUpdateDto):
 Promise<ApiResult<ForcastorDto>> => {
    const formData = buildForcastorFormData(forcastor);
    const response = await apiClient.post<ForcastorDto>("/api/forcastor/update", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
}


export const deleteForcastor = async (id: string): Promise<ApiResult<boolean>> => {
  // Standard RESTful DELETE request
  const response = await apiClient.delete<ApiResult<boolean>>(`/api/forcastor/${id}`);
  return response.data;
};