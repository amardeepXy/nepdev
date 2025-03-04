import { CommentForm } from "@/components/forms/commentForm";
import { Comments } from "./comments";

export function CommentContainer({post}){
    console.log(post)
    return <div>
        {/* comments */}
        <Comments commentId={post.comment} />
        {/* commenting form */}
        <CommentForm  />
    </div>
}