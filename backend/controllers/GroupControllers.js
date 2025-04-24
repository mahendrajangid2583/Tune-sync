const Group = require('../models/Group'); 
const User = require('../models/User'); 

// Controller to find a user by ID and return only the populated group field
exports.findUserGroupById = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const { userId } = req.body;

    // Find the user by ID and populate only the 'group' field
    const user = await User.findById(userId)
      .select('group') // Select only the 'group' field
      .populate('group', 'name admin'); // Populate the 'group' field with 'name' and 'admin'

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return the populated group field as a response
    res.status(200).json({
      success: true,
      data: user.group, // Only return the 'group' field
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching user group:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



// Controller to find all groups
exports.findAllGroups = async (req, res) => {
  try {
    // Fetch all groups from the database
    const groups = await Group.find()
      .populate('admin', 'firstName') // Populate the admin field with the username (optional)
      .populate('members', 'firstName'); // Populate the members field with usernames (optional)

    // Check if any groups exist
    if (groups.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No groups found",
      });
    }

    // Return the groups as a response
    res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching groups:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Controller to create a new group and update the admin's group field
exports.createGroup = async (req, res) => {
  try {
    // Extract data from the request body
    const { name, adminId } = req.body;

    // Step 1: Create the new group
    const newGroup = new Group({
      name,
      admin: adminId,
      members: [adminId], // Add the admin as the first member of the group
    });

    // Save the group to the database
    const savedGroup = await newGroup.save();

    // Step 2: Update the admin user's `group` field
    const updatedUser = await User.findByIdAndUpdate(
      adminId,
      { group: savedGroup._id }, // Set the group field to the new group's ID
      { new: true } // Return the updated document (optional)
    );

    // Return the newly created group as a response
    res.status(201).json({
      success: true,
      message: "Group created successfully",
      data: savedGroup,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error creating group:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


exports.exitGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const userId = req.user.id;  

    // Remove user from group's members array
    await Group.findByIdAndUpdate(groupId, {
      $pull: { members: userId },
    });

    // Set user's group field to null
    await User.findByIdAndUpdate(userId, {
      $set: { group: null },
    });

    res.status(200).json({
      success: true,
      message: "Successfully exited from group",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteGroup = async(req,res)=>{
  try {
    const {groupId} = req.body;
    const userId = req.user.id;

    // find group by id
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // find all users of group and remove from group
    await User.updateMany(
      {_id: {$in: group.members}},
      {$set : {group:null}}
    )
    //delete group
    await Group.findByIdAndDelete(groupId);
    return res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
}
