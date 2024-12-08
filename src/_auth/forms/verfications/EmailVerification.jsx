import React, {useEffect, memo} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSendUserVerificationEmail, useGetAccount} from '@/lib/tanstack-query/account';
import { ErrorLabel } from '@/components/shared';

export default memo( function Verification() {

    const userVerification = useSelector(state => state.userVerification);
    const navigate = useNavigate();

    const {data: userVerificationResponse, mutate: sendUserVerificationEmail, isPending: isSendingUserVerificationEmail, isError: isSendingUserVerificationEmailError, error: userVerificationError, isSuccess: isSendingUserVerificationEmailSuccess} = useSendUserVerificationEmail();
    const {data: account, isError: accountError, isSuccess: accountSuccess, isPending: accountPending} = useGetAccount();

    function handleUserVerification(){
        sendUserVerificationEmail();
    }

    useEffect(() => {
        if(accountSuccess && account.emailVerification){
            navigate('/');
        }
    }, [account, accountPending, accountError, accountSuccess]);

    return (
            <Card className="px-5 py-3 dark:bg-gray-900 min-w-64 max-w-72">
                <CardHeader>
                    <CardTitle>Email Verification</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleUserVerification} disabled={isSendingUserVerificationEmail}>
                       {isSendingUserVerificationEmail ? 'Sending...' : isSendingUserVerificationEmailSuccess ? 'Resend email' : 'Send email'}
                    </Button>
                </CardContent>
                <CardDescription className="text-center mb-4">
                       {accountPending&& "Checking email status..."} {accountError && "Error" }  <br />Verfication link will be sent to <span className='font-semibold text-gray-300'>{userVerification?.user?.email}</span> 
                        <br />
                        {isSendingUserVerificationEmailError && <ErrorLabel>{userVerificationError.message}</ErrorLabel>}
                </CardDescription>

            </Card>
    )
});