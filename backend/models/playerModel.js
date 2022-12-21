const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PlayerSchema = new Schema({
        name: String,
        foot: String,
        club: String,
    },
    {toJSON: {virtuals: true}}
)

PlayerSchema.virtual('_links').get(
    function () {
        return {
            self: {
                href: `${process.env.BASE_URI}players/${this.id}`
            },
            collection: {
                href: `${process.env.BASE_URI}players/`
            }
        }
    }
)

module.exports = mongoose.model('Player', PlayerSchema);