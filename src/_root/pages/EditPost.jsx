import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPostById } from '@/lib/tanstack-query/posts';
import { useToast } from '@/components/ui';
import PostForm from '@/components/forms/PostForm';

const EditPost = () => {
    const {postId} = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { data: postData, isLoading: isGettingPost, isError: isGettingPostError, error: gettingPostError } = useGetPostById(postId);
    const { isAuthenticated, isLoading, user } = useSelector(state => state.auth);
    console.log(user, isAuthenticated);

    useEffect(()=> {
        if(!isLoading && !isAuthenticated){
            toast({title: 'Login to access this page'});
            navigate('/sign-in');
        }else if(!isLoading && !isGettingPost){
            if(user.$id !== postData.postedBy.$id){
                toast({title: 'you are not authorised to access this page'});
                navigate('/'); 
            }
               
        }
    }, [isAuthenticated, user, postData, isGettingPost, isLoading]);


    if(isGettingPost){
        return (<>
            <div className='w-full h-full bg-background text-foreground grid place-items-center'>
             <h1 className='text-xl md:text-2xl animate-pulse'>Loading...</h1>
            </div>
        </>)
    }

    if(isGettingPostError){
        return <>
            <div className='w-full h-full bg-background text-rose-500 flex items-center justify-center flex-col'>
             <h1 className='text-xl md:text-2xl'>{gettingPostError.name}</h1>
             <p className='text-sm text-foreground opacity-85' > {gettingPostError.message} </p>
            </div>
        </>
    }

    return (<>
    <div className='common-container' >
        <h1 className='h2-bold self-start'>Edit post</h1>
      <PostForm post={postData} action="UPDATE" />
    </div>
    </>)
};

export default EditPost;