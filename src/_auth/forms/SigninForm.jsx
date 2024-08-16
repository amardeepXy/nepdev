import React, { useEffect } from "react"; // From react
import { zodResolver } from "@hookform/resolvers/zod"; // Zod Resolver
import { useForm } from "react-hook-form"; // React Hook Form
import { signInSchema } from "@/lib/validation"; // Zod Schema
import { Link, useNavigate } from "react-router-dom"; // React Router
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form"; // Shadcn Form
import { Input, Button } from "@/components/ui"; // Shadcn Components
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "@/components/shared";
import { useSelector} from "react-redux"; // React-redux
import { useAutoLogin } from "@/hooks/useAutoLogin";
import { useLoginUser } from "@/lib/tanstack-query/account";
import { isPending } from "@reduxjs/toolkit";

const SigninForm = () => {
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { toast } = useToast();
  const { mutate: signin, isPending: isSigningInUser, isError, error, isSuccess } = useLoginUser();
  const { setRequest, isSuccess: isSuccessAuto } = useAutoLogin();

  useEffect(() => {
     if (isAuthenticated) {
       navigate("/");
     }
   }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isSuccessAuto){
      toast({
        description: "Welcome back!",
      })
    } else if (isSuccess) {
      setRequest();
    }

  }, [isSuccess, isSuccessAuto]);

  useEffect(() => {
    if (isError) {
      toast({
        description: error.message,
      });
    }
  }, [isError, error, toast]);

  function onSubmit(data) {
    const { email, password } = data;
    signin({ email, password });
  }

  return (
    <Form {...form} className="space-y-6 w-full">
      <h2 className="login-header">Login to your account</h2>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="my-5 flex flex-col items-center w-full gap-y-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full mt-2" disabled={isSigningInUser} >
          {isSigningInUser? <Loader/>: 'Sign in'}
        </Button>
        <p className="text-center small-medium">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-600">
            Sign up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SigninForm;
