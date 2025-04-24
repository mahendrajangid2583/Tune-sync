const User = require("../models/User");
const GroupMessage = require("../models/groupMessages");

exports.addGroupMessage = async (req, res) => {
  try {
    const { message, groupId } = req.body;
    const userId = req.user.id;
    const groupMessage = await GroupMessage.create({
      message: message,
      sender: userId,
      group: groupId,
    });

    return res.json({ success: true, message: "message add successfully" });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "error while adding messages in DB",
    });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.id;

    const groupMessages = await GroupMessage.find({ group: groupId })
      .populate({
        path: "sender",
        select: "firstName lastName image _id"
      })
      .sort({ createdAt: 1 })  // Oldest to newest, use -1 for reverse
      .exec();
    
      console.log("group msg",groupMessages);
    
    const projectedMessages = groupMessages.map((groupMsg) => {
      return {
        _id:groupMsg._id,
        fromSelf: groupMsg.sender._id == userId,
        sender:groupMsg.sender,
        groupId: groupMsg.group,
        text: groupMsg.message,
        time: groupMsg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    });

    return res.json({
      success: true,
      projectedMessages,
    });
  } catch (error) {
    console.log("error", error);
    return res.json({
      success: false,
      message: "error while fetching group messages",
    });
  }
};
