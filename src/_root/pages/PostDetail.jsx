import React, {useState, useEffect} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LucideEdit2, LucideForward, BeerIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Button } from '@/components/ui'
import { timeAgo } from "@/lib/utils";
import { PostStats } from "@/components/shared";
import { useGetPostById } from "@/lib/tanstack-query/posts";

function PostDetails() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const {data: post,isLoading: isPostLoading,isError: isGetPostByIdErr,error: getPostByIdErr,refetch: reloadPost,isRefetching: isReloadingPost, status} = useGetPostById(postId);


  if (isPostLoading || status === 'pending' ) {
    return (
      <>
        <div className="w-full grid place-items-center h-full">
          <img
            src="/assets/animation/loading.gif"
            alt="loading"
            className="animate-pulse dark:invert"
          />
        </div>
      </>
    );
  }

  if (isGetPostByIdErr || !post ) {
    return (
      <>
        <div className="w-full flex flex-col justify-center items-center gap-2">
          <p className="error-message-body">{getPostByIdErr?.message || `unwanted something happend ${status}` }</p>
          <Button variant="outline" onClick={() => reloadPost()}>
            <img
              src={`/assets/icons/reload.svg`}
              className={`dark:inver-white ${
                isReloadingPost && "animate-spin"
              }`}
              alt="refresh"
            />
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="common-container">
      <div className="post-card p-4 bg-white shadow-md rounded-lg mb-4 relative">
        <div className="flex justify-between items-center">
          <Link
            to={`/user/${post?.postedBy?.$id}`}
            className="flex items-center gap-2"
            onClick={(event) => {
              if (shouldPreventLinkClick.current) {
                handleLinkClick(event);
              }
            }}
          >
            <img
              src={
                post?.postedBy?.imageUrl ||
                "./assets/icons/profile-placeholder.svg"
              }
              className="w-10 rounded-full"
              alt="post"
            />
            <div className="flex flex-col">
              <p className="font-medium">{post?.postedBy?.name}</p>
              <div className="dark:text-gray-400 text-gray-600 text-sm flex items-center gap-1">
                <p>{timeAgo(post?.$createdAt)}</p>
                <p>•</p>
                <p className="truncate w-24">{post?.location}</p>
              </div>
            </div>
          </Link>
          {/* //* Options */}
          <DropdownMenu className="p-0 backdrop-blur-sm bg-background/15">
            <DropdownMenuTrigger>
              <img src="/assets/icons/three-dots.svg" alt="menu" className=" w-7 dark:invert-white" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" outline-1 border-gray-400 dark:border-gray-800  py-1.5 px-0 [&>*]:p-0 [&>*>button]:w-11/12 
             [&>*]:flex-center [&>*>button]:m-auto [&>*>button>svg]:w-6 [&>*]:menu-dropdown-button backdrop-blur">
              <DropdownMenuItem ><Button variant="ghost" className="menu-dropdown-button"><LucideForward/> <span>Share</span> </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Button variant="ghost" className='menu-dropdown-button' ><BeerIcon/><span>Delete</span></Button></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/*  Actual post (it shows - image, caption, tags) */}
          <div className="px-5 py-3">
            <p className="body-regular py-2 text-base leading-6 font-semibold dark:text-zinc-100 text-gray-800 ">
              {post?.caption}
            </p>
            <p className="text-sm dark:text-zinc-300 text-gray-600">
              {post?.tags?.map((tag) => `#${tag} `)}
            </p>
          </div>
          {post?.imageURL && (
            <img
              src={post?.imageURL || "/assets/images/post-placeholder.svg"}
              className="rounded-lg mb-2 object-center "
              alt="post"
            />
          )}
        <PostStats post={post} />
      </div>
    </div>
  );
}

export default PostDetails;
