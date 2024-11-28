import { useContext } from "react";
import UserDashboardDetail from "./UserDashboardDetail";
import Api from "./Api";
import { UserContext } from "./UserContext";
import { useQuery } from "react-query";
import "./UserDashboard.css";

const getWatchedListings = async (username) => {
    let data = {};
    console.log('dashboard listings for', username);
    let res = await Api.getWatchedListings(username);
    console.log('watching', res);
    data.watchedListings = res;
    res = await Api.getListingsBidOn(username);
    console.log('bidding on', res);
    data.ListingsBidOn = res;
    return data;
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
            <UserDashboardDetail type={"Bidding"} listings={data.ListingsBidOn}/>
            <UserDashboardDetail type={"Watching"} listings={data.watchedListings}/>
            <UserDashboardDetail type={"Won"}/>
            <UserDashboardDetail type={"Sold"}/>
        </div>
    );
}

export default UserDashboard
