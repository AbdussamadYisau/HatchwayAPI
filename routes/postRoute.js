const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/api/posts", async (req, res, next) => {
    let {tags,sortBy,direction} = req.query;

    try {
        if( tags && sortBy && direction) {
            console.log(direction);
            const url=`https://api.hatchways.io/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`;
            const request = await fetch(url);

            if((request.status === 200 || 201, request.statusText === 'OK') && ( (sortBy === "id") || (sortBy === "reads") || (sortBy === "likes") || (sortBy === "popularity") ) && ((direction === "asc") || (direction === "desc")) ) {
                const response = await request.json();
                return res.json({
                    response
                })
            }

            if(( (sortBy !== "id") || (sortBy !== "reads") || (sortBy !== "likes") || (sortBy !== "popularity") )&& ((direction !== "asc") || (direction !== "desc"))) {
                return res.status(400).json({
                    "error": "sortBy and direction parameter is invalid"
                })
            }

            if(( (sortBy !== "id") || (sortBy !== "reads") || (sortBy !== "likes") || (sortBy !== "popularity") )) {
                return res.status(400).json({
                    "error": "sortBy parameter is invalid"
                })
            }

            if( ( (direction !== "asc") || (direction !== "desc")) ) {
                return res.status(400).json({
                    "error": "direction parameter is invalid"
                })
            }


        } else if (tags && sortBy) {
            const url=`https://api.hatchways.io/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}`;
            const request = await fetch(url);
            if((request.status === 200 || 201, request.statusText === 'OK') && ( (sortBy === "id") || (sortBy === "reads") || (sortBy === "likes") || (sortBy === "popularity") ) ){
                const response = await request.json();
                return res.json({
                    response
                })
            } else {
                return res.status(400).json({
                    "error": "sortBy parameter is invalid"
                })
            }
        } else if(tags && direction) {

            const url=`https://api.hatchways.io/assessment/blog/posts?tag=${tags}&direction=${direction}`;
            const request = await fetch(url);
            if((request.status === 200 || 201, request.statusText === 'OK') && ((direction === "asc") || (direction === "desc")) ) {
                const response = await request.json();
                return res.json({
                    response
                })
            } else {
                return res.status(400).json({
                    "error": "direction parameter is invalid"
                })
            }
        } else if (tags) {
            const url=`https://api.hatchways.io/assessment/blog/posts?tag=${tags}`;
            const request = await fetch(url);
            if((request.status === 200 || 201, request.statusText === 'OK')) {
                const response = await request.json();
                return res.json({
                    response
                })
            }
        } else if(!tags) {
            return res.status(400).json({
                "error": "Tags parameter is required"
            })
        }
    } catch(error) {
        next(error);
    }
});

module.exports = router;