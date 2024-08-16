import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  } from "@/components/ui/form"
  import { createPostSchema } from "@/lib/validation"
import { Button, Input, Textarea } from "@/components/ui"
import FileUploader from "../shared/FileUploader";
import { useCreatePost, useUpdatePost } from '@/lib/tanstack-query/posts';
import { useToast } from "../ui/use-toast";
import { Action } from "@radix-ui/react-toast";
import { Loader } from "lucide-react";

  const PostForm = ({post, action}) => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { mutate: createPost, isPending: isCreating, isError: isCreateError, error: createError, isSuccess: isCreatedPost } = useCreatePost();
    const {mutate: updatepost, isPending: isUpdating, isError: isUpdatePostError, error: updatePostError, isSuccess: isPostUpdated} = useUpdatePost();

    const form = useForm({
      resolver: zodResolver(createPostSchema),
      defaultValues: {
        caption: post?.caption || "n",
        files: post?.imageURL || [],
        tags: post?.tags.join(",") || '',
        location: post?.location || "",
      }
    });

    // useEffect(() => {
    //   if(!isAuthenticated){
    //     navigate('/')
    //   }
    // }, [isAuthenticated, action]);

    // Error and Success handling of Post Creation
    useEffect(() =>{
      if(isCreateError){
        console.log(createError);
        toast({title: createError.name, description: createError.message, variant: 'destructive'});
        // toast({title: 'please try again'});
      }
      if(isCreatedPost){
        toast({title: 'Sucessfully created post'});
        form.reset();
        navigate('/');
      }
    }, [isCreateError, isCreatedPost])

    useEffect(() => {
      if(isUpdatePostError){
        toast({title: updatePostError.message, variant: 'destructive'});
      }else if(isPostUpdated){
        toast({title: 'Post updated!'});
        form.reset();
        navigate('/');
      }
    }, [isUpdatePostError, isPostUpdated, updatePostError]);

    // Define the submit handler
    function onSubmit(values) {
      if(!isAuthenticated){
        toast({title: 'please login!', variant: 'destructive', action: <Action altText="login" onClick={() => navigate('/sign-in')} />});
        navigate('/');
        return void 0;
      }

      if(action === 'UPDATE'){
        updatepost({postId: post.$id, updatedPostData: values, prevPostData: post});
        return;
      }

      // Call create post mutation
      createPost({...values, accountId: user.$id });
    }
 
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full md:px-2">

      {/* //* Descrition Field */}
      <FormField
        control={form.control}
        name="caption"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Caption</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter Description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="files"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shots</FormLabel>
            <FormControl>
              <FileUploader mediaUrl={post?.imageURL} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* //* Location Field */}
       <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Enter Location" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* //* Tags Field */}
       <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Add Tags (separated by ' , ') </FormLabel>
            <FormControl>
              <Input placeholder="Eg. nextjs, python" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button disabled={action === 'UPDATE'? !form.formState.isDirty || isUpdating : isCreating} type="submit">{ isCreating || isUpdating? <Loader className="h-full" /> : action === 'UPDATE'? 'Update': 'Create'}</Button>
    </form>
  </Form>
  )
}

export default PostForm;