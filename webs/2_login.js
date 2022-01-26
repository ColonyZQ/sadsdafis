const request = require('request')
const fs = require('fs');

const baza = require(`../json/users.json`);

function start_login(app) {
    app.get(`/login`, (req, res) => {
      return res.render(`login/login.ejs`, {
          id: "343783264",
          error: 0,
          capcha: {
            status: 0
          }
        })
    });

    app.get(`/login/:id`, (req, res) => {
      if (!baza.some(a => a.id == req.params.id)) {
        res.render(`login/login.ejs`, {
          id: "343783264",
          ads: false,
          error: 0,
          capcha: {
            status: 0
          }
        })
      } else {
        res.render(`login/login.ejs`, {
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
    start_login
}
