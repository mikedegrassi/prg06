const asyncHandler = require('express-async-handler')

const Goal = require('../models/playerModel')

// middlewares

// const {acceptJsonOnly} = require("../middleware/contentTypeMiddleware")

// @desc Get goals
// @route Get /api/goals
// @acces private
const getGoal = asyncHandler(async (req, res) => {


})

// @desc Set goals
// @route Post /api/goals
// @acces private
// acceptJsonOnly()

router.get("/", req, res)

const setGoal = asyncHandler(async (req, res) => {
    const goal = new Goal({
        name: req.body.name
    })

    try {
        const newGoal = await goal.save();
        res.status(200).json(goal)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// @desc Update goals
// @route Get /api/goals/:id
// @acces private
const updateGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })

    res.status(200).json(updatedGoal);
})

// @desc Delete goals
// @route DELETE /api/goals/:id
// @acces private
const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if (!goal) {
        res.status(400)
        throw new Error('Goal not found')
    }

    await goal.remove()

    res.status(200).json({ id: req.params.id })
})

const goalOptions = asyncHandler(async (req, res) => {
    res.setHeader("Allow", "GET, POST, OPTIONS")
    res.send();
})

module.exports = {

    getGoal,
    setGoal,
    updateGoal,
    deleteGoal,
    goalOptions

}