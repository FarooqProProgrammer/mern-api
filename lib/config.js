import mongoose from "mongoose";

const connectDb =  async () => { 
    await mongoose.connection('mongodb://localhost:27017/testing-project')
    .then((res)=>{
        console.log(res.data)
    })
    .catch((error)=>{
        console.log(error)
    })
}

export default connectDb