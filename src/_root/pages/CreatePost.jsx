import React from 'react'
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PostForm from '@/components/forms/PostForm'
import { Button } from '@/components/ui';

const CreatePost = () => {
  const navigate = useNavigate();
  const {isAuthenticated} = useSelector((state) => state.auth);

  return (
    <div className='flex flex-1 plib-10'>
      <div className='common-container pb-8'>
        <div className='flex-start max-w-5xl gap-x-3 w-full px-2'>
          <img src="./assets/icons/add-post.svg" alt="create post" className='dark:invert-white' width={30} height={30} />
          <h3 className='text-[20px] font-semibold md:h2-bold text-left w-full' >Create Post</h3>
        </div>
      
      {!isAuthenticated? <div className='w-full bg-background text-foreground flex flex-col gap-2 items-center justify-center h-full'>
        <h1 className='h2-bold opacity-75'>Please login to create post</h1>
        <Button onClick={() => navigate('/sign-in')}>Login</Button>
      </div> : <PostForm/> }
      </div>
    </div>
  )
}

export default CreatePost