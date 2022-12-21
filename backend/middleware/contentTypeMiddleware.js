const asyncHandler = require("express-async-handler");

function acceptJsonOnly() {
    const setGoal = asyncHandler(async (req, res, next) => {
        console.log("hi")

        if (req.header("Content-Type") === "application/json") {
                next();
            } else {
                req.status(415).send
            }
        }
    )
}

module.exports = {
    acceptJsonOnly
}