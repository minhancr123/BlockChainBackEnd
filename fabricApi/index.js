const express = require("express");

const {Gateway , Wallets} = require("fabric-network")
const path = require("path");
const app = express();
const fs = require("fs");
const {GetIdentity} = require("./Admin");

const {Register} = require("./User");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.get("/queryAllCars" , async (req , res) => {
//     try {
//         const {gateway , contract } = await connectToNetwork();

//         const allAssets = await contract.evaluateTransaction("GetAllAssets");

        
//         res.json(JSON.parse(allAssets.toString()));

//         await gateway.disconnect();
//     } catch (error) {
//         res.status(500).send(error.toString());
//     }
// })
app.get("/enrollAdmin" , async function (req, res) {
    try {
    } catch (error) {
        
    }
})
app.get('/identity/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const result = await GetIdentity(username);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/register/:username" , Register);
app.listen(3000, () => console.log('API running on port 3000'));