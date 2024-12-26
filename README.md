# eBid

Frontend hosted on Netlify at https://springboard-ebid.netlify.app/

The backend is hosted on Render.com at https://capstone-project-two-43m2.onrender.com/

The Postgres database is hosted on Supabase.

## Decription
A simple clone of eBay using a nodejs backend and React frontend.

## Features implemented
Basic functionality was added to make this appear as eBay. Users can create listings. They can watch and bid on listings. Listings eventually expire, and if there are any bids, a winner is decided. Users can also access a dashboard that shows alll listings they are watching, bidding on, have won, or have sold.

## Basic user flow
1. User registers or logs in.
2. User can create a new listing if they want to. They add a title, description, image, and category for the listing.
3. User can click on listings on the homepage to see more details about the listing.
4. They can click on a button to watch the listing.
5. They can click on a button to submit a bid on the listing.
6. User can visit their dashboard to see what they are watching or bidding on.
7. They can see what they have won or sold on their dashboard.
8. If they want to they can clickon a link to edit their profile. They can change their first name, last name, email, and/or password.

## Public API used
API being used: https://fakestoreapi.com/

Fake Store API provides a number of fake store items that include titles, descriptions, and images. This fake data is used to generate fake listings on the website that users can interact with. Without generating fake data we would need multiple real users that are continually making new listings or else the home page would appear empty and there would be little to interact with.

Note that the API provides 20 fake items but for our use case we want to grab random products. There is a helper function added to our backend that will fetch a random product from those 20.

## Stretch goals not implemented
* It would be nice if users could search fo listings on the homepage. Their search should match on title or description.
* On the homepage users should be able to filter listings by category since each listing is assigned a category.
* Being able to leave feedback for buyer or sellers is aanother feature from ebay that could be added.

