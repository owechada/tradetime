import { Request, Response } from "express";
import User from "../models/User";
import { SavedScans } from "../models/SavedScans";
import { SaveStrategy } from "../models/SaveStrategy";
import { Op } from "sequelize";

// Removed authentication interface - API is now open

// User Management
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page = 1, limit = 30, search = "", status = "all" } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereCondition: any = {};

    // Search functionality
    if (search) {
      whereCondition = {
        [Op.or]: [
          { username: { [Op.like]: `%${search}%` } },
          { mail: { [Op.like]: `%${search}%` } },
          { trade_view_name: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    // Status filter
    if (status !== "all") {
      switch (status) {
        case "active":
          whereCondition.checked = 0;
          break;
        case "inactive":
          whereCondition.checked = 1;
          break;
        case "premium":
          whereCondition.is_sub_before = { [Op.ne]: "NULL" };
          break;
        case "trial":
          whereCondition.is_trial = { [Op.ne]: "NULL" };
          break;
        case "admin":
          whereCondition.is_admin = 1;
          break;
      }
    }

    const users = await User.findAndCountAll({
      where: whereCondition,
      attributes: { exclude: ["password"] },
      limit: Number(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: users.rows,
      pagination: {
        total: users.count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(users.count / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Get user's saved scans and strategies
    const savedScans = await SavedScans.findAll({ where: { userId: id } });
    const savedStrategies = await SaveStrategy.findAll({
      where: { userId: id },
    });

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        savedScans: savedScans.length,
        savedStrategies: savedStrategies.length,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated via admin panel
    delete updateData.password;
    delete updateData.id;

    const [rowsUpdated] = await User.update(updateData, {
      where: { id },
    });

    if (rowsUpdated === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Delete associated data
    await SavedScans.destroy({ where: { userId: id } });
    await SaveStrategy.destroy({ where: { userId: id } });

    // Delete user
    await User.destroy({ where: { id } });

    res.json({
      success: true,
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const toggleUserStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const newStatus = user.checked === 0 ? 1 : 0;
    await User.update({ checked: newStatus }, { where: { id } });

    res.json({
      success: true,
      message: `User ${
        newStatus === 0 ? "activated" : "deactivated"
      } successfully`,
      data: { checked: newStatus },
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Premium Management
export const grantPremium = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { expiryDate, subscriptionId } = req.body;

    const updateData: any = {
      is_sub_before: "true",
      exp_date:
        expiryDate ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
    };

    if (subscriptionId) {
      updateData.subscription_id = subscriptionId;
    }

    const [rowsUpdated] = await User.update(updateData, { where: { id } });

    if (rowsUpdated === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      message: "Premium access granted successfully",
    });
  } catch (error) {
    console.error("Error granting premium:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const revokePremium = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const [rowsUpdated] = await User.update(
      {
        is_trial: "NULL",
        exp_date: "NULL",
        subscription_id: "NULL",
      },
      { where: { id } }
    );

    if (rowsUpdated === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      message: "Premium access revoked successfully",
    });
  } catch (error) {
    console.error("Error revoking premium:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const grantTrial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { trialDays = 3 } = req.body;

    const expiryDate = new Date(
      Date.now() + Number(trialDays) * 24 * 60 * 60 * 1000
    ).toISOString();

    const [rowsUpdated] = await User.update(
      {
        is_trial: "true",
        exp_date: expiryDate,
        subExpiryDate: "1", // Mark that user has taken free trial
      },
      { where: { id } }
    );

    if (rowsUpdated === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      message: `Trial access granted for ${trialDays} days`,
    });
  } catch (error) {
    console.error("Error granting trial:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const revokeTrial = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const [rowsUpdated] = await User.update(
      {
        is_trial: "NULL",
        exp_date: "NULL",
        // Note: subExpiryDate remains "1" since they've already used their trial
      },
      { where: { id } }
    );

    if (rowsUpdated === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      message: "Trial access revoked successfully",
    });
  } catch (error) {
    console.error("Error revoking trial:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const toggleFreeTrialStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Toggle the free trial status using subExpiryDate field
    // 0 = hasn't taken trial, 1 = has taken trial
    const currentStatus = user.subExpiryDate === "1";
    const newStatus = !currentStatus;
    const newValue = newStatus ? "1" : "0";

    await User.update({ subExpiryDate: newValue }, { where: { id } });

    res.json({
      success: true,
      message: `Free trial status ${
        newStatus ? "enabled" : "disabled"
      } successfully`,
      data: {
        has_taken_free_trial: newStatus,
        can_take_free_trial: !newStatus,
      },
    });
  } catch (error) {
    console.error("Error toggling free trial status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const checkFreeTrialStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Check free trial status using subExpiryDate field
    // 0 = hasn't taken trial, 1 = has taken trial
    const hasTakenFreeTrial = user.subExpiryDate === "1";

    res.json({
      success: true,
      data: {
        has_taken_free_trial: hasTakenFreeTrial,
        can_take_free_trial: !hasTakenFreeTrial,
        current_trial_status: user.is_trial,
        trial_expiry: user.exp_date,
      },
    });
  } catch (error) {
    console.error("Error checking free trial status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin Management
export const promoteToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const [rowsUpdated] = await User.update({ is_admin: 1 }, { where: { id } });

    if (rowsUpdated === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      message: "User promoted to admin successfully",
    });
  } catch (error) {
    console.error("Error promoting user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const revokeAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Self-protection removed - API is now open

    const [rowsUpdated] = await User.update({ is_admin: 0 }, { where: { id } });

    if (rowsUpdated === 0) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({
      success: true,
      message: "Admin privileges revoked successfully",
    });
  } catch (error) {
    console.error("Error revoking admin:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Analytics & Statistics
export const getDashboardStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { checked: 0 } });

    const today = new Date();

    const premiumUsers = await User.count({
      where: {
        exp_date: {
          [Op.gte]: today, // exp_date >= today
        },
      },
    });
    const trialUsers = await User.count({
      where: {
        is_trial: "true", // condition 1
        exp_date: { [Op.gte]: today }, // condition 2
      },
    });
    const adminUsers = await User.count({ where: { is_admin: 1 } });
    const totalScans = await SavedScans.count();
    const totalStrategies = await SaveStrategy.count();

    const aDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentRegistrations = await User.count({
      where: {
        createdAt: {
          [Op.gte]: aDayAgo, // createdAt >= 24h ago
        },
      },
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          premium: premiumUsers,
          trial: trialUsers,
          admin: adminUsers,
          recentRegistrations,
        },
        content: {
          totalScans,
          totalStrategies,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// System Management
export const getSystemInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.json({
      success: true,
      data: {
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          external: Math.round(memoryUsage.external / 1024 / 1024),
        },
        node_version: process.version,
        platform: process.platform,
      },
    });
  } catch (error) {
    console.error("Error fetching system info:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Bulk Operations
export const bulkUpdateUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds, updateData } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      res
        .status(400)
        .json({ success: false, message: "User IDs array is required" });
      return;
    }

    // Remove sensitive fields
    delete updateData.password;
    delete updateData.id;

    const [rowsUpdated] = await User.update(updateData, {
      where: { id: { [Op.in]: userIds } },
    });

    res.json({
      success: true,
      message: `${rowsUpdated} users updated successfully`,
    });
  } catch (error) {
    console.error("Error bulk updating users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const bulkDeleteUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      res
        .status(400)
        .json({ success: false, message: "User IDs array is required" });
      return;
    }

    // Delete associated data
    await SavedScans.destroy({ where: { userId: { [Op.in]: userIds } } });
    await SaveStrategy.destroy({ where: { userId: { [Op.in]: userIds } } });

    // Delete users
    const deletedCount = await User.destroy({
      where: { id: { [Op.in]: userIds } },
    });

    res.json({
      success: true,
      message: `${deletedCount} users and their associated data deleted successfully`,
    });
  } catch (error) {
    console.error("Error bulk deleting users:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// User Activity & Logs
export const getUserActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Get user's saved scans and strategies with timestamps
    const savedScans = await SavedScans.findAll({
      where: { userId: id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });

    const savedStrategies = await SaveStrategy.findAll({
      where: { userId: id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });

    res.json({
      success: true,
      data: {
        savedScans,
        savedStrategies,
      },
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
