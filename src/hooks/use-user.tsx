import { useQuery } from "@tanstack/react-query";
import {  GetUsers,GetUserParams} from "../services/user-service";

export const useUserList = (params:GetUserParams) => {
    return useQuery({
        queryKey: ["users", params],
        queryFn: () => GetUsers.getAll(params),
        keepPreviousData: true,
    });
}
