import express from "express";
import{readDB,writeDB} from "../utils/db.js"

const router= express.Router();

//CREATE ORDER
route.post("/",(req, res)=>{
    const{productId,quantity}=req.body;
    const db=readDB();

    const product=db.products.find(p=>p.id=== productId);
    if(!product){
        return res.status(404).json({message:" Product not found"});
    }
    if(product.stock===0 || quantity>product.stock){
        return res.status(400).json({message:"Insufficient stock"});
    }
    const totalAmount=product.price*quantity;

    const newOrders={
        id:db.orders.length +1,
        productId,
        quantity,
        totalAmount,
        status:"placed",
        createdAt:new Date().toISOString().split("T")[0]
    };

    product.stock-=quantity;
    db.orders.push(newOrders);
});

//GET ORDERS//
router.get("/",(req,res)=>{
    const db= readDB();
    res.status(200).json(db.orders);
});

// Cancel Order (Soft Delete)//
router.delete("/:id",(req,res)=>{
    const id=Number(req.params.id);
    const db=readDB();

    const order=db.orders.find(o=>o.id ===id);
    if(!order){
        return res.status(400).json({message:"Order not found"});
    }
    if(order.status==="cancelled"){
        return res.status(400).json({message:"order already cancelled"});
    }
    const today=new Date().toISOString().split("T")[0];
    if(order.createdAt!==today){
        return res.status(400).json({message:"cancellation time expired"});
    }
    order.status="cancelled";

    const product=db.product.find(p=>p.id===order.productId);
    product.stock+=order.quantity;

    writeDB(db);
    res.status(200).json(order);
});

//Change Order Status//
router.patch("/:id",(req,res)=>{
    const id=Number(req.params.id);
    const{status}=req.body;
    const db=readDB();

    const order=db.orders.find(o=>o.id===id);
    if(!order){
        return res.status(404).json({message:"order not found"});
    }
    if(order.status==="cancelled" || order.status==="delivered"){
        return res.status(400).json({message:"status change not alloowed"});
    }

    const validFlow=["placed","shipped","delivered"];
    const currentIndex=validFlow.indexOf(order.status);
    const nextIndex= validFlow.indexOf(status);

    if(nextIndex!==currentIndex+1){
        return res.status(400).json({message:"invalid status transition"});
    }
    order.status=status;
    writeDB(db);

    res.status(200).json(order);
});

export default router;