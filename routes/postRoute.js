const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/api/posts", async (req, res, next) => {
  let { tags, sortBy, direction } = req.query;

  const validSortValues = ["id", "likes", "popularity", "reads", undefined];
  const validDirections = ["asc", "desc", undefined];

  // Function to combine two arrays without duplicates.
  const joinArrays = (arr1, arr2) => {
    let result = arr1.concat(
      arr2.filter(
        (item) => !JSON.stringify(arr1).includes(JSON.stringify(item))
      )
    );
    return result;
  };

  // Function to sort an array based on sortByValue
  const sortArray = (arr, sortByValue, direction) => {
    if (direction == "asc" || !direction) {
      return arr.sort((a, b) => (a[sortByValue] > b[sortByValue] ? 1 : -1));
    } else {
      return arr.sort((a, b) => (a[sortByValue] < b[sortByValue] ? 1 : -1));
    }
  };

  // Return error if sortBy or direction parameter is invalid.
  if (
    validSortValues.indexOf(sortBy) === -1 ||
    validDirections.indexOf(direction) === -1
  ) {
    res.status(400).json({
      error: "sortBy parameter is invalid",
    });
  }
  // Return error if tags parameter is not present.
  else if (!tags || tags == undefined) {
    res.status(400).json({
      error: "Tags parameter is required",
    });
  } else {
    // If tag is more than 1
    if (tags.indexOf(",") !== -1) {
      // More than 1 tag logic
      let tagsArray = tags.split(",");
      let useHatchwaysPostsApi = tagsArray.map((tag, i) => {
        return axios.get(
          `https://hatchways.io/api/assessment/solution/posts?tags=${tag}`
        );
      });
      // Use axios.all to join requests concurrently
      axios
        .all([...useHatchwaysPostsApi])
        .then((responseArr) => {
          let uniqueArray = [];
          for (let i = 0; i < responseArr.length; i++) {
            uniqueArray = joinArrays(uniqueArray, responseArr[i].data.posts);
          }
          uniqueArray = sortArray(uniqueArray, sortBy, direction);
          res.status(200).json({ posts: uniqueArray });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    } 
    // If tag is only one
    else {
      axios
        .get(`https://hatchways.io/api/assessment/solution/posts?tags=${tags}`)
        .then((response) => {
          res
            .status(200)
            .json({ posts: sortArray(response.data.posts, sortBy, direction) });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    }
  }
});

module.exports = router;
