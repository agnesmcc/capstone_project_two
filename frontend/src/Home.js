import Listings from "./Listings";

/**
 * Home component.
 * 
 * This component renders the Listings component, which is a
 * list of all the listings in the database.
 * 
 * @returns {JSX.Element} A JSX element representing the home page.
 */
const Home = () => {
    return (
        <div>
            <Listings />
        </div>
    );
};

export default Home;
