import { Router } from "express";
import { getUserById, UpdateUser, VerifyUser } from "../controllers/UserControllers";

const router = Router();
router.post("/verify/:id", VerifyUser);
router.get("/getuser/:id", getUserById);
router.patch("/update/:id", UpdateUser);

export default router;
