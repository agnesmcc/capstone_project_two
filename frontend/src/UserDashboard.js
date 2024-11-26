import { useContext } from "react";
import UserDashboardDetail from "./UserDashboardDetail";
import Api from "./Api";
import { UserContext } from "./UserContext";
import { useQuery } from "react-query";
import "./UserDashboard.css";

const getWatchedListings = async (username) => {
    console.log('fetching watched listings for', username);
    let res = await Api.getWatchedListings(username);
    console.log(res);
    return res;
}

const UserDashboard = () => {
    const { user } = useContext(UserContext);
    const { data, error, isLoading } = useQuery(
      ['watched-listings', user?.username],
      () => getWatchedListings(user.username),
      {
          enabled: !!user?.username,
      }
  );

  if (isLoading || !user) {
      return <div>Loading...</div>;
  }

  if (error) {
      return <div>Error: {error.message}</div>;
  }

    return (
        <div className="user-dashboard">
            <h1>User Dashboard</h1>
            <UserDashboardDetail type={"Bidding"}/>
            <UserDashboardDetail type={"Watching"} listings={data}/>
            <UserDashboardDetail type={"Won"}/>
            <UserDashboardDetail type={"Sold"}/>
        </div>
    );
}

export default UserDashboard
