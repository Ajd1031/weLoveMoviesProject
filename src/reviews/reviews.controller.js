const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reviews.service")

async function reviewExists(req, res, next) {
    const reviewId = req.params.reviewId;
    const method = req.method
    const foundReview = await service.read(reviewId);
    
    if (foundReview) {
        res.locals.review = foundReview;
        next();
    } else {
        next({
            status: 404,
            message: "Review cannot be found."
        })
    }
};

async function update(req, res, next) {
    const reviewId = req.params.reviewId;
    const updatedReview = {
        ...req.body.data,
        review_id: reviewId,
    };
    await service.update(updatedReview)

    next();
}

async function readUpdate(req, res) {
    const criticReducer = reduce("review_id", {
        preferred_name: ["critic", null, "preferred_name"],
        surname: ["critic", null, "surname"],
        organization_name: ["critic", null, "organization_name"],
      });

      const reviewId = req.params.reviewId;
      
      const data = await service.updateReader(reviewId)

      let answerArray = criticReducer(data)

      let noArrayForCritic = answerArray[0].critic[0]

      answerArray[0].critic = noArrayForCritic;

      res.json({data: answerArray[0]})
}

async function destroy (req, res) {
    const reviewId = req.params.reviewId;
    await service.delete(reviewId)
    
    res.status(204).send("No Content")
};

module.exports = {
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update), asyncErrorBoundary(readUpdate)]
}