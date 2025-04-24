const Messages = require("../models/messageModel");
const User = require("../models/User");

module.exports.getMessages = async(req,res)=>{
    try {
        const {from,to} = req.body;
        console.log(from,to);
        const messages = await Messages.find({
            users:{
                $all:[from,to],
            },
        }).sort({updatedAt:1});
        
        console.log("messages",messages);
        const projectedMessages = messages.map((msg)=>{
            return {
                fromSelf: msg.sender.toString() === from,
                message:msg.message.text,
                _id: msg._id
            };
        })
        return res.json(projectedMessages)
    } catch (error) {
        return res.json({error:error});
    }
}

module.exports.addMessage = async(req,res)=>{
    try {
        const {message,from, to} = req.body;
        const data = await Messages.create({
            message:{text: message},
            users:[from,to],
            sender:from,
        }) 
        if (data) return res.json({ msg: "Message added successfully." });
        else return res.json({ msg: "Failed to add message to the database" });
    } catch (error) {
        return res.json({error:error});
    }
}

module.exports.lastOnlineTime = async(req,res)=>{
    try {
        const {userId} = req.body;
        console.log("for last",userId);
        const user = await User.findById(userId);
        console.log("user",user);
        return res.json({lastOnline : user.lastOnline});
    } catch (error) {
        return res.json({error:error});
    }
}
