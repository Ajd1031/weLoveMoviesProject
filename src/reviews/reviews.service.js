const knex = require("../db/connection");
reduce = require("../utils/reduce-properties");

function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

function updateReader(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.review_id": reviewId });
}

function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

module.exports = {
  read,
  delete: destroy,
  update,
  updateReader,
};
