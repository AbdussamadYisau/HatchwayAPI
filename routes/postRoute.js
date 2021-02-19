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

  console.log("tags", tags);

  // Combine two arrays without duplicates
  const mergeArrays = (arr1, arr2) => {
    let result = arr1.concat(
      arr2.filter(
        (item) => !JSON.stringify(arr1).includes(JSON.stringify(item))
      )
    );
    return result;
  };

  // Sort an array
  function sortArray(array, sortByValue, direction) {
    if (direction == "asc" || !direction) {
      return array.sort((a, b) => (a[sortByValue] > b[sortByValue] ? 1 : -1));
    } else {
      return array.sort((a, b) => (a[sortByValue] < b[sortByValue] ? 1 : -1));
    }
  }

  // Return error if sortBy or direction parameter is invalid. Instructions said to have same error message for both.
  if (
    validSortValues.indexOf(sortBy) === -1 ||
    validDirections.indexOf(direction) === -1
  ) {
    res.status(400).send({
      error: "sortBy parameter is invalid",
    });
  }
  // Return error if tags parameter is not present.
  else if (!tags || tags == undefined) {
    res.status(400).send({
      error: "Tags parameter is required",
    });
  } else {
    // Run different logic depending on if there is just 1 tag vs more than 1 tag
    if (tags.indexOf(",") !== -1) {
      // More than 1 tag logic
      let tagsArray = tags.split(",");
      let useHatchwaysPostsApi = tagsArray.map((tag, i) => {
        return axios.get(
          `https://hatchways.io/api/assessment/solution/posts?tags=${tag}`
        );
      });
      // Use axios.all to send requests concurrently
      axios
        .all([...useHatchwaysPostsApi])
        .then((responseArr) => {
          let uniqueArray = [];
          for (let i = 0; i < responseArr.length; i++) {
            uniqueArray = mergeArrays(uniqueArray, responseArr[i].data.posts);
          }
          uniqueArray = sortArray(uniqueArray, sortBy, direction);
          res.status(200).send({ posts: uniqueArray });
        })
        .catch((error) => {
          res.status(400).send({
            error: error,
          });
        });
    } else {
      axios
        .get(`https://hatchways.io/api/assessment/solution/posts?tags=${tags}`)
        .then((response) => {
          res
            .status(200)
            .send({ posts: sortArray(response.data.posts, sortBy, direction) });
        })
        .catch((error) => {
          res.status(400).send({
            error: error,
          });
        });
    }
  }
});

module.exports = router;
