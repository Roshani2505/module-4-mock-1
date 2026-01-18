import { readDB } from "../utils/db";
import express from "express";


const router=express.Router();
router.get("/",(req, res)=>{
    const db= readDB();
    res.status(200).json(db.products);
});

export default router;