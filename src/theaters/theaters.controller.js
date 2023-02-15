const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduce = require("../utils/reduce-properties");
const service = require("./theaters.service")

async function list (req, res) {
    //res.send(service.list)
    const data = await service.list();
    const movieReducer = reduce("theater_id", {
        movie_id: ["movies", null, "movie_id"],
        title: ["movies", null, "title"],
        runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
        rating: ["movies", null, "rating"],
        description: ["movies", null, "description"],
        image_url: ["movies", null, "image_url"],
        created_at: ["movies", null, "created_at"],
        updated_at: ["movies", null, "updated_at"],
        is_showing: ["movies", null, "is_showing"],
    })
    res.json({data: movieReducer(data)})
}

module.exports = {
    list,
}


// movies with somehting about critics I also need to use the reduce properties thingy fucntion