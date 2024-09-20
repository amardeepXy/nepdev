import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BeerIcon, LucideEdit2, LucideForward } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { PostStats } from './'

const PostCard = ({ post, styles }) => {
  const navigate = useNavigate();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const optionsRef = useRef(null);
  const shouldPreventLinkClick = useRef(false); // Use ref to prevent link click

  // toggle option
  const toggleOptions = useCallback((event) => {
    event.stopPropagation(); // Prevent event propagation to document level
    setOptionsVisible((prevState) => !prevState);
    shouldPreventLinkClick.current = true;
  }, []);

  // outside of option click handle when option is visible
  const handleClickOutside = useCallback((event) => {
    if (optionsRef.current && !optionsRef.current.contains(event.target)) {
      setOptionsVisible(false);
      shouldPreventLinkClick.current = false;
    }
  }, []);

  // option click handle
  const handleLinkClick = useCallback(
    (event) => {
      if (optionsVisible) {
        event.preventDefault();
        setOptionsVisible(false);
        shouldPreventLinkClick.current = false;
      }
    },
    [optionsVisible]
  );

  // Option click handle
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOptionsVisible(false);
      }
    };

    if (optionsVisible) {
      document.addEventListener("mousedown", handleDocumentClick);
    } else {
      document.removeEventListener("mousedown", handleDocumentClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [optionsVisible, handleClickOutside]);

  const handleEditClick = () =>{
    navigate(`/edit/${post.$id}`);
  }

  return (
    <div className={`post-card p-1 sm:p-4 bg-white shadow-md rounded-lg mb-4 relative ${styles}`}>
      <div className="flex w-[100%] justify-between items-center">
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
              post.postedBy?.imageUrl ||
              "/assets/icons/profile-placeholder.svg"
            }
            className="w-8 h-8 rounded-full"
            alt=""
          />
          <div className="flex flex-col">
            <p className="font-medium">{post.postedBy?.name}</p>
            <div className="dark:text-gray-400 text-gray-600 text-sm flex items-center gap-1">
              <p>{timeAgo(post.$createdAt)}</p>
              <p>•</p>
              <p className="truncate w-24">{post?.location}</p>
            </div>
          </div>
        </Link>
        {/* //* Options */}
        <div className="relative" ref={optionsRef}>
          <button
            className="bg-transparent border-none"
            onClick={toggleOptions}
          >
            <img
              src="/assets/icons/three-dots.svg"
              alt="three dots"
              width={24}
              height={24}
              className="dark:invert"
            />
          </button>
          {optionsVisible && (
            <div className="absolute right-0 mt-2 bg-background border-background shadow-lg rounded-lg z-10">
              <ul className="px-2 w-32 ">
                <li className="w-full py-1">
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 w-full flex-between gap-2 rounded-sm" onClick={handleEditClick} >
                    <LucideEdit2 width={20} height={20} /> Edit
                  </button>
                </li>
                <li className="border-t border-gray-300 w-full py-1">
                  <button className="p-2 w-full hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer rounded-md flex-between gap-2">
                    <LucideForward width={20} height={20} /> Share
                  </button>
                </li>
                <li className="border-t border-gray-300 w-full py-1">
                  <button className="p-2 w-full hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer rounded-md flex-between gap-2 text-red ">
                    <BeerIcon width={20} height={20} /> Delete
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/*  Actual post (it shows - image, caption, tags) */}
      <Link to={`post/${post.$id}`} className="w-full" >
      <div className="sm:px-2 py-3">
        <p className="body-regular py-2 text-base leading-5 sm:leading-6 font-semibold dark:text-zinc-100 text-gray-800 ">
          {post.caption}
        </p>
        <p className="text-sm dark:text-zinc-300 text-gray-600">
          {post.tags?.map((tag) => `#${tag} `)}
        </p>
      </div>
      { post.imageURL &&
      <img
        src={post.imageURL || "/assets/images/post-placeholder.svg"}
        className="rounded-lg mb-2 object-center object-cover h-64"
        alt="post"
      />}
      </Link>
      <PostStats post={post} />
    </div>
  );
};

export default PostCard;
