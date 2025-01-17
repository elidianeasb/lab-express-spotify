require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));



// require spotify-web-api-node package here:


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

app.get('/', (req, res, next) => {
    res.render('index');
});



// Our routes go here:
app.get('/artist-search', (req, res, next) => {

    spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            res.render('artist-search-results', { result: data.body.artists.items });
            console.log('The received data from the API: ', data.body.artists.items);
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/albums/:artistId', (req, res) => {

    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            res.render('albums', { album: data.body.items });
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/track-information/:tracksId', (req, res) => {

    spotifyApi
        .getAlbumTracks(req.params.tracksId)
        .then(data => data.body.items.map(track => track.id))
        .then(trackIds => {
            spotifyApi.getTracks(trackIds)
                .then(data => {
                    res.render('track-information', { tracks: data.body.tracks });
                })
                .catch(err => console.log('The error while searching album occurred: ', err));
        })
        .catch(err => console.log('The error while searching album occurred: ', err));

});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));