import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus,
  grantPremium,
  revokePremium,
  grantTrial,
  revokeTrial,
  toggleFreeTrialStatus,
  checkFreeTrialStatus,
  promoteToAdmin,
  revokeAdmin,
  getDashboardStats,
  getSystemInfo,
  bulkUpdateUsers,
  bulkDeleteUsers,
  getUserActivity
} from '../controllers/adminController';

const router = express.Router();

// Dashboard & Analytics
router.get('/dashboard/stats', getDashboardStats);
router.get('/system/info', getSystemInfo);

// User Management Routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-status', toggleUserStatus);
router.get('/users/:id/activity', getUserActivity);

// Premium Management Routes
router.post('/users/:id/premium/grant', grantPremium);
router.delete('/users/:id/premium/revoke', revokePremium);

// Trial Management Routes
router.post('/users/:id/trial/grant', grantTrial);
router.delete('/users/:id/trial/revoke', revokeTrial);
router.patch('/users/:id/free-trial/toggle', toggleFreeTrialStatus);
router.get('/users/:id/free-trial/status', checkFreeTrialStatus);

// Admin Management Routes
router.post('/users/:id/admin/promote', promoteToAdmin);
router.delete('/users/:id/admin/revoke', revokeAdmin);

// Bulk Operations Routes
router.put('/users/bulk/update', bulkUpdateUsers);
router.delete('/users/bulk/delete', bulkDeleteUsers);

export default router;