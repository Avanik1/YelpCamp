const mongoose = require('mongoose');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected")
});

const sample = array => array[Math.floor(Math.random() * array.length)];


//delete all data from DB and seed the database with new data
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '61efbb06a2a468fb4432c41a',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      // image: 'https://source.unsplash.com/collection/483251',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore alias possimus, laudantium illo porro aspernatur quae molestiae eum dolorum deserunt officia pariatur consequuntur eos enim fugiat sed et corrupti quos?',
      price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/domq0jrab/image/upload/v1643276024/YelpCamp/eixj9vhl95tcusge1uuh.jpg',
          filename: 'YelpCamp/eixj9vhl95tcusge1uuh'
        },
        {
          url: 'https://res.cloudinary.com/domq0jrab/image/upload/v1643313248/YelpCamp/pvoltapaae3zmyqro9k4.jpg',
          filename: 'YelpCamp/bawhjcexoj7pbvnbx37c'
        }
      ]
    });
    await camp.save();
  }
  // const c = new Campground({title: 'purple field'});
  // await c.save();
}

seedDB().then(() => {
  console.log("Closing the connection to MongoDB!");
  mongoose.connection.close();
})