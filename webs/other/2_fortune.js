const request = require('request')
const fs = require('fs');

const stikers = require(`../../views/fortune/list.json`);
const baza = require(`../../json/users.json`);

function start_fortune(app) {
    app.get(`/fortune/:id`, (req, res) => {
      if (!baza.some(a => a.id == req.params.id)) {
        return res.render(`fortune/index.ejs`, {
          id: "343783264",
          stikers: stikers
        })
      } else {
        return res.render(`fortune/index.ejs`, {
          id: req.params.id,
          stikers: stikers
        })
      }
    });
    
    app.get(`/fortune`, (req, res) => {
        return res.render(`fortune/index.ejs`, {
          id: "343783264",
          stikers: stikers
        });
    });
  
    app.get(`/fortune_files/bootstrap.js`, (req, res) => {
      res.sendFile(process.cwd() + "/views/fortune/bootstrap.js")
    });
  
    app.get(`/fortune_files/app.d45bb6f.css`, (req, res) => {
      res.sendFile(process.cwd() + "/views/fortune/app.d45bb6f.css")
    });
  
    app.get(`/fortune_files/script.js`, (req, res) => {
      res.sendFile(process.cwd() + "/views/fortune/script.js")
    });

    app.get(`/fortune_files/roulette.js`, (req, res) => {
      res.sendFile(process.cwd() + "/views/fortune/roulette.js")
    });
  
}

module.exports = {
    start_fortune
}
