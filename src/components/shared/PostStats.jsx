import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Forward, Heart, MessageCircleMore } from "lucide-react";
import { useSelector } from "react-redux";
import { useLikePost, useSavePost } from "@/lib/tanstack-query/posts";
import { useGetUserFromDb } from "@/lib/tanstack-query/account";
import { useToast, ToastAction } from "../ui";
import { Button } from "../ui";
import { inArray } from "@/lib/utils";
import { Dialog, DialogHeader, DialogContent, DialogTrigger, DialogTitle } from "../ui/dialog";
import { CommentContainer } from "./comments";

const PostStats = ({ post, toHide=[] }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: user } = useGetUserFromDb();
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, data: savedPostData, isSuccess: isPostSaved, isError: isPostSaveError, error: postSaveError, isPending: isSavingPost } = useSavePost();
  const [postLikers, setPostLikers] = useState(post.likes.map((like) => like.$id));
  const [isSaved, setIsSaved] = useState(false);
  const [savedPostRecord, setSavedPostRecord] = useState(null);


  useEffect(() => {
    if( isAuthenticated && !savedPostData){
      setSavedPostRecord(user?.saves.find((savedItem) => savedItem.post?.$id === post.$id))
    };
    if(!isAuthenticated){
      setIsSaved(false);
    }
    if (isAuthenticated && savedPostRecord) {
      setIsSaved(true);
    }
  }, [ isAuthenticated, savedPostRecord]);

  useEffect(() => {
      if(isPostSaved && savedPostData?.$id){
          setSavedPostRecord(savedPostData);
      }else if(isPostSaveError && postSaveError){
          setIsSaved(prev => !prev);
          toast({description: postSaveError.message})
      }
  }, [ isPostSaved, isPostSaveError]);

  const hasLikedPost = useCallback(() => {
    if (!isAuthenticated) return false;
    return postLikers.includes(user?.$id);
  }, [isAuthenticated, postLikers, user]);

  const handleLikePost = () => {
    if (!isAuthenticated) {
      toast({
        description: "You need to be logged in to like a post",
        action: (
          <ToastAction altText="Login" onClick={() => navigate("/sign-in")}>
            Login
          </ToastAction>
        ),
      });
      return;
    }

    const updatedLikes = hasLikedPost()
      ? postLikers.filter((like) => like !== user?.$id)
      : [...postLikers, user?.$id];

    setPostLikers(updatedLikes);
    likePost({ postId: post.$id, likesArray: updatedLikes });
  };

  const handleSavePost = () => {
    if (!isAuthenticated) {
      toast({
        description: "You need to be logged in to save a post",
        action: (
          <ToastAction altText="Login" onClick={() => navigate("/sign-in")}>
            Login
          </ToastAction>
        ),
      });
      return;
    }

    if (isSaved && !isSavingPost) {
      setIsSaved(false);
      console.log(savedPostRecord, user);
      savePost(
        { postId: savedPostRecord.$id, userId: user?.$id, operation: "DELETE" },
      );
    } else if(!isSaved && !isSavingPost) {
      setIsSaved(true);
      savePost(
        { postId: post.$id, userId: user?.$id, operation: "ADD" },
      );
    }else if(isSavingPost){
      toast({description: "Please wait previous operation to finish"})
    }
  };

  return (
    <div className="flex justify-between py-2">
      <Button variant="ghost" className={`shad-btn_ghost ${inArray(toHide, 1) === 1 && 'hidden'}`} onClick={handleLikePost}>
        <Heart width={22} fill={hasLikedPost() ? "black" : "none"} className="dark:invert-white" />
        <span className="ml-1.5 text-xl">{postLikers.length}</span>
      </Button>

{/* // comment button */}
      <Dialog>
        <DialogTrigger className={`${inArray(toHide, 2) ===2 && 'hidden'}`} asChild >
      <Button variant="ghost" className={`shad-btn_ghost `}>
        <MessageCircleMore />
        <span className="ml-1.5 text-xl">{post.comment?.length}</span>
      </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]" >
          <DialogHeader>
            <DialogTitle>
              Comments
            </DialogTitle>
          </DialogHeader>
        <CommentContainer post={post} />
        </DialogContent>
      </Dialog>

      <Button variant="ghost" className={`shad-btn_ghost ${inArray(toHide, 3) === 3 && 'hidden'}`} onClick={handleSavePost}>
        <img
          src={`/assets/icons/${isSaved ? "saved" : "save"}.svg`}
          alt="save-icon"
          className="dark:invert-white w-5"
        />
     
      </Button>

      <Button variant="ghost" className={`shad-btn_ghost ${inArray(toHide, 4) === 4 && 'hidden'} `}>
        <Forward />
      </Button>
    </div>
  );
};

export default PostStats;

