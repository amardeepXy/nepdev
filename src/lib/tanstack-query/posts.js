import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, getPostById, getRecentPost, likePost, savePost, updatePostById } from '../appwrite/api';
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