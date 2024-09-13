import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { createPost, getPopularPost, getPostById, getRecentPost, getSavedPost, likePost, savePost, searchPosts, updatePostById } from '../appwrite/api';
import { QUERY_KEYS } from './queryKeys';

const { GET_RECENT_POSTS, GET_POST_BY_ID, GET_POSTS, GET_CURRENT_USER } = QUERY_KEYS;

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post) => {
            return createPost(post);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [GET_RECENT_POSTS]
            });
        }
    })
}

export const useGetRecentPosts = () => {

    return useQuery({
        queryKey: [GET_RECENT_POSTS],
        queryFn: () => getRecentPost(),
        staleTime: Infinity
    })
}

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
       
       mutationFn: ({postId, likesArray}) => {
        return likePost(postId, likesArray);
       }, 
       onSuccess: (data) =>{
        queryClient.invalidateQueries({queryKey: [GET_POST_BY_ID, data.$id]});
        queryClient.invalidateQueries({queryKey: [GET_RECENT_POSTS]});
        queryClient.invalidateQueries({queryKey: [GET_CURRENT_USER]});
        queryClient.invalidateQueries({queryKey: [GET_POSTS]});
       }
    })
}

export const useSavePost = () =>{

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({postId, userId, operation}) => {
            console.log(postId, userId, operation);
            return savePost(postId, userId, operation);
        }, 
        onSuccess: (data) =>{
            queryClient.invalidateQueries({queryKey: [GET_POST_BY_ID, data.$id]});
            queryClient.invalidateQueries({queryKey: [GET_RECENT_POSTS]});
            queryClient.invalidateQueries({queryKey: [GET_CURRENT_USER]});
            queryClient.invalidateQueries({queryKey: [GET_POSTS]});
        }
    })
}

export const useGetPostById = (postId) => {
    return useQuery({
        queryKey: [ GET_POST_BY_ID ,postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId,
        staleTime: 2 * 60 * 1000
    })
}

export const useUpdatePost = () =>{
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: ({postId, updatedPostData, prevPostData}) => updatePostById(postId, updatedPostData, prevPostData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: [ QUERY_KEYS.GET_POST_BY_ID, data.$id]});
            queryClient.invalidateQueries({queryKey: [ QUERY_KEYS.GET_RECENT_POSTS]})
        }
    })
}

export const useGetPopularPost = (isEnabled) => {
    console.log('why i am being called this much time');
    return useInfiniteQuery({
        initialPageParam: null ,
         queryKey: [QUERY_KEYS.GET_INFINITE_POSTS], 
        queryFn: getPopularPost, 
        initialPageParam: 1,
        getNextPageParam: (lastpage) => {
            if(lastpage.documents.length < 10){
                return null;
            };
            return lastpage.documents[lastpage.documents.length - 1].$id;
        },
        enabled: isEnabled,
        staleTime: 1500
    })
}

export const useSearchPost = (searchTerm) => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: ({pageParam}) => searchPosts(pageParam, searchTerm),
        enabled: !!searchTerm,
        staleTime: 1500,
        getNextPageParam: (lastpage) => {
            if(lastpage.documents.length < 10){
                return null;
            }
            
            return lastpage.documents[lastpage.documents.length -1].$id;
        }
    })
}

export const useGetSavedPost = (userId) => {
    console.log(userId);
    console.log(typeof userId !== 'undefined');
   return useQuery({
        queryKey: [QUERY_KEYS.GET_SAVED_POST],
        queryFn: () => getSavedPost(userId),
        enabled: typeof userId !== 'undefined',
        staleTime: 1000 * 60 * 2
    })
}