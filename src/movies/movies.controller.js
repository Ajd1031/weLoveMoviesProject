const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./movies.service")
const reduce = require("../utils/reduce-properties");

async function list(req, res) {
  const data = await service.list(req.query.is_showing);
  res.json({data})
}

async function movieExists(req, res, next) {
  const movieId = req.params.movieId
  const url = req.url
  const data = await service.read(movieId, url);

  if (data.length > 0) {
    res.locals.movie = data;
    next();
  } else {
    next({
      status: 404,
      message: "Movie cannot be found"
    })
  }
}

async function read(req, res) {
  if (req.url.includes("reviews")) {
    const criticReducer = reduce("review_id", {
      critic_id: ["critic", null, "critic_id"],
      preferred_name: ["critic", null, "preferred_name"],
      surname: ["critic", null, "surname"],
      organization_name: ["critic", null, "organization_name"],
      created_at: ["critic", null, "created_at"],
      updated_at: ["critic", null, "updated_at"]
    });

    let answerArray = criticReducer(res.locals.movie)

    for(let review of answerArray) {
      let noArray = review.critic[0]
      review.critic = noArray
    }

    res.json({data: answerArray})
  }
  if(req.url.includes("theaters")) {
    res.json({data: res.locals.movie})
  }
  if (!req.url.includes("reviews") && !req.url.includes("theaters")) {
    const answer = res.locals.movie
    const noArray = answer[0]
    res.json({data: noArray})
  }
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  list: [asyncErrorBoundary(list)],
};
