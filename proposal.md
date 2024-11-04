# Project Proposal

## Description

This application will be a clone of the well known website Ebay.com. It should provide basic functionality so that it resembles a crude version of the existing website. Ebay has many pages for searching, viewing, creating listings and many views for a user in their dashboard. This should give me lots of practice with creating components in React and managing state. Their will be many places where data is reused, so it will be important to reduce duplicatation and create helpers or hooks/context so that data is easily accessible from each component.

## Stack Focus

This project iwll include both a frontend and a backend server. I will be a React application made with create-react-app. NodeJS and Express will be made to use the backend and it will communicate with a Postgres.

## Type of Application

This will be a website.

## Goal

The goal is to replicate the basic functionality available in Ebay. It should allow a user to create listings, search for listings, and bid on listing auctions. When an auction ends, it should be added to a list of the auctions they have won.

## User Demographics

Anyone that has something to sell! Similar to Ebay it should cater to a wide audience and enable users to efficiently sell their items to someone else in a timely manner.

## Data

The application should allow users to create listings, but at first it will be empty. In order to exercise the ability to search and bid on other auctions it should generate some fake listings. The application will use an API to generate this fake data so that there are some unique and realistic items to search for.

## Plan for Creating Application

1. Create a database schema. First I will have to determine what data needs to be stored to represent users and listings. I will need a user table and listing table. I will also need other tables for many to many relationships, maybe bids, selling, bidding, sold_items, and won_items.

2. The next step will be to create the node express backend. It should define models for data stored in the database with methods that enable creating, updating, and searching data.

3. The final step will be creating the frontend application. It should be made to connect to the backend created in step 2 and will present a dynamic single page application using React. Like developing the schema for the database, first I will have to plan out what components will be needed and how they should tie together.
I will need to make an API helper for interfacing with the backend. 

## User Flow

1. When the user visits the homepage they have the ability to search and view existing listings. But they will not be able to bid on them or create new listings yet.

2. If they want to bid or create a new listing the user will be redirected to create an account.

3. After creating an account a user can create new listings or bid on existing ones.

4. The user can view their dashboard to see what listings they created, what listings they have bid on, what they have sold, and what they have won.

5. If they win something they can leave feedback for the seller.