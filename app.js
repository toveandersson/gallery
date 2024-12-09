const express = require('express')
const app = express()
const posters = require('./public/scripts/postersData')
//const path = require('path')

// static assets
app.use(express.static('./public'))
// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())

const port = process.env.PORT || 1000;

app.listen(port, () =>
    console.log(`hello port ${port}...`)
);

app.get('/posters', (req, res) => {
  res.json(posters);
});

app.get('/posters/:posterID', (req, res) => {
  const {posterID} = req.params;
  const singlePoster = posters.find(
    (poster) => poster.id === Number(posterID)
  )
  res.json(singlePoster);
});