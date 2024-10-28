const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true 
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    lowCount: {
        type: Number,
        default: 0 
    },
    midCount: {
        type: Number,
        default: 0 
    },
    highCount: {
        type: Number,
        default: 0 
    },
    dueDateCount: {
        type: Number,
        default: 0 
    },
    boardToUser: [{
        type: String
    }],
    taskId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task'
        }
    ]
})

module.exports = mongoose.model('User', UserSchema)