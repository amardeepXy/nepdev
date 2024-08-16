import { createUserAccount, signInUser, getAccount, logout, getUserFromDb } from '../appwrite/api';
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
        onSuccess: () => {
            console.log("success");
        },
        onError: () => {
            console.log("error");
        },
        staleTime: 60* 1000 * 15,
    })
}