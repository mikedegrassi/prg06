const express = require('express')
const asyncHandler = require('express-async-handler')
const Player = require("../models/playerModel");
const router = express.Router()

function currentItems(total, start, limit) {
    let items = 0;

    items = Math.ceil(limit);

    if (!limit) {
        items = total
    }

    if (!start) {
        items = total
    }

    return items
}

function currentPage(total, start, limit) {

    let currentPage = Math.ceil(start / limit)


    if (!limit) {
        currentPage = 1
    }

    if (!start) {
        currentPage = 1
    }

    return currentPage

}

function lastPageItem(total, limit) {

    return Math.ceil((total - limit) + 1);

    // limit = 5
    // pages = 4

    // total = 18
    // result = 14
}


function numberOfPages(total, start, limit) {

    let totalPages = Math.ceil(total / limit);

    if (!limit || limit === 0) {
        totalPages = 1;
    }

    if (!start || start === 0) {
        totalPages = 1;
    }

    return totalPages
}

function nextPageItem(total, start, limit) {

    let nextPage = Math.ceil(start / limit) + 1

    if (!limit) {
        nextPage = 1
    }

    if (!start) {
        nextPage = 1
    }

    return nextPage
}

function previousPageItem(total, start, limit) {

    let previousPage = Math.ceil(start / limit) + 1

    if (!limit) {
        previousPage = 1
    }

    if (!start) {
        previousPage = 1
    }

    return previousPage
}

function giveURI(uriType, total, start, limit) {
    let uri = ""

    switch (uriType) {
        case "first":
            uri = `?start=1&limit=${limit}`
            break
        case "last":
            uri = `?start=${lastPageItem(total, limit)}&limit=${limit}`
            break
        case "next":
            uri = `?start=${start + limit}&limit=${limit}`
            break
        case "previous":
            uri = `?start=${start - limit}&limit=${limit}`
            break
    }

    if (!limit) {
        uri = ""
    }
    if (!start) {
        uri = ""
    }

    return uri
}


function lastPage(total, start, limit) {
    let lastPage = Math.ceil(total / limit)

    if (!start) {
        lastPage = 1
    }

    if (!limit) {
        lastPage = 1
    }

    return lastPage
}


router.get("/", async (req, res) => {

    if (req.header('Accept') !== "application/json") {
        res.status(415).send();
    }

    const page = parseInt(req.query.page);
    const start = parseInt(req.query.start)

    // const start = parseInt(req.query.start);

    let limit = parseInt(req.query.limit);
    const totalItems = await Player.count();

    const startIndex = (page - 1) * limit;

    try {

        const players = await Player.find().limit(limit).skip(startIndex).exec();

        let playerCollection = {
            items: players,
            _links: {
                self: {
                    href: `${process.env.BASE_URI}players/`
                },
                collection: {
                    href: `${process.env.BASE_URI}players/`
                }
            },
            pagination: {
                currentPage: currentPage(totalItems, start, limit),
                currentItems: currentItems(totalItems, start, limit),
                totalPages: numberOfPages(totalItems, start, limit),
                totalItems: totalItems,

                _links: {
                    first: {
                        page: 1,
                        href: `${process.env.BASE_URI}players/${giveURI("first", totalItems, start, limit)}`
                    },
                    last: {
                        page: lastPage(totalItems, start, limit),
                        href: `${process.env.BASE_URI}players/${giveURI("last", totalItems, start, limit)}`
                    },

                    next: {
                        page: nextPageItem(totalItems, start, limit),
                        href: `${process.env.BASE_URI}players/${giveURI("next", totalItems, start, limit)}`
                    },
                    previous: {
                        page: previousPageItem(totalItems, start, limit),
                        href: `${process.env.BASE_URI}players/${giveURI("previous", totalItems, start, limit)}`
                    }

                }
            }
        }

        res.status(200).json(playerCollection)

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.get("/:id", async (req, res) => {

    try {
        let player = await Player.findById(req.params.id)
        if (player == null) {
            res.status(404).send();
        } else {
            res.json(player)
        }
    } catch {
        res.status(415).send();
    }
})


router.post("/", async (req, res, next) => {
    if (req.header("Content-Type") !== "application/json" && req.header("Content-Type") !== "application/x-www-form-urlencoded") {
        res.status(400).send();
    } else {
        next();
    }
})

//middleware against empty values post
router.post("/", async (req, res, next) => {
    if (req.body.name && req.body.foot && req.body.club) {
        next();
    } else {
        res.status(400).send();
    }
})

// create route / post
router.post("/", async (req, res) => {

    let player = Player({
        name: req.body.name,
        foot: req.body.foot,
        club: req.body.club
    })

    try {
        await player.save();

        res.status(201).send(player);
    } catch {
        res.status(500).send();
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await Player.findByIdAndDelete(req.params.id);

        res.status(204).send();

    } catch {
        res.status(404).send();
    }

})

router.put("/:_id", async (req, res, next) => {

    if (req.header("Content-Type") !== "application/json" && req.header("Content-Type") !== "application/x-www-form-urlencoded") {
        res.status(400).send();
    } else {
        next();
    }
})

//middleware against empty values put
router.put("/:_id", async (req, res, next) => {

    if (req.body.name && req.body.foot && req.body.club) {
        next();
    } else {
        res.status(400).send();
    }
})

router.put("/:_id", async (req, res) => {

    let player = await Player.findOneAndUpdate(req.params,
        {
            name: req.body.name,
            foot: req.body.foot,
            club: req.body.club
        })

    try {
        player.save();

        res.status(203).send();
    } catch {
        res.status(500).send();
    }
})

router.options("/", (req, res) => {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    res.send("");
})

// options for detail: OPTIONS /id
router.options("/:id", async (req, res) => {
    res.set({
        'Allow': 'GET, PUT, DELETE, OPTIONS'
    }).send()
})

module.exports = router

