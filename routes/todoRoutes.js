const express = require("express");
const TasksController = require('../controllers/TasksController.js');
const router = express.Router();

router.get("/", TasksController.getAll);
router.get("/:id", TasksController.getById);
router.put("/:id", TasksController.deleteById);
router.post("/", TasksController.addTask);
router.patch("/:id", TasksController.statusUpdate);
router.patch("/", TasksController.markAll);
router.put("/", TasksController.clearCompleted);
router.get("/filter/:filter", TasksController.filter);
router.put("/update/:id", TasksController.updateTask)

module.exports = router;