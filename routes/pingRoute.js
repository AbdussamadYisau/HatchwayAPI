const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/api/ping", (req, res) => {
    if (res.statusCode === 200) {
        res.json({
            "sucess":true
        })
    }
});

module.exports = router;