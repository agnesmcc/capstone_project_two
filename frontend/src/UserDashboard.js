import { useContext } from "react";
import UserDashboardDetail from "./UserDashboardDetail";
import Api from "./Api";
import { UserContext } from "./UserContext";
import { useQuery } from "react-query";
import "./UserDashboard.css";

const getDashboardListings = async (username) => {
    let data = {};
    console.log('dashboard listings for', username);
    let res = await Api.getWatchedListings(username);
    console.log('watching', res);
    data.watchedListings = res;
    res = await Api.getListingsBidOn(username, true);
    console.log('bidding on', res);
    data.listingsBidOn = res;
    res = await Api.getWonListings(username);
    console.log('won', res.listings);
    data.wonListings = res.listings;
    res = await Api.getSoldListings(username);
    console.log('sold', res.listings);
    data.soldListings = res.listings;
    return data;
}

const UserDashboard = () => {
    const { user } = useContext(UserContext);
    const { data, error, isLoading } = useQuery(
      ['dashboard-listings', user?.username],
      () => getDashboardListings(user.username),
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
            <UserDashboardDetail type={"Bidding"} listings={data.listingsBidOn}/>
            <UserDashboardDetail type={"Watching"} listings={data.watchedListings}/>
            <UserDashboardDetail type={"Won"} listings={data.wonListings}/>
            <UserDashboardDetail type={"Sold"} listings={data.soldListings}/>
        </div>
    );
}

export default UserDashboard
