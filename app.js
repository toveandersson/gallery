const express = require('express')
const app = express()
const path = require('path');
const postersData = require('./public/scripts/postersData')
//const path = require('path')

// static assets
app.use(express.static('./public'))
//app.use('/posters/:posterID', express.static('./public'));
// Redirect trailing slashes

// parse form data
app.use(express.urlencoded({ extended: false }))
// parse json
app.use(express.json())

const port = process.env.PORT || 1000;

app.listen(port, () =>
    console.log(`hello port ${port}...`)
);

app.get('/postersData', (req, res) => {
  res.json(postersData);
});

// Serve folders as routes
app.get('/:folderName', (req, res, next) => {
  const folderName = req.params.folderName;
  const filePath = path.join(__dirname, 'public', folderName, `${folderName}.html`);
  res.sendFile(filePath, (err) => {
    if (err) next(); // Continue to 404 handler if not found
  });
});

app.get('/', (req, res, next) => {
  const filePath = path.join(__dirname, 'public', 'home', `index.html`);
  res.sendFile(filePath, (err) => {
    if (err) next(); // Continue to 404 handler if not found
  });
});
app.get('/posters/:posterID', (req, res) => {
  const { posterID } = req.params;
  const singlePoster = postersData.find((poster) => poster.id === Number(posterID));
  if (singlePoster) {
      // Pass poster data as query parameters
      const queryString = new URLSearchParams(singlePoster).toString();
      res.redirect(`/product/product.html?${queryString}`);
  } else {
      res.status(404).send('Poster not found');
  }
});


// app.get('posters/:posterID', (req, res) => {
//   const {posterID} = req.params;
//   const singlePoster = postersData.find(
//     (poster) => poster.id === Number(posterID)
//   )
//   if (singlePoster) {
//     //res.json(singlePoster);
//     res.sendFile(__dirname + '/public/product.html'); 
//     //res.sendFile(__dirname + '/public/styles/styles.css');
//   } else {
//     res.status(404).send('Poster not found');
//   }
// });