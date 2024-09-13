import React, { useEffect, useState } from "react";
import { GridPostList } from "@/components/shared";
import { useSelector } from "react-redux";
import { useGetSavedPost } from "@/lib/tanstack-query/posts";
import { Button } from "@/components/ui";
import { CrossIcon, UserXIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Saved = () => {
  const { isLoading: isAppStateLoading, user, isAuthenticated,} = useSelector((state) => state.auth);
  const { data: savedPost, isLoading: isGettingSavedPost, error: getSavedPostErr, isError: isGetSavedPostErr } = useGetSavedPost(user?.$id);
  const [modSavedpost, setModSavedPost] = useState( savedPost?.documents.map((savedPost) => savedPost.post));
  const navigate = useNavigate();

  useEffect(() => {
    if(savedPost){
      setModSavedPost(savedPost?.documents.map((savedPost) => savedPost.post));
    }
  }, [savedPost]);

  if (isAppStateLoading || isGettingSavedPost || !savedPost || !modSavedpost) {
    return (
      <div className="flex-center w-full">
        <div>
          <img
            src="assets/animation/loading.gif"
            alt="Loading..."
            className="dark:invert "
          />
        </div>
      </div>
    );
  } else if (!isAuthenticated) {
    return (
      <div className="flex-center w-full">
        <div className="flex flex-col gap-5 items-center">
          <UserXIcon size={30} />
          <Button variant="outline" onClick={() => navigate('/sign-in') } >Login</Button>
        </div>
      </div>
    );
  }

  if (isGetSavedPostErr) {
    return (
      <div className="flex-center w-full">
        <div className="flex flex-col gap-3 text-red items-center">
          <CrossIcon size={30} className="rotate-45 fill-red" />
          <h3 className="h3-bold text-foreground/800">
            {getSavedPostErr.message}
          </h3>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full saved-container">
      {savedPost ? (
        <div className="w-full">
          <GridPostList postsList={modSavedpost} showUser={false} />
        </div>
      ) : (
        "uknown error detected"
      )}
    </div>
  );
};

export default Saved;
