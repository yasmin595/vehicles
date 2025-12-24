import express, { Request, Response } from 'express';
import {Pool} from 'pg';    
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.join(process.cwd(),  '.env')});

const app = express();
const port = 5000;
app.use(express.json());

// app.use(express.urlencoded({ extended: true })); 
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}` });

const initDB = async () => {
    await pool.query(`CREATE TABLE IF NOT EXISTS vehicles (
        id SERIAL PRIMARY KEY,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL )`);
};
initDB();


// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req:Request, res:Response) => {
  res.send('hello Suborna World');
});
app.post('/', (req:Request, res:Response) => {
    console.log(req.body);
  res.status(201).json({ 
    success: true,
    message: 'Data received' });
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});