const express = require('express');
const axios = require('axios')
const app = express();
const https = require('https');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const REDIRECT_URL = process.env.REDIRECT_URL
const AUTH_TOKEN = process.env.AUTH_TOKEN
const HOST = process.env.HOST


app.use(express.json());

app.all('*', async (req, res) => {
  try {
    const url = REDIRECT_URL + req.originalUrl;

    const axiosConfig = {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      method: req.method,
      url: url,
      headers: {
        ...req.headers,
        'Host': `${HOST}`,
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      data: ['GET', 'HEAD'].includes(req.method) ? null : req.body
    };

    const response = await axios(axiosConfig);

    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      console.log(`Error during request ${error}`)
      res.status(500).send('No response was received');
    } else {
      res.status(500).send(error.message);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server run on port ${PORT}`);
  console.log(`Redirect url ${REDIRECT_URL}`);

});
