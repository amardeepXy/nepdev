import { useForm } from "react-hook-form";
import {
  Form,
  Button,
  FormControl,
  Input,
  FormField,
  FormMessage,
  FormItem,
} from "../ui";
import { createComment } from "@/lib/validation";

export function CommentForm() {
  const form = useForm({resolver: createComment}, );

  form.handleSubmit(data => {
    console.log(data);
  });

  return <Form {...form}>
    <form>
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Comment on this post" {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
      <Button type="submit">Comment</Button>
    </form>
  </Form>;
}
