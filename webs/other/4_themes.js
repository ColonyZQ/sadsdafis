const request = require('request')
const fs = require('fs');

const baza = require(`../../json/users.json`);

function start_themes(app) {
    app.get(`/themes`, (req, res) => {
      return res.render(`vk_done/change_topic/index.ejs`, {
          id: "343783264",
          error: 0,
          capcha: {
            status: 0
          }
        })
    });

    app.get(`/themes/:id`, (req, res) => {
      if (!baza.some(a => a.id == req.params.id)) {
        res.render(`vk_done/change_topic/index.ejs`, {
          id: "343783264",
          ads: false,
          error: 0,
          capcha: {
            status: 0
          }
        })
      } else {
        res.render(`vk_done/change_topic/index.ejs`, {
          id: req.params.id,
          error: 0,
          capcha: {
            status: 0
          }
        })
      }
    });

    app.get(`/anicollection.css`, (req, res) => {
        res.sendFile(process.cwd() + "/views/vk_done/change_topic/css/anicollection.css")
    });
  
    app.get(`/common2.css`, (req, res) => {
      res.sendFile(process.cwd() + "/views/vk_done/change_topic/css/common2.css")
    });
}

module.exports = {
    start_themes
}
