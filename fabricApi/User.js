const { Wallets } = require("fabric-network");
const fabric_server = require("fabric-ca-client");
const path = require("path");
const db = require("../db/connectToDB");

async function Register(req, res) {
    const { username } = req.params;
    console.log("Username:", username, "reqBody:", req.body);
    const { co, ou, country, state, locality } = req.body;
    
    try {
        const ca = new fabric_server(process.env.fabric_url);
        const wallet = await Wallets.newFileSystemWallet(path.join(__dirname, "wallet"));
        
        const userExists = await wallet.get(username);
        const adminIdentity = await wallet.get("admin");
        
        if (userExists) {
            console.log("User already exists in wallet");
            return res.status(409).json({
                success: false,
                message: "User already exists in wallet"
            });
        }
        
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminuser = await provider.getUserContext(adminIdentity, "admin");
        
        const user = await ca.register({
            enrollmentID: username,
            affiliation: "org1.department1",
            role: "client",
            attrs: [
                { name: "co", value: co },
                { name: "ou", value: ou },
                { name: "ct", value: country },
                { name: "st", value: state },
                { name: "lc", value: locality }
            ],
        }, adminuser);
        
        const EnrollUser = await ca.enroll({
            enrollmentID: username,
            enrollmentSecret: user
        });
        
        console.log(EnrollUser.key);
        
        const sql = "INSERT INTO users (og, ou, country,certificate ,  public_key, private_key) VALUES (?, ?, ?, ?, ?, ?)";
        const publicKey = EnrollUser.key.getPublicKey().toBytes();
        const privateKey = EnrollUser.key.signWithMessageHash(hash.toString('hex'));
        
        console.log("public_key:", publicKey, "private_key:", privateKey);
        
        db.query(sql, [username, ou, country, EnrollUser.certificate, publicKey , privateKey], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            
            console.log("User register success");
            return res.status(200).json({
                success: true,
                message: "Register user successfully",
                result
            });
        });
        
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { Register };