import { Request, Response } from "express";
import { SavedScans } from "../models/SavedScans";
import User from "../models/User";

async function VerifyUser(req: Request, res: Response): Promise<void> {
  const userId = req.params.id;
  var response: any = { success: false, message: "" };
  try {
    const [rowsUpdated] = await User.update(
      { checked: 0 }, // Fields to update
      {
        where: {
          id: userId, // Condition
        },
      }
    );



    if (rowsUpdated > 0) {


     var  user =await User.findOne({
        where: {
          id: userId, // Match the user ID
        },
      })
      response = {
        success: true,
        message: `User with ID ${userId} updated successfully.`,
       user: {...user?.toJSON(), password:""}
      };
    } else {
      response = {
        success: false,
        message: `No user found with ID ${userId}.`,
      };
    }
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    res.send(response)
  }
}
async function UpdateUser(req: Request, res: Response): Promise<void> {
  const userId = req.params.id;
  var data=req.body.data
  var response: any = { success: false, message: "" };
  try {
    const [rowsUpdated] = await User.update(
      data, // Fields to update
      {
        where: {
          id: userId, // Condition
        },
      }
    );



    if (rowsUpdated > 0) {


     var  user =await User.findOne({
        where: {
          id: userId, // Match the user ID
        },
      })
      response = {
        success: true,
        message: `User with ID ${userId} updated successfully.`,
       user: {...user?.toJSON(), password:""}
      };
    } else {
      response = {
        success: false,
        message: `No user found with ID ${userId}`,
      };
    }
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    res.send(response)
  }
}
async function getUserById(req: Request, res: Response) {
  var response: any = { messaage: "", user: null, success: false };

  try {
    const userId = req.params.id;
    const user = await User.findOne({
      where: {
        id: userId, // Match the user ID
      },
    });

    if (user) {
      response = {
        messaage: "User found",
        user: { ...user.toJSON(), password: "" },
        success: true,
      }; // Return null if no user is found
    } else {
      response = {
        messaage: "No user found with id",
        user: null,
        success: false,
      }; // Return null if no user is found
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error; // Rethrow the error to handle it at a higher level
  }

  res.send(response);
}

export { VerifyUser, getUserById, UpdateUser };
