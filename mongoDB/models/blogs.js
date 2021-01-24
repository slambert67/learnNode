const mongoose = require('mongoose');
const Schema = mongoose.Schema;  // constructor function. To define structure of documents to store in a collection

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {timestamp:true});  // new instance of a schema object

// model wraps schema and provides API
// name is important! mongoose pluralises this to identify collection i.e. Blogs
const Blog = mongoose.model('Blog', blogSchema);

// export so can be used by rest of app
module.exports = Blog;
