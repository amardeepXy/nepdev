import { useNavigate } from "react-router-dom";
import { useGetAllUsers } from "@/lib/tanstack-query/account";
import { GridUserList } from "@/components/shared";
import { Button } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

const Allusers = () => {
  const navigate = useNavigate();
  const {data: allUsers, isLoading: isLoadingUsers, isError: isGettingUsersErr, error: gettingUsersErr} = useGetAllUsers();

  return (
    <div className="user-container px-3 py-9">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <p className="h3-bold">Peoples</p>
      </div>
      <div className="w-full">
        {isLoadingUsers? <div className="w-full flex-center my-10 sm:my-20"><img src={`/assets/animation/loading.gif`} alt="Loading..."  className="invert-0 dark:invert"/></div>: 
        isGettingUsersErr? <div className="w-full flex-center text-red">{gettingUsersErr?.message || 'Something went wrong'}</div> :
        <GridUserList usersList={allUsers?.documents} />
        }
      </div>
    </div>
  );
};

export default Allusers;
