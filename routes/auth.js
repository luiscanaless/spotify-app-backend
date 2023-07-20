const { Router } = require("express");
const axios = require('axios');
const imageUrlToBase64 = require("../utils/base64");

const router = Router()

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI

router.get('/login', (req, res) => {

    const scope = "streaming \
    user-read-email \
    user-read-private \
    user-modify-playback-state \
    user-read-currently-playing \
    user-read-playback-state \
    user-read-recently-played \
    ugc-image-upload \
    playlist-modify-public \
    playlist-modify-private"

    const auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,

    })

    res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})

router.post('/token', async (req, res) => {

    const config = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            grant_type: 'authorization_code',
            code: req.body.code,
            redirect_uri: redirect_uri
        }
    }

    try {
        const { data } = await axios(config);

        const { access_token, expires_in, refresh_token } = data

        res.json({
            access_token,
            expires_in,
            refresh_token
        })

    } catch (error) {
        console.log('error en token')
    }
})

router.post('/refresh', async (req, res) => {

    const config = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
            grant_type: 'refresh_token',
            refresh_token: req.body.refreshToken,
        }
    }

    try {
        const { data } = await axios(config);
        console.log(data)
        const { access_token, expires_in, refresh_token } = data

        res.json({
            access_token,
            expires_in,
            refresh_token
        })

        // res.redirect('http://localhost:5173/')

    } catch (error) {
        console.log('error en refresh')
    }
})

router.get('/image', async (req, res) => {
    const img1 = await imageUrlToBase64('https://cdn.discordapp.com/attachments/1076804565904666626/1131411793927999519/hml4l3np76681.jpg')
    const img2 = await imageUrlToBase64('https://media.discordapp.net/attachments/348613468246638593/1131417122724139038/image.png')

    res.json({
        img1,
        img2
    })
})

module.exports = router