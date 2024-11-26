import "./UserDashboardDetail.css";
import ListingCard from "./ListingCard";

const UserDashboardDetail = ({type, listings}) => {
    return (
        <div>
            <h3>{type}</h3>
            <div className="user-dashboard-detail-panel">

                {listings && listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                ))}
            </div>
        </div>
    );
}

export default UserDashboardDetail
