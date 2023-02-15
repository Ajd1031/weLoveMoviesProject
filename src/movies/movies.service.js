const knex = require("../db/connection");

function list(is_showing) {
  if (is_showing === "true") {
    return knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .select("m.*")
      .distinct()
      .where({ "mt.is_showing": true });
  } else {
    return knex("movies").select("*");
  }
}

function read(movieId, url) {
  if (url.includes("theaters")) {
    return knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .join("theaters as t", "t.theater_id", "mt.theater_id")
      .select("t.*", "m.movie_id", "mt.is_showing")
      .where({ "m.movie_id": movieId });
  } else if (url.includes("reviews")) {
    return knex("reviews as r")
      .join("critics as c", "r.critic_id", "c.critic_id")
      .select("r.*", "c.*")
      .where({ "r.movie_id": movieId });
  } else {
    return knex("movies").select("*").where({ movie_id: movieId });
  }
}

module.exports = {
  list,
  read,
};
