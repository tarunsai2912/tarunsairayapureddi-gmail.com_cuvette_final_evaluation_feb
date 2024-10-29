const Task = require('../model/task')
const User = require('../model/user')
const moment = require('moment')

const updateTaskCounts = async (userId) => {
    const user = await User.findById(userId).populate('taskId')
    
    let dueDateCount = 0, lowCount = 0, midCount = 0, highCount = 0
    
    user.taskId.forEach(task => {
        if (task.dueDate) dueDateCount++
        if (task.priority === 'low') lowCount++
        if (task.priority === 'mid') midCount++
        if (task.priority === 'high') highCount++
    })
  
    user.dueDateCount = dueDateCount
    user.lowCount = lowCount
    user.midCount = midCount
    user.highCount = highCount
    await user.save()
}

const createTask = async (req, res, next) => {
    try{
        const {title, priority, checklist, dueDate, assignedToEmail, completedCheckCount} = req.body

        const assignedTo = await User.findOne({ email: assignedToEmail })

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(400).json({msg: 'User Not Found'})
        }

        const task = new Task({
            title, 
            priority,
            checklist,
            dueDate: dueDate ? dueDate : null,
            createdBy: user._id,
            assignedToEmail: assignedTo ? assignedToEmail : null,
            completedCheckCount: completedCheckCount ? completedCheckCount : 0,
            boardToEmail: user.boardToUser
        })
        const newTask = await task.save()

        user.taskId.push(newTask._id)
        await user.save()
        await updateTaskCounts(user._id)

        if(assignedToEmail){
            const assignedTo = await User.findOne({ email: assignedToEmail })
            if(assignedTo){
                assignedTo.taskId.push(newTask._id)
                await assignedTo.save()
                await updateTaskCounts(assignedTo._id)
            }
        }

        const boardUsers = await User.find({email: {$in: user.boardToUser}})

        if(boardUsers.length > 0){
            await Promise.all(boardUsers.map(async (each) => {
                each.taskId.push(newTask._id)
                await each.save()
                await updateTaskCounts(each._id)
            }))
        }

        return res.status(200).json({msg: 'Task Created Successfully', newTask}) 
    }
    catch(err){
        return next(err)
    }
}

const checkedPost = async(req, res, next) => {
    try{
        const {taskId} = req.params
        const task = await Task.findById(taskId)
        if(!task){
            return res.status(400).json({msg: "Task is not found"})
        }
        const {checkId} = req.params
        const checklistData = task.checklist.id(checkId)
        if(!checklistData){
            return res.status(400).json({msg: "Checklist is not found"})
        }
        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(400).json({ msg: 'User not found' });
        }

        if(!checklistData.checked){
            checklistData.checked = true
            task.completedCheckCount++
        }
        else{
            checklistData.checked = false
            task.completedCheckCount--
        }
        const updatedTask = await task.save()
        return res.status(200).json({msg: 'Checked/UnChecked', updatedTask})
    }
    catch(err){
        return next(err)
    }
}

const addSection = async (req, res, next) => {
    try{
        const {taskId} = req.params
        const {section} = req.body
        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(400).json({ msg: 'User not found' });
        }

        const task = await Task.findById(taskId)
        if(!task){
            return res.status(400).json({msg: "Task is not found"})
        }

        task.section = section 
        const updatedTask = await task.save()      
        return res.status(200).json({msg: 'Section Added Successfully', updatedTask})
    }
    catch(err){
        return next(err)
    }
}

const getAllTasks = async (req, res, next) => {
    try{
        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(400).json({msg: 'User Not Found'})
        }
        const tasks = await User.findById(req.user_Id).populate('taskId')
        return res.status(200).json(tasks.taskId)
    }
    catch(err){
        return next(err)
    }
}

const updateTask = async (req, res, next) => {
    try{
        const { taskId } = req.params

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(400).json({msg: 'User Not Found'})
        }
        
        const task = await Task.findById(taskId)
        if(!task){
            return res.status(400).json({msg: "Task is not found"})
        }

        if(task.assignedToEmail !== null){
            const oldAssignee = await User.findOne({email: task.assignedToEmail})
            if(oldAssignee){
                oldAssignee.taskId.pull(task._id)
                await oldAssignee.save()
                await updateTaskCounts(oldAssignee._id)
            }
        }

        const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true })
        await updatedTask.save()

        if(req.body.assignedToEmail){
            const newAssignee = await User.findOne({email: req.body.assignedToEmail})
            if(newAssignee){
                newAssignee.taskId.push(updatedTask._id)
                await newAssignee.save()
                await updateTaskCounts(newAssignee._id)
            }
        }

        await updateTaskCounts(updatedTask.createdBy)

        const boardUsers = await User.find({email: {$in: task.boardToEmail}})

        if(boardUsers.length > 0){
            await Promise.all(boardUsers.map(async (each) => {
                await updateTaskCounts(each._id)
            }))
        }

        return res.status(200).json({ msg: 'Question updated successfully', updatedTask })
    }
    catch(err){
        return next(err)
    }
}

const getTaskById = async (req, res, next) => {
    try{
        const {taskId} = req.params

        const task = await Task.findById(taskId)
        if(!task){
            return res.status(400).json({msg: 'Story Not Found'})
        }

        return res.status(200).json(task)
    }
    catch(err){
        return next(err)
    }
}

const deleteTaskById = async (req, res, next) => {
    try{
        const {taskId} = req.params

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(400).json({msg: 'User Not Found'})
        }

        const task = await Task.findById(taskId)
        if(!task){
            return res.status(400).json({msg: "Task is not found"})
        }

        const createdUser = await User.findById(task.createdBy)

        if(createdUser){
            createdUser.taskId.pull(task._id)
            await createdUser.save()
            await updateTaskCounts(createdUser._id)
        }

        if(task.assignedToEmail){
            const assignedUser = await User.findOne({email: task.assignedToEmail})
            if(assignedUser){
                assignedUser.taskId.pull(task._id)
                await assignedUser.save()
                await updateTaskCounts(assignedUser._id)
            }
        }

        const boardUsers = await User.find({email: {$in: task.boardToEmail}})

        if(boardUsers.length > 0){
            await Promise.all(boardUsers.map(async (each) => {
                each.taskId.pull(task._id)
                await each.save()
                await updateTaskCounts(each._id)
            }))
        }

        await Task.findByIdAndDelete(taskId)

        const tasks = await User.findById(req.user_Id).populate('taskId')
        const remainingTasks = tasks.taskId

        return res.status(200).json({msg:'Task got Deleted', remainingTasks})
    }
    catch(err){
        return next(err)
    }
}

const getBacklogTasks = async (req, res, next) => {
    try {
        const { filter } = req.query

        const now = moment().startOf('day')
        const endOfDay = moment(now).endOf('day')
        const endOfWeek = moment(now).endOf('week')
        const endOfMonth = moment(now).endOf('month')
        const startOfMonth = moment(now).startOf('month')

        let dateFilter = {}

        if (filter === 'Today') {
            dateFilter = { dueDate: { $gte: now.toDate(), $lte: endOfDay.toDate() } }
        } else if (filter === 'This Week') {
            dateFilter = { dueDate: { $gte: now.toDate(), $lte: endOfWeek.toDate() } }
        } else if (filter === 'This Month') {
            dateFilter = { dueDate: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() } }
        }

        const user = await User.findById(req.user_Id)
        if (!user) {
            return res.status(400).json({ msg: 'User Not Found' })
        }

        const totBacklogTasks = await Task.aggregate([
            {
                $match: { $or: [{ createdBy: req.user_Id }, { assignedToEmail: user.email }, { boardToEmail: user.email }] }
            },
            {
                $match: { section: { $eq: 'backlog' } }
            }
        ])

        const totalBacklogTasks = totBacklogTasks.length

        const backlogTasks = await Task.aggregate([
            {
                $match: { $or: [{ createdBy: req.user_Id }, { assignedToEmail: user.email }, { boardToEmail: user.email }] }
            },
            {
                $match: { section: { $eq: 'backlog' } }
            },
            {
                $match: { $or: [{ dueDate: { $eq: null } }, dateFilter] }
            }
        ])

        return res.status(200).json({backlogTasks, totalBacklogTasks}) 
    } catch (err) {
        return next(err)
    }
}

const getToDoTasks = async (req, res, next) => {
    try{
        const { filter } = req.query

        const now = moment().startOf('day')
        const endOfDay = moment(now).endOf('day')
        const endOfWeek = moment(now).endOf('week')
        const endOfMonth = moment(now).endOf('month')
        const startOfMonth = moment(now).startOf('month')

        let dateFilter = {}

        if (filter === 'Today') {
            dateFilter = { dueDate: { $gte: now.toDate(), $lte: endOfDay.toDate() } }
        } else if (filter === 'This Week') {
            dateFilter = { dueDate: { $gte: now.toDate(), $lte: endOfWeek.toDate() } }
        } else if (filter === 'This Month') {
            dateFilter = { dueDate: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() } }
        }

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(400).json({msg: 'User Not Found'})
        }

        const totTodoTasks = await Task.aggregate([
            {
                $match: { $or: [{createdBy: req.user_Id}, {assignedToEmail: user.email}, { boardToEmail: user.email }] }
            },
            {
                $match: { section: { $eq: 'todo' } }
            }
        ])

        const totalTodoTasks = totTodoTasks.length 

        const todoTasks = await Task.aggregate([
            {
                $match: { $or: [{createdBy: req.user_Id}, {assignedToEmail: user.email}, { boardToEmail: user.email }] }
            },
            {
                $match: { section: { $eq: 'todo' } }
            },
            {
                $match: {$or: [{ dueDate: { $eq: null } }, dateFilter]}
            }
        ])
        
        return res.status(200).json({todoTasks, totalTodoTasks})
    }
    catch(err){
        return next(err)
    }
}

const getProgressTasks = async (req, res, next) => {
    try{
        const { filter } = req.query

        const now = moment().startOf('day')
        const endOfDay = moment(now).endOf('day')
        const endOfWeek = moment(now).endOf('week')
        const endOfMonth = moment(now).endOf('month')
        const startOfMonth = moment(now).startOf('month')

        let dateFilter = {}

        if (filter === 'Today') {
            dateFilter = { dueDate: { $gte: now.toDate(), $lte: endOfDay.toDate() } }
        } else if (filter === 'This Week') {
            dateFilter = { dueDate: { $gte: now.toDate(), $lte: endOfWeek.toDate() } }
        } else if (filter === 'This Month') {
            dateFilter = { dueDate: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() } }
        }

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(400).json({msg: 'User Not Found'})
        }

        const totProgressTasks = await Task.aggregate([
            {
                $match: { $or: [{createdBy: req.user_Id}, {assignedToEmail: user.email}, { boardToEmail: user.email }] }
            },
            {
                $match: { section: { $eq: 'inprogress' } }
            }
        ])

        const totalProgressTasks = totProgressTasks.length

        const progressTasks = await Task.aggregate([
            {
                $match: { $or: [{createdBy: req.user_Id}, {assignedToEmail: user.email}, { boardToEmail: user.email }] }
            },
            {
                $match: { section: { $eq: 'inprogress' } }
            },
            {
                $match: {$or: [{ dueDate: { $eq: null } }, dateFilter]}
            }
        ])
        return res.status(200).json({progressTasks, totalProgressTasks}) 
    }
    catch(err){
        return next(err)
    }
}

const getDoneTasks = async (req, res, next) => {
    try{
        const { filter } = req.query

        const now = moment().startOf('day')
        const endOfDay = moment(now).endOf('day')
        const endOfWeek = moment(now).endOf('week')
        const endOfMonth = moment(now).endOf('month')
        const startOfMonth = moment(now).startOf('month')

        let dateFilter = {}

        if (filter === 'Today') {
            dateFilter = { dueDate: { $gte: now.toDate(), $lte: endOfDay.toDate() } }
        } else if (filter === 'This Week') {
            dateFilter = { dueDate: { $gte: now.toDate(), $lte: endOfWeek.toDate() } }
        } else if (filter === 'This Month') {
            dateFilter = { dueDate: { $gte: startOfMonth.toDate(), $lte: endOfMonth.toDate() } }
        }

        const user = await User.findById(req.user_Id)
        if(!user){
            return res.status(400).json({msg: 'User Not Found'})
        }

        const totDoneTasks = await Task.aggregate([
            {
                $match: { $or: [{createdBy: req.user_Id}, {assignedToEmail: user.email}, { boardToEmail: user.email }] }
            },
            {
                $match: { section: { $eq: 'done' } }
            }
        ])

        const totalDoneTasks = totDoneTasks.length 

        const doneTasks = await Task.aggregate([
            {
                $match: { $or: [{createdBy: req.user_Id}, {assignedToEmail: user.email}, { boardToEmail: user.email }] }
            },
            {
                $match: { section: { $eq: 'done' } }
            },
            {
                $match: {$or: [{ dueDate: { $eq: null } }, dateFilter]}
            }
        ])
        return res.status(200).json({doneTasks, totalDoneTasks})
    }
    catch(err){
        return next(err)
    }
}

const assignBoard = async (req, res, next) => {
    try{
        const { email } = req.body
        const boardUser = await User.findOne({ email })
        if (!boardUser) {
            return res.status(400).json({ msg: 'Board User not found' })
        }

        const user = await User.findById(req.user_Id)
        if (!user) {
            return res.status(400).json({ msg: 'User not found' })
        }

        const tasks = await User.findById(req.user_Id).populate('taskId')
        if (!tasks) {
            return res.status(400).json({ msg: 'No Tasks found' })
        }

        if(tasks.taskId.length > 0){
            boardUser.taskId.push(...tasks.taskId.map(task => task._id))
            user.boardToUser.push(boardUser.email)
            await user.save()
            await boardUser.save()
            await updateTaskCounts(boardUser._id)

            await Promise.all(
                tasks.taskId.map(task => {
                    task.boardToEmail.push(boardUser.email)
                    return task.save()
                })
            )
        }

        return res.status(200).json({ msg: 'Board assigned successfully' })
    }
    catch (err) {
        return next(err)
    }
}

module.exports = {createTask, checkedPost, addSection, getAllTasks, updateTask, getTaskById, deleteTaskById, getBacklogTasks, getToDoTasks, getProgressTasks, getDoneTasks, assignBoard}