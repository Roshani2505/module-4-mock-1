import fs from "fs";
import path from "path";

const dbPath= path.resolve("db.json");
export const readDB=()=>{
    const data= fs.readFileSync(dbPath,"utf-8");
    return JSON.parse(data);
};

export const writeDB=(data)=>{
    fs.writeFileSync(dbPath.JSON.stringify(data,null,2));
};