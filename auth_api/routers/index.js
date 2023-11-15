const { Router } = require("express");
const userController = require("../controllers/user-controller.js");
const router = new Router();

router.post("/sign-in", userController.signIn);
router.post("/sign-up", userController.signUp);
router.get("/me", userController.getCurrentUser);

module.exports = router;
