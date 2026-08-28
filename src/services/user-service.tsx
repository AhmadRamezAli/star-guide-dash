import {  TimeUnits,ZodiacSign} from "../types/enums";
import {UserDto,UserListDto,UserCreateOrUpdateDto} from "../types/user";
import {  apiClient} from "./apiClient";


export interface GetUserParams{
    keyword?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
}

export const getUsers = {
    getAll: async (params: GetUserParams):
     Promise<ApiResult<UserListDto[]>> => {
        const response = await apiClient.get<UserListDto[]>("/api/user/get-all",
             { params });    
        return response.data;
    },
    getById: async (id: string): Promise<ApiResult<UserDto>> => {
        const response = await apiClient.get<UserDto>(`/api/user/${id}`);
        return response.data;
    }
}
export const createUser =
async (user: UserCreateOrUpdateDto):
 Promise<ApiResult<UserDto>> => {
    const response = await apiClient.post<UserDto>("/api/user/create", user);
    return response.data;
}
export const updateUser =
async (user: UserCreateOrUpdateDto):
 Promise<ApiResult<UserDto>> => {
    const response = await apiClient.post<UserDto>("/api/user/update", user);
    return response.data;
}