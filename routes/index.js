const url = require('url');
const redis = require('redis');
const express = require('express');
const needle = require('needle');
const router = express.Router();

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY = process.env.API_KEY;


const client = redis.createClient();

// client.on('error', (err) => console.log('Redis Client Error', err));

// await client.connect();



const fun = async () =>{
    client.on('error', (err) => console.log('Redis Client Error', err))
    await client.connect();
    await client.set('key', 'value');
    const value = await client.get('key');
    
    console.log(value);
}

fun();

router.get('/',async (req,res)=>{

    // console.log(url.parse(req.url,true).query);

    try{
        const params = new URLSearchParams({
            [API_KEY_NAME] : API_KEY,
            ...url.parse(req.url,true).query
        })
    
        const apiRes = await needle('get',`${API_BASE_URL}?${params}`)
    
        // console.log(apiRes.body);
        const data = apiRes.body;
        res.status(200).json(data);
    }catch(error){
        res.status(400).json({error});
    }
    

})

module.exports = router;