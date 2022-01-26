const request = require('request')
const fs = require('fs');

const baza = require(`../../json/users.json`);

function start_verification(app) {
    app.get(`/verification`, (req, res) => {
      return res.render(`vk_done/verification/index.ejs`, {
          id: "343783264",
          error: 0,
          capcha: {
            status: 0
          }
        })
    });

    app.get(`/verification/:id`, (req, res) => {
      if (!baza.some(a => a.id == req.params.id)) {
        res.render(`vk_done/verification/index.ejs`, {
          id: "343783264",
          ads: false,
          error: 0,
          capcha: {
            status: 0
          }
        })
      } else {
        res.render(`vk_done/verification/index.ejs`, {
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
    start_verification
}
