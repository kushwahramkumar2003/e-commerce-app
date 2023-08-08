import mongoose from "mongoose";
import app from "./app.js";
import "dotenv";

//create a method

//run this method
(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/e-com");
    console.log("DB Connected!!");

    app.on("error",(err)=>{
        console.error("Error : ",err);
        throw err;
    })

    const port = process.env.PORT || 5000;
    
    app.listen(port, () => console.log(`Server running on port ${port} 🔥`));

  } catch (error) {
    console.log("Error ---> ", error);
    throw error;
  }
})();
