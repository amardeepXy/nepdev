import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleMode } from "@/lib/redux/features/modeSlice";

import Logo from "@/components/shared/logo/Logo";
import {Button} from '@/components/ui/button'
const Authlayout = () => {
  const userStatus = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  return (
    <>
      {userStatus ? (
        <Navigate to={"/"} />
      ) : (
        <section className="w-full h-screen flex items-center justify-around">
          <div className="border p-4 md:p-10 flex flex-col items-center sm:w-8/12 w-full h-full md:h-auto md:w-96 rounded-md dark:border-zinc-700 flex-center ">
            <Logo />
            <Outlet />
          </div>
          <div className="border p-10 bg-green-500 hidden lg:block">
            <Button children="Change mode" onClick={() => dispatch(toggleMode())} variant="outline" />
          </div>
        </section>
      )}
    </>
  );
};

export default Authlayout;
