require("dotenv").config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const monogoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = process.env.ATLASTDB_URL;

async function main() {
    await monogoose.connect(MONGO_URL);
}

const categories = [
    "Trending",
    "Rooms",
    "Iconic Cities",
    "Mountain",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farms",
    "Arctic",
    "Domes",
    "Boats"
];

const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = await Promise.all(
        initData.data.map(async (obj, i) => {
            let response = await geocodingClient
                .forwardGeocode({
                    query: obj.location,
                    limit: 1,
                })
                .send();

            return {
                ...obj,
                owner: "6a9be3b5d6fa76c01eaf51b7",
                geometry: response.body.features[0].geometry,
                category: categories[i % categories.length],
            };
        })
    );

    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

main()
    .then(() => {
        console.log("connected to DB");
        return initDB();
    })
    .catch((err) => {
        console.log(err);
    });