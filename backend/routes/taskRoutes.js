const express = require('express')
const router = express.Router()
const taskController = require('../controller/taskController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/create', authMiddleware, taskController.createTask)
router.post('/check/:taskId/:checkId', authMiddleware, taskController.checkedPost)
router.patch('/section/:taskId', authMiddleware, taskController.addSection)
router.get('/each/:taskId', taskController.getTaskById)
router.get('/all', authMiddleware, taskController.getAllTasks) 
router.put('/update/:taskId', authMiddleware, taskController.updateTask)
router.delete('/delete/:taskId', authMiddleware, taskController.deleteTaskById)
router.get('/backlog', authMiddleware, taskController.getBacklogTasks)
router.get('/todo', authMiddleware, taskController.getToDoTasks)
router.get('/progress', authMiddleware, taskController.getProgressTasks)
router.get('/done', authMiddleware, taskController.getDoneTasks)
router.post('/assign-board', authMiddleware, taskController.assignBoard)

module.exports = router