import { GridPostList } from "@/components/shared";
import { Button } from "@/components/ui";
import { useGetUserById } from "@/lib/tanstack-query/account";
import {
  ArrowLeft,
  ImageOff,
  Images,
  LucideHeart,
  UserRoundXIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();
  const {
    data: userAccInfo,
    isLoading: isLoadingUserData,
    isError,
    error,
  } = useGetUserById(userId);
  const navigate = useNavigate();

  const [userAccount, setUserAccount] = useState(
    userAccInfo ? userAccInfo?.documents[0] : null
  );
  const [vewing, setVewing] = useState("POSTS");

  useEffect(() => {
    if (!isLoadingUserData && !isError && userAccInfo) {
      setUserAccount(userAccInfo ? userAccInfo?.documents[0] : null);
    }
  }, [userAccInfo, isLoadingUserData, isError]);

  if (isError) {
    return (
      <div className="flex-center w-full min-h-screen">
        <div className="flex flex-col gap-4">
          <h2 className="text-red h2-bold">
            {error?.message || "OOPS!, We are having trouble."}
          </h2>
        </div>
      </div>
    );
  }

  if (userAccInfo && userAccInfo.total === 0) {
    return (
      <div className="flex-center w-full min-h-screen">
        <div className="flex flex-col gap-4 items-center">
          <UserRoundXIcon color="rgba(245, 70, 50)" className="w-14 h-14" />
          <h2 className="text-red h3-bold">
            {error?.message || "OOPS, No user found!"}
          </h2>
        </div>
      </div>
    );
  }

  if (isLoadingUserData) {
    return (
      <div className="flex-center w-full min-h-screen">
        <img
          src="/assets/animation/loading.gif"
          alt="Loading..."
          className="dark:invert"
        />
      </div>
    );
  }
  console.log(userAccount);
  return (
    <div className="profile-container">
      <div className="w-full flex items-center">
        <Button variant={"ghost"} onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
      </div>

      <div className="profile-inner_container">
        <div className="flex-col md:flex-row flex gap-4 md:gap-5 items-center">
          <img
            src={userAccount?.imageUrl}
            alt="profile"
            className="rounded-full w-16 md:w-20"
          />
          <div className="flex flex-col items-center">
            <h1 className="text-center">@{userAccount?.username}</h1>
            <h2>{userAccount?.name}</h2>
          </div>
        </div>
        <div className="flex gap-3 dark:bg-dark-2 bg-light-2 px-5 py-3">
          <p>2 Follower</p>
          <p>2 Following</p>
        </div>
        <div className="flex flex-col p-3 w-full ">
          <div className="flex w-full gap-2">
            <Button
              variant="ghost"
              className={`flex-1 bg-light-2 dark:bg-dark-2 dark:hover:bg-dark-3 hover:bg-light-3 ${
                vewing === "POSTS" && "dark:bg-dark-1 bg-light-4"
              }`}
              onClick={() => setVewing("POSTS")}
            >
              <Images />
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 bg-light-2 dark:bg-dark-2 dark:hover:bg-dark-3 hover:bg-light-3 ${
                vewing === "LIKED" && "dark:bg-dark-1 bg-light-4"
              } `}
              onClick={() => setVewing("LIKED")}
            >
              <LucideHeart />
            </Button>
          </div>
          <div id="posts" className="w-full mt-5">
            <ul className="grid grid-cols-3 md:grid-cols-5 gap-1">
              {vewing === "POSTS"
                ? userAccount?.posts?.map((post) => (
                    <li className="w-full">
                      <Link className="w-full" to={`/post/${post.$id}`}>
                        {post?.imageURL ? (
                          <img
                            src={post?.imageURL}
                            alt="post"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageOff className="w-[90%] h-[90%] opacity-65" />
                        )}
                      </Link>
                    </li>
                  ))
                : userAccount?.likedPosts?.map((post) => (
                    <li className="w-full">
                      <Link className="w-full" to={`/post/${post.$id}`}>
                        {post?.imageURL ? (
                          <img
                            src={post?.imageURL}
                            alt="post"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageOff className="w-[90%] h-[90%] opacity-65" />
                        )}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
