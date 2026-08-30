import {  apiClient } from "./apiClient";
import {ApiResult } from "../types/api";
import { predictionDto,predictionListDto,predictionCreateOrUpdateDto  } from "../types/prediction";
import {  ZodiacSign} from "../types/enums";
export interface GetPredictionParams{

    date?: string;
    keyword?: string;
    zodiacSign?: ZodiacSign;
    pageNumber ?: number;
    pageSize ?: number;
    sortBy ?: string;
}


export const getPredictions ={
    getAll: async (params:GetPredictionParams):
     Promise<ApiResult<predictionListDto[]>> => {
        const response = await apiClient.get<predictionListDto[]>("/api/prediction/get-all",
             { params });    
        return response.data;

    },
    getById: async (id: string): Promise<ApiResult<predictionDto>> => {
        const response = await apiClient.get<predictionDto>(`/api/prediction/${id}`);
        return response.data;
    }}

export const createPrediction = 
async (prediction: predictionCreateOrUpdateDto):
 Promise<ApiResult<predictionDto>> => {
    const response = await apiClient.post<predictionDto>("/api/prediction/create", prediction);
    return response.data;
}

export const updatePrediction =
async (prediction: predictionCreateOrUpdateDto):
 Promise<ApiResult<predictionDto>> => {
    const response = await apiClient.post<predictionDto>("/api/prediction/update", prediction);
    return response.data;
}

export const deletePrediction = async (id: string): Promise<ApiResult<boolean>> => {
  // Standard RESTful DELETE request
  const response = await apiClient.delete<ApiResult<boolean>>(`/api/prediction/${id}`);
  return response.data;
};