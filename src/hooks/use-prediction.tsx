import { useQuery } from "@tanstack/react-query";
import {  GetPredictions,GetPredictionParams} from "../services/prediction-service";


export const usePredictionList = (params:GetPredictionParams) => {
    return useQuery({

        queryKey: ["predictions", params],
        queryFn: () => GetPredictions.getAll(params),
        keepPreviousData: true,
    });
}   