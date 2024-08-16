import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import { sidebarLinks } from "@/constants";
import { useLogout } from "@/lib/tanstack-query/account";
import { useToast } from "../ui/use-toast";
import Logo from "./logo/Logo";
import { Button } from "../ui";
import { logout } from "@/lib/redux/features/authSlice";
import { toggleMode } from "@/lib/redux/features/modeSlice";
import { Loader2, LucideLogIn } from "lucide-react";

const Leftbar = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.mode);
  const { mutate: logoutUser, isPending, isSuccess, isError, error } = useLogout();
  
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Logout Successful!",
      });

      dispatch(logout());
    }

    if (isError) {
      toast({ title: error.message, variant: "destructive" });
    }
  }, [isError, isSuccess, error, dispatch, logoutUser]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col">
        <Link to={"/"} className="flex gap-3 items-center">
          <Logo classes={"md:text-[25px] text-[10px] font-extrabold"} />
        </Link>

        {isLoading ? (
          <div className="mt-2.5 flex gap-3 items-center px-1 py-1.5 rounded-md font-semibold text-gray-400">
            <Loader2 className="animate-spin" />
            <span className="text-sm text-foreground/90">Loading</span>
          </div>
        ) : (
          <Link
            to={isAuthenticated ? `/profile/${user.accountId}` : "/sign-in"}
            className={
              !isAuthenticated
                ? "bg-zinc-900/800 dark:bg-gray-800 dark:text-zinc-100 text-white px-5 py-1.5 rounded-md font-semibold mt-2.5 mb-1.5 flex gap-3 items-center"
                : "mt-2.5 flex gap-3 items-center px-1 py-1.5 rounded-md font-semibold"
            }
            title={isAuthenticated ? "Profile" : "Login"}
          >
            {!isAuthenticated ? (
              <div className="flex gap-3 items-start justify-start">
                <LucideLogIn />
                {" "}
                Login
              </div>
            ) : (
              <>
                <img
                  src={user.imageUrl}
                  alt="profile"
                  className="rounded-full"
                  width={30}
                  height={30}
                />

                <div className="flex flex-col leading-5">
                  <p className="text-[16px] font-medium">{user.name}</p>
                  <p className="text-[14px] font-normal text-gray-500">
                    @{user.username}
                  </p>
                </div>
              </>
            )}
          </Link>
        )}

        <ul className="py-2 flex flex-col gap-2">
          {sidebarLinks.map(({ imgURL, route, label }) => {
            const isActive = pathname === route;
            return (
              <li key={route}>
                <NavLink
                  to={route}
                  className={({ isActive }) =>
                    isActive
                      ? "flex gap-3 items-center px-2 py-1.5 rounded-md font-semibold text-white bg-red"
                      : "flex gap-3 items-center px-2 py-1.5 rounded-md group font-semibold leftsidebar-link"
                  }
                  title={label}
                >
                  <img
                    src={imgURL}
                    alt={label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                    width={25}
                  />
                  {label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-2 items-start">
        {/* ThemeToggle button  */}
        <Button variant="ghost"
          onClick={() => dispatch(toggleMode())}
        >
          <img
            src={`/assets/icons/${mode === "dark" ? "sun" : "moon"}.svg`}
            className="w-6 h-6 mr-3"
            alt={`mode-${mode}`}
          />
          <p>{mode === "dark" ? "Light Mode" : "Dark Mode"}</p>
        </Button>

          {/* Logout button */}
        {isPending? <div className="flex gap-3 items-center px-1 py-1.5 rounded-md font-semibold text-gray-200">Loading...</div> : isAuthenticated && (
          <Button
            variant="ghost"
            className="shad-btn_ghost"
            title="Logout"
            onClick={() => logoutUser()}
          >
            <img
              src="/assets/icons/logout.svg"
              className="w-6 h-6 mr-3"
              alt="logout"
            />
            <p>Logout</p>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Leftbar;
