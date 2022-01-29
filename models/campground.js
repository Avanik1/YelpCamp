const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
        url: String,
        filename: String
})

//https://res.cloudinary.com/domq0jrab/image/upload/w_100/v1643303572/YelpCamp/ye0ujflplxxxivd1nelm.jpg

//virtual property(not a part of actual database model) - applies only to a schema, hence we created a separate imageschema
ImageSchema.virtual('thumbnail').get(function(){
    //we can also do using reg ex
    return this.url.replace('/upload','/upload/w_200');
})

//when document is converted to JSON, tell mongoose to include the virtual properties as part of JSON too
const options = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, options);

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0,20)}...</p>`
})

CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);