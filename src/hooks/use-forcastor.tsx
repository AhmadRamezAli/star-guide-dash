import { useQuery } from "@tanstack/react-query";
import {  GetForcastors,GetForcastorParams} from "../services/forcastor-service";

export const useForcastorList = (params:GetForcastorParams,enabled:boolean) => {
    return useQuery({
        queryKey: ["forcastors", params],
        queryFn: () => GetForcastors.getAll(params),
        keepPreviousData: true,
        enabled: enabled,
    });
}   