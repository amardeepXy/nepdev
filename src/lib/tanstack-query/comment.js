import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommentsByPostId } from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

export const useGetCommentsByPostId = () => {
    return useInfiniteQuery({
        queryFn: (data) => getCommentsByPostId(data),
        getNextPageParam: (lastpage, allPages, lastPageParam) => {
            console.log(lastpage, allPages, lastPageParam);
            return null;
        },
        initialPageParam: null,
        queryKey: [postId, QUERY_KEYS.GET_POST_COMMENT],
        enabled: false,
        retry: 3,
        staleTime: 1 * 60 * 1000
    });
}