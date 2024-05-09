import express from 'express'
import { asyncWrapper } from '../midleWares/asyncWrapper';
import { checkToken } from '../midleWares/checkToken';

const waterRouter = express.Router();

waterRouter.use(asyncWrapper(checkToken))

waterRouter.patch("/add")
waterRouter.put("/edit")
waterRouter.delete("/delete")
waterRouter.get("/daycosumption")
waterRouter.get("/monthconsumption")

export default waterRouter