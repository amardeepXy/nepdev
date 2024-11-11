import React, {useState, useEffect, memo} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSendUserVerificationEmail } from '@/lib/tanstack-query/account';


export default memo( function Verification() {

    const userVerification = useSelector(state => state.userVerification);
    const navigate = useNavigate();

    const {data: userVerificationResponse, mutate: sendUserVerificationEmail, isPending: isSendingUserVerificationEmail, isError: isSendingUserVerificationEmailError, error: userVerificationError, isSuccess: isSendingUserVerificationEmailSuccess} = useSendUserVerificationEmail();

    function handleUserVerification(){
        sendUserVerificationEmail();
    }

    useEffect(() => {
        console.log(userVerificationResponse);
    }, [userVerificationResponse]);

    return (
            <Card className="px-5 py-3">
                <CardHeader>
                    <CardTitle>Email Verification</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleUserVerification} disabled={isSendingUserVerificationEmail}>
                       {isSendingUserVerificationEmail ? 'Sending...' : isSendingUserVerificationEmailSuccess ? 'Resend email' : 'Send email'}
                    </Button>
                </CardContent>
                <CardDescription className="text-center mb-4">
                        Verfication link will be sent to <span className='font-semibold text-gray-300'>{userVerification?.user?.email}</span> 
                </CardDescription>

            </Card>
    )
});