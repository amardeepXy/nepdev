import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { login, setLoading } from "../lib/redux/features/authSlice";
import { getAccount, getUserFromDb, logout } from "@/lib/appwrite/api";
import { QUERY_KEYS } from "@/lib/tanstack-query/queryKeys";

export const useAutoLogin = () => {
    const [makeRequest, setMakeRequest] = useState(false);
    const [isSuccess, setSucces] = useState(null);
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    
    function setRequest(){
        setMakeRequest(true);
    }
    
    useEffect(() => {
        if (!makeRequest) return;
        console.log('i am custom hook useAutoLogin really fetching current user form database');
        dispatch(setLoading(true));
        getAccount().then(data =>{
            getUserFromDb(data.$id).then(user => {
                console.log(user);
                if(user.total === 0){
                    logout('current');
                    setSucces(false);
                    return;
                };
                dispatch(login(user.documents[0]));
                queryClient.setQueryData([QUERY_KEYS.GET_CURRENT_USER], user.documents[0]);
                setSucces(true);
            }).catch(err => {
                console.log(err);
            }) 
        }).finally(() => {
            dispatch(setLoading(false));
        })
    }, [makeRequest]);

    return {
        setRequest,
        isSuccess
    }
}