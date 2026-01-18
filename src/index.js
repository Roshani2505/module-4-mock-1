import express from "express";
import productRouter from "./routes/products.routes.js";
import orderRouter from "./routes/orders.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";

const app=express();
app.use(express.json());

app.use("/products",productRouter);
app.use("/orders",orderRouter);
app.use("/analytics",analyticsRouter);

app.get("/",(req,res)=>{
    res.json({message:"E-commerce API running"});
});

app.listen(3000,()=>{
    console.log("Server running on port 3000")
});