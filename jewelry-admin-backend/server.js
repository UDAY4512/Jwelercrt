const express=require('express');
const mongoose=require("mongoose");
const dotenv=require('dotenv');
const cors=require('cors');

dotenv.config();

const app=express();
app.use(cors());
app.use(express.json());


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/products', productRoutes);

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("mongoDb is connected successfully");
}).catch((err)=>{console.log("error is generated while connecting mongodb "+err)});

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
});