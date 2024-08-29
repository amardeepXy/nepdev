import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PostStats } from ".";

const GridPostList = ({ postsList, showUser = true, showStats = true }) => {
  const currentUser = useSelector((state) => state.auth.user);
  console.log("helo");
  return (
    <>
      <ul className="grid-container">
        {postsList.map((post) => (
          <li key={post.$id} className="grid-post_link relative">
              {post.imageURL ? (
                  // If post have image
                <>
            <Link to={`/post/${post.$id}`}>
                  <img
                    src={post.imageURL}
                    alt="post"
                    className="w-full h-full object-cover"
                  />
                  {showUser && (
                    <div className="flex absolute px-4 py-3 bottom-0 bg-gray-400/50 dark:bg-gray-800/50 backdrop-blur-sm w-full gap-x-2 zoom-in-90">
                      <img
                        src={post.postedBy.imageUrl}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="self-start ">{post.postedBy.name}</span>
                      {showStats && (
                        <div className="absolute right-0 bottom-1"><PostStats post={post} toHide={[2, 4]} /></div>
                      )}
                    </div>
                  )}
                  </Link>
                </>
              ) : (
                // If post has no image
                <>
                <h1 className="body-regular py-2 text-base leading-5 sm:leading-6 font-semibold dark:text-zinc-100 text-gray-800">
                  {post.caption}
                </h1>
                </>
              )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default GridPostList;
