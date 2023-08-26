import { Router } from "express";
import { authorize, isLoggedIn } from "../middlewares/auth.middleware";
import AuthRoles from "../utils/authRoles";
import {
  createCollection,
  deleteCollection,
  getAllCollection,
  updateCollection,
} from "../controllers/collection.controller";

const router = Router();

// create a new collection
router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN), createCollection);

// update a single collection
router.put("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), updateCollection);

// delete a single collection
router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), deleteCollection);

//get all collections
router.get("/", getAllCollection);

export default router;
