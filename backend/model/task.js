const mongoose = require('mongoose')

const ChecklistSchema = new mongoose.Schema({
    checkText: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        default: false
    }
})

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['high', 'mid', 'low'],
        required: true
    },
    checklist: {
        type: [ChecklistSchema],
        required: true
    },
    dueDate: {
        type: Date,
        default: null
    },
    completedCheckCount: {
        type: Number,
        default: 0
    },
    section: { 
        type: String, 
        enum: ['todo', 'backlog', 'inprogress', 'done'], 
        default: 'todo' 
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    assignedToEmail: { 
        type: String,
        default: null 
    },
    boardToEmail: [{
        type: String
    }]
})

module.exports = mongoose.model('Task', TaskSchema)