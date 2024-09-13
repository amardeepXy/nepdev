import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PostCard, PostStats } from ".";

const GridPostList = ({ postsList, showUser = true, showStats = true }) => {
  console.log({postsList});
  return (
    <>
      <ul className="grid-container">
        {postsList.map((post) => (
          <li key={post.$id} className="grid-post_link relative w-full">
              {post.imageURL ? (
                  // If post have image
                <>
            <Link to={`/post/${post.$id}`}>
                  <img
                    src={post.imageURL}
                    alt="post"
                    className="w-full h-full object-cover"
                  />
                </Link>
                  {showUser && (
                    <div className="flex absolute px-4 py-3 bottom-0 bg-gray-400/50 dark:bg-gray-800/50 backdrop-blur-sm w-full gap-x-2 zoom-in-90">
                      <img
                        src={post.postedBy.imageUrl}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="self-start ">{post.postedBy.name}</span>
                      </div>
                      )}
                      {showStats && (
                        <div className={`absolute right-0 bottom-1 z-50 from-zinc-800/45 rounded-md to-zinc-500/35 ${!showUser && 'backdrop-blur bg-gradient-to-l' }`}><PostStats post={post} toHide={[2, 4]} /></div>
                      )}
                </>
              ) : (
                // If post has no image
                <>
                <PostCard post={post} styles={'h-full justify-between w-full'} />
                
                </>
              )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default GridPostList;
