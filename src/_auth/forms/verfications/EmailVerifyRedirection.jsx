import react, {useEffect} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui';
import { useDispatch } from 'react-redux';
import { useVerifyEmailWithSecret } from '@/lib/tanstack-query/account';
import {setLoading} from '@/lib/redux/features/userVerificationSlice';
import { ErrorLabel } from '@/components/shared';

export default function EmailVerifyRedirection() {

    const {mutate:verifyEmail, data: verifyEmailData, isError: isVerifyEmailErr, error: verifyEmailErr, isSuccess: isVerifyEmailSuccess, isPending: isVerifyingUserEmail} = useVerifyEmailWithSecret();

    const searchParam = useSearchParams()[0];
    const navigate = useNavigate();
    const {toast} = useToast();
    const dispath = useDispatch();

    // Search param userId and secret checking
    useEffect(() => {
        const params = Object.fromEntries(searchParam.entries());
        console.log(params);
        if(!params.userId || !params.secret){
            toast({title: 'Invalid link', variant: 'destructive'});
            navigate('/');
            return;
        }
        dispath(setLoading(true));
        verifyEmail({userId: params.userId, secret: params.secret});
    }, [searchParam]);

    // Verify email success handle
    useEffect(() => {
        if(!isVerifyEmailSuccess) return;
        toast({title: 'Your email has been verified', variant: 'success'});
        dispath(setLoading(false));
        navigate('/');
        console.log(verifyEmailData);
    }, [isVerifyEmailSuccess]);


    return (
        <div className='border dark:bg-gray-900 min-w-64 max-w-72 p-4 flex flex-col items-center gap-3 rounded-sm'>
            <h1 className='text-3xl font-bold'>Verification</h1>

            <div className='text-opacity-90'>
            <p>
                {isVerifyingUserEmail && "Please wait verifying"}
                {isVerifyEmailErr && <ErrorLabel>{verifyEmailErr.message}</ErrorLabel>}
            </p>
            </div>
        </div>
    );
}