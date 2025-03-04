import { useGetCommentsByPostId } from "@/lib/tanstack-query/comment";
import { EachComment } from "./EachComment";
import { useEffect, useState } from "react";

export function Comments({commentId, asChild=false}){
    const {refetch, data, error, isError} = useGetCommentsByPostId();
    const [comments, setComments] = useState([]);

    useEffect(() => {
        console.log({refetch, data, error, isError});
    }, [data, error, refetch, isError])

    return <div>
        i am comments

        <EachComment cmtDoc={"helo vi kaise ho thik ho na"} />
    </div>
}