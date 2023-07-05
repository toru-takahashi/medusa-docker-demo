# Medusa Docker demo for Treasure Data CDP

This repo aims to provide a docker image to build Medusa for Treasure Data ecommerce hands-on demo.

## Hands-On Goal

1. Build own demo environment to show Abandoned Browse & Abandoned Cart for your client
2. Understand how pageview data can be used for Abandoned Browse use cases
3. Learn how to build Parent Segments
4. Learn how to create Segments based on Parent Segment behaviors

## Background: What’s Abandoned Browse and Abandoned Cart?

Abandoned Browse is an e-commerce re-engagement tactic where you look at the user’s browsing behavior and try to follow up with relevant messaging on available channels at scale. Abandoned Cart similar tries to personalize follow-ups except the focus is on what’s put in (or left in or removed from) the e-commerce shopping cart.

## Milestone 0: Setting up fake E-Commerce Site

You need a fake ecommerce website for this hands-on. This section introduce how you can build your own fake e-commerce site with Medusa on your local machne. [Medusa](https://github.com/medusajs/medusa) is an open source headless ecommerce platform that allows developers to create their own customizable and extendable online store. With Medusa, developers can have a fun time building distinctive e-commerce sites.

### Prerequisites

Before continuing in this article, you need to install a few tools and software:

- Git: Git is a version control system. Medusa uses it behind the scenes while creating a project. You can install it from [Git](https://git-scm.com/downloads).
- Docker: You need Docker to set up your server. You can download and install Docker on your system from [Docker](https://www.docker.com/).

### Setting up Medusa on local docker

Try the following commands on your terminal.

```
// Clone the base project from https://github.com/Prn-Ice/medusa-docker
$ git clone git@github.com:toru-takahashi/medusa-docker-demo.git

// Navigate to the projects directory
$ cd medusa-docker-demo

//Run this command in the root of the Medusa project 
$ docker compose up --build -d

// Seeding the database with the seed file provided will populate it with some dummy data
$ docker exec medusa-server medusa seed -f ./data/seed.json

// Run a test request, you'll see a json data with item ids 
$ curl -X GET localhost:9000/store/products | python -m json.tool
```

Once these proceedures are successfully completed, you’ll finally be able to preview the store. These Medusa containers are consist of the following systems;

- Backend API Server: http://localhost:9000
- Admin Server: http://localhost:7700 
- Storefront server: http://localhost:8100

Now, you can see the following e-commerce website at http://localhost:8100/store

Admin website is available with username:`admin@medusa-test.com`, password: `supersecret` at http://localhost:7700/

### Configure TD JS SDK in the site

Open `medusa-docker-demo/storefront/src/pages/_app.tsx`. And, change the following parameters for your Treasure Data Account at the following code.

- host: 'YOUR_API_ENDPOINT'
    - AP02 Region: ap02.records.in.treasuredata.com
    - Tokyo Region: ap01.records.in.treasuredata.com
    - US Region: us01.records.in.treasuredata.com
    - EU01 Region: eu01.records.in.treasuredata.com
- writeKey: 'YOUR_WRITE_ONLY_APIKEY_IS_HERE'
- database: 'DATABASE_NAME'

```
<Script strategy="afterInteractive"  id="td_analytics">
{`
var td = new Treasure({
  host: 'YOUR_API_ENDPOINT',
  writeKey: 'YOUR_WRITE_ONLY_APIKEY_IS_HERE',
  database: 'DATABASE_NAME'
});
td.setSignedMode();
td.set('$global', 'td_global_id', 'td_global_id');
td.trackPageview('pageviews');
td.trackClicks('clicks');
`}
</Script>
```

Once the config is updated, the server automatically reloads the setting. Then, open Network Tab in Developer console. pageviews event will be recorded. In addition, you’ll see the data in TD Console

## Milestone 1: Familiarize Yourself With the E-Commerce Website and Its Data.

1. Go browse around on http://localhost:8100/. Click around, put items in and out of the shopping cart. This starts generating data on Treasure Data because the website is already set up to collect data.
2. Head over to https://console.treasuredata.com. (Require TD  account)
    - Go find the database called <Configured your database>. You should see clicks and pageviews tables in them.
    - Try to look at them. Write queries like “SELECT * FROM pageviews LIMIT 10” and “SELECT * FROM clicks LIMIT 10”. Examine the query results. Do you understand what events are being collected? Note what’s unclear.
3. Looking ahead: how would you use this data to answer the quesion: “I’d like to target all users who looked at T-shirt size L or larger. How do I do that?”

## Milestone 2: Prepare The Data for Parent Segment.

In order to build the parent segment, you need to prepare tables to be used by the Parent Segment. Three kinds of tables are needed:

- Parent Table: this contains the IDs of the users.
- Behavior Table(s): this contains user behaviors, such as pageviews, adding items to cart, removing items from cart, etc.
- Attribute Table(s): this contains user attributes. In our example, there will not be many attributes…directly collected or inferred.

### Questions

- What should be the ID for the Parent Table in our example? Why?
- Which table(s) can be used to create the Parent Table? What does the SQL to create the Parent Table look like?
- Try creating the Parent Table on your own. Put it in the same database (your database)


## Milestone 3: Create the Parent Segment

Let’s actually create a Parent Segment. [The generic guide is available here.](https://docs.treasuredata.com/display/public/PD/Creating+Master+Segments)

Just to test if this works, try doing this with the Parent Table created in Milestone 2 and a single behavior table <your database>.pageviews (this notation with “.” in between is commonly used. It specifies the table “pageviews” inside the database “your DB”).

If you have gotten here, you have created your first Parent Segment!

## Milestone 4: Creating the “Naive” Abandoned Browse Segment

Now you should be ready to create a segment. [The generic guide is available here.](https://docs.treasuredata.com/display/public/PD/Creating+a+New+Batch+or+Real-time+Segment)

Try to create a segment of users who

- Looked at the T-shirt page.
- Looked at the T-shirt page in the last 1 day.

## Milestone 5: Adding the Cart Event To Parent Segment

From a business standpoint, there’s a big difference in terms of engagement between someone viewing a product page and actually putting that item in the shopping cart. So, let’s use clicks table as a new behavior table (so now you’d have two behavior tables) to update the Parent Segment.

Once updated, can you try creating the following two segments?

- Looked at the T-shirt page but have not put the T-shirt in the shopping cart.
- Looked at the T-shirt page and have put the T-shirt(s) in the shopping cart.

## Milestone 6: Teach Someone Else!

Get someone on your/neighboring team to try out this hands-on and serve as their mentor. The first step, of course, is to make sure that they have 1) Edit Access to Parent Segment and 2) Permissions to necessary databases. If you need help doing this, file an issue at [this repo](https://github.com/toru-takahashi/medusa-docker-demo/issues)

## Next...

As you may noticed, you have only behaviors data through JS SDK. For collecting user ids, you may import data from the ecommece database via our connector or custom script.

In the next hands-on section, I'll show how you can collect user id and stitch user data and their behavior data with our ID Unificaiton capability

See you the next hands-on course!


## Reference

- Originally Forked from https://github.com/Prn-Ice/medusa-docker
- [MedusaJS website Building blocks for digital commerce](https://medusajs.com/)
- [Create an Ecommerce Website with Docker](https://medusajs.com/blog/docker-ecommerce-website/)
- [Create an E-commerce Platform with Medusa and Docker](https://blog.openreplay.com/create-an-ecommerce-platform-with-medusa-and-docker/)