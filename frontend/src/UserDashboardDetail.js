import "./UserDashboardDetail.css";
import ListingCard from "./ListingCard";

/**
 * A component that displays a dashboard section for a user, categorized by type.
 * 
 * @param {Object} props - The component props
 * @param {string} props.type - The type of listing category (e.g., "Bidding", "Watching", "Won", "Sold").
 * @param {Array<Object>} props.listings - An array of listing objects to be displayed in the dashboard section.
 */

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
