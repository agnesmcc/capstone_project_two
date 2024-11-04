Table : Listings

    Column : id - integer, required
    Column : created_by - text, required, foreign key to Users.username
    Column : title - text, required
    Column : description - text, optional
    Column : image - text, optional
    Column : starting_bid - float, required
    Column : current_bid - float
    Column : category - text, required, foreign key to Categories.title
    Column : winner - text, foreign key to Users.username

Table : Users

    Column : id - integer, required
    Column : first_name - text, required
    Column : last_name - text, required
    Column : username - text, required
    Column : email - text, required
    Column : password - text, required

Table : Categories

    Column : id - integer, required
    Column : title - text, required

Table : WatchedListings

    Column : user, required, foreign key to Users.username
    Column : listing_id, required, foreign key to Listings.id

Table : Bidders

    Column : id, integer, required
    Column : bidder, required, foreign key to Users.username
    Column : listing, required, foreign key to Listings.id
    Column : bid, float, required
    Column : created, datetime, required
