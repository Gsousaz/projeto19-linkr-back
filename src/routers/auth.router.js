import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { authSchema, signupSchema } from "../schemas/authSchema.js";

const authRouter = Router();

authRouter.post("/sign-up", validateSchema(signupSchema), signup);
authRouter.post("/sign-in", validateSchema(authSchema), signin);

export default authRouter;
