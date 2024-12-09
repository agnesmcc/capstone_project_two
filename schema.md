Table : Listings

    Column : id - integer, required
    Column : created_by - text, required
    Column : title - text, required
    Column : description - text, optional
    Column : image - text, optional
    Column : current_bid - float
    Column : category - text, required, foreign key to Categories.title
    Column : winner - text
    Column : created_at, datetime, required
    Column : end_datetime, datetime, required

Table : Users

    Column : username - text, required
    Column : first_name - text, required
    Column : last_name - text, required
    Column : email - text, required
    Column : password - text, required

Table : Categories

    Column : title - text, required

Table : WatchedListings

    Column : user, required, foreign key to Users.username
    Column : listing_id, required, foreign key to Listings.id

Table : Bidders

    Column : id, integer, required
    Column : bidder, required, foreign key to Users.username
    Column : listing, required, foreign key to Listings.id
    Column : bid, float, required
    Column : created_at, datetime, required
