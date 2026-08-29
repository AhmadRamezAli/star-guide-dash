import { useQuery } from "@tanstack/react-query";
import {  getForcastors,GetForcastorParams} from "../services/forcastor-service";

export const useForcastorList = (params:GetForcastorParams,enabled:boolean) => {
    return useQuery({
        queryKey: ["forcastors", params],
        queryFn: () => getForcastors.getAll(params),
        keepPreviousData: true,
        enabled: enabled,
    });
}   