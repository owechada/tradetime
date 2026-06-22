import { Router } from 'express';
 import { DeleteScanById, GetuserScans, SaveScan } from '../controllers/SavesController';

const router = Router();
router.post('/add', SaveScan);
router.post('/getuserscans', GetuserScans);
router.post('/delete/:id', DeleteScanById);
 
export default router;
