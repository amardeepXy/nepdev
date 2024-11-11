import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Authlayout from "./_auth/Authlayout";
import RootLayout from "./_root/RootLayout";
import VerificationLayout from "./components/layouts/VerificationLayout";
import { SigninForm, SignupForm, EmailVerification } from "./_auth/forms";
import {
  Home,
  Explore,
  Allusers,
  Saved,
  CreatePost,
  EditPost,
  PostDetails,
  Profile,
} from "./_root/pages";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useDispatch } from "react-redux";
import { setDarkMode as toggleMode } from "./lib/redux/features/modeSlice";
import { Toaster } from "./components/ui/toaster";
import { useAutoLogin } from "./hooks/useAutoLogin";
import "./global.css";

const App = () => {
  const dispatch = useDispatch();
  const { setRequest } = useAutoLogin();
  useEffect(() => {
    if (localStorage.getItem("mode") === "dark") {
      dispatch(toggleMode());
    }
    setRequest();
  }, []);

  return (
    <main className="bg-background text-foreground w-full min-h-screen">
      <Routes>
        <Route element={<Authlayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>
        <Route element={<VerificationLayout />}>
        <Route path="/email-verfication" element={<EmailVerification />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/all-users" element={<Allusers />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit/:postId" element={<EditPost />} />
          <Route path="post/:postId" element={<PostDetails />} />
          <Route path="user/:userId" element={<Profile />} />
        </Route>
      </Routes>
      <Toaster />
      <SpeedInsights />
    </main>
  );
};

export default App;
