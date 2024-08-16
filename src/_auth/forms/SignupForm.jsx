import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateUserAccount, useGetUserFromDb, useLoginUser } from "@/lib/tanstack-query/account";
import { useSelector, useDispatch } from "react-redux";
import { login } from "@/lib/redux/features/authSlice";
import { Loader } from "@/components/shared";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signUpSchema } from "@/lib/validation";
import { Link, useNavigate } from "react-router-dom";


const SignupForm = () => {

  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/?payload=redirect");
    }
  }, [isAuthenticated, navigate]);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
  const dispath = useDispatch();
  const { toast } = useToast();
  const {mutateAsync: createUserAccount, isPending: isCreatingUser, isError: isCreatingUserError, error: createUserError} = useCreateUserAccount();
  const { mutateAsync: loginUser, isPending: isLoggingIn, isError: isLoggingInError, error: loginUserError, isSuccess: isUserLoggedIn } = useLoginUser();
  const {data: currentUser, isSuccess: isReceivedCurrentUser } = useGetUserFromDb();

  useEffect(() => {
    if(isCreatingUserError){
      toast({title: createUserError.message, variant: 'destructive'});
    }
    if(isLoggingInError){
      toast({title: loginUserError.message, variant: 'destructive'});
      navigate('/sign-in');
    }
  }, [isCreatingUserError, isLoggingInError])

  useEffect(() => {
    if(isUserLoggedIn && isReceivedCurrentUser ){
      dispath(login(currentUser));
    }
  }, [isUserLoggedIn]);

  const onSubmit = async (data) =>{
    console.log(data);
    const { name, username, email, password } = data;
    try {
      const newUser = await createUserAccount({ name, username, email, password });
      if(!newUser) throw new Error('Failed to create account');
      const sessoin = await loginUser({ email, password });
      if(!sessoin) throw new Error('Failed to login');
    } catch (error) {
      console.log(error);
      toast({title: error.title, description: error.message, variant: 'destructive'});
    }
    
  }

  return (
    <Form {...form} className="w-full">
      <h2 className="login-header">Create a new account</h2>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-5 flex flex-col items-center w-full gap-y-2"
      >
        {/* //* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>

              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        {/* //* Username field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>

              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        {/* //* Email field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>

              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        {/* //* Password field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full mb-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>

              <FormMessage className="text-[10px]" />
            </FormItem>
          )}
        />

        {/* //* Submit button */}
        <Button type="submit" className={"w-full"}>
          {isCreatingUser || isLoggingIn ? (
            <div className="flex-center gap-x-3">
              {" "}
              <Loader /> Loading...
            </div>
          ) : (
            "Sign up"
          )}
        </Button>

        {/* //* Login link */}
        <p className="text-center mt-4 small-regular">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-blue-500 text-small-semibold">
            Login
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignupForm;
