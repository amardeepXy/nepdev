import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogout } from "@/lib/tanstack-query/account";
import { logout } from "@/lib/redux/features/authSlice";
import { toggleMode } from "@/lib/redux/features/modeSlice";
import Logo from "./logo/Logo";
import { Button } from "../ui";
import { Loader } from ".";
import { useToast } from "../ui/use-toast";

const Topbar = () => {
  const { isAuthenticated: authStatus, user } = useSelector(
    (state) => state.auth
  );
  const { mode } = useSelector(state => state.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    mutate: logoutUser,
    isSuccess,
    isPending,
    isError,
    error,
  } = useLogout();

  const linkItems = !authStatus
    ? []
    : [
        {
          iconPath: user.imageUrl || "./assets/icons/profile-placeholder.svg",
          title: "Profile",
          path: `/user/${user.$id}`,
        }
      ];

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Logout Successful",
      });
      dispatch(logout());
    }

    if (isError) {
      toast({ title: error.message, variant: "destructive" });
    }
  }, [isSuccess, isPending, isError, error, toast, dispatch]);

  const handleLogBtnClick = () => {
    if (authStatus) {
      logoutUser();
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <section className="topbar">
      <div className="flex-between py-3 px-5">
        <Link to={"/"} className="flex gap-3 items-center">
          <Logo classes={"md:text-[30px] text-[22px] font-extrabold"} />
        </Link>

        <div className="flex gap-0 items-center">
          <Button
            variant="ghost"
            className="shad-btn_ghost"
            title={authStatus ? "Logout" : "Login"}
            onClick={handleLogBtnClick}
          >
            {isPending ? (
              <Loader />
            ) : (
              <img
                src={`/assets/icons/${authStatus ? "logout" : "login"}.svg`}
                className="w-6 h-6"
                alt="logout/login"
              />
            )}
          </Button>

            <Button variant="ghost" className={`shad-btn_ghost`} onClick={() => dispatch(toggleMode())} >
              <img src={`/assets/icons/${mode === 'dark' ? 'sun' : 'moon'}.svg`} alt="modeToogle" className="w-6 h-6" />
            </Button>

          {linkItems?.map(({ iconPath, title, path }) => (
            <Link to={path} key={title} title={title}>
              <img
                className="rounded-full"
                src={iconPath}
                width={30}
                alt={title}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Topbar;
