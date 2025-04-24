const express = require("express");
const router = express.Router();

const {
    findUserGroupById,
    findAllGroups,
    createGroup,
    exitGroup,
    deleteGroup
} = require("../controllers/GroupControllers");

const {
   getGroupMessages,
   addGroupMessage
} = require("../controllers/GroupChatControllers");

const auth = require("../middlewares/auth");

router.post("/get_user_group",findUserGroupById);
router.post("/get_all_group",findAllGroups);
router.post("/create_group",createGroup);
router.post('/exit-group',auth, exitGroup);
router.post("/delete_group",auth,deleteGroup);
router.post("/add_message",auth,addGroupMessage);
router.post("/get_messages",auth,getGroupMessages);

module.exports = router;
