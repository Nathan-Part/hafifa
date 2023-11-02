import express from "express"
import personRouter from "./personRouter";
import groupRouter from "./groupRouter";

const router = express.Router()

router.use("/person", personRouter);
router.use("/group", groupRouter)

export default router