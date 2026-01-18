import { json } from "express";
import { readDB } from "../utils/db";

const router=express.Router();

//All Orders with Count//
router.get("/orders",(req,res)=>{
    const db=readDB();
    const list=[];
    db.orders.forEach(o=>list.push(o));
    res.json({count:list.length, orders:list});
});

//Cancelled Orders with Count//
router.get("/cancelled",(req,res)=>{
    const db=readDB();
    const cancelled=db.orders.filter(o=>o.status==="cancelled");
    res,json({count:cancelled.length, orders:cancelled});

});

//Shipped Orders with Count//
router.get("/shipped",(req,res)=>{
    const db=readDB();
    const shipped=db.orders.filter(o=>o.status==="shipped");
    res.json({count:shipped.length, orders:shipped});
});


//Total Revenue by Product//
router.get("/revenue/:productId",(req,res)=>{
    const products=Number(req.params.productId);
    const db=readDB();

    const product=db.products.find(p=>p.id===productId);
    if(!product){
        return res.status(404).json({message:"product not found"});
    }

    const revenue=db.orders
    .filter(o=>o.productId===productId&& o.status!=="cancelled")
    .reduce((sum,o)=>sum+o.quantity*product.price,0);

    res.json({productId,revenue});
});

//Overall Revenue//
router.get("/revenue",(req,res)=>{
    const db=readDB();

    const revenue=db.orders
    .filter(o=>o.status!=="cancelled")
    .reduce((sum,o)=>{
        const product=db.products.find(p=>p.id===o.productId);
        return sum+o.quantity*product.price;
    },0);

    res.json({totalRevenue:revenue});
})

export default router;