var mongoose = require("mongoose");

// const connectDB =  () => {
//   try {
//      mongoose.connect(process.env.MONGO_CONNECTION_URL);
//     console.log('Connection to the MongoDb has been Successfull!!!');
//   } catch (error) {
//     console.log('Connection Failed',error.message)
//   }
// };

var mongoose = require("mongoose");
mongoose
  .connect(
    `mongodb+srv://oneminddevelopers:abhishek_3089@lic.ffsaobg.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connection is Successfull");
  })
  .catch((ex) => {
    console.error("There is a error in the connection", ex.message);
  });

module.exports = mongoose;
