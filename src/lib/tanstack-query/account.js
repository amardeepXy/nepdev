import { createUserAccount, signInUser, getAccount, logout, getUserFromDb, getAllUsers, getUserById, sendVerificationEmail } from '../appwrite/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';

export const useCreateUserAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ name, username, email, password }) => createUserAccount({ name, username, email, password }),
        onSuccess: (data) => {
            console.log( 'from account.js logging for useCreateUserAccount',data);
            queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], data);
        }
    })
}

export const useLoginUser = () => {
    return useMutation({
        mutationFn: ({ email, password }) => signInUser({ email, password }),
    });
};

export const useGetAccount = () =>{

    return useQuery({
        queryFn: () => getAccount(),
    })
}

export const useLogout = () =>{

    return useMutation({
        mutationFn: () => logout(),
    })
}

export const useGetUserFromDb = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: () => getUserFromDb(),
        staleTime: 60* 1000 * 5
    })
}

export const useGetAllUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn: () => getAllUsers(),
        staleTime: 1000 * 60 * 2
    })
}

export const useGetUserById = (userId) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        staleTime: 1000 * 60 * 1.5,
        enabled: !!userId
    })
}

export const useSendUserVerificationEmail = () => {
    return useMutation({
        mutationFn: sendVerificationEmail,
        onSuccess: (data) => console.log(data)
    });
}