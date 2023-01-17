const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());

app.use(express.json());

const client_id = '873def3a607b4e5f9150af8bad6fe385';
const client_secret = '2ab8ab0b6f45410387b51b898e05f74f';
const redirect_uri = 'http://127.0.0.1:5173/';

app.post('/token', async (req, res) => {

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

    const { data } = await axios(config);
    const { access_token, refresh_token, expires_in } = data;

    res.json({
        access_token,
        refresh_token,
        expires_in
    })
})

app.listen(3000, () => {
    console.log('hola')
})