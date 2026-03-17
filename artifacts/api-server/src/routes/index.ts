import { Router, type IRouter } from "express";
import healthRouter from "./health";
import accommodationsRouter from "./accommodations";
import bookingsRouter from "./bookings";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/accommodations", accommodationsRouter);
router.use("/bookings", bookingsRouter);

export default router;
