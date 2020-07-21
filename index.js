const express = require('express');
const cors = require('cors');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// cors
app.use(cors());

// Set static path
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.json());

const publicVapidKey =
  'BPjWPPAB07Y5XkNzHW8E99sqoKRDA5N7BeMwi8yqGHgzapZuFBWt14KLxXa0IUGR3cNkEnFKX-goJ11WsjevPqA';
const privateVapidKey = '754w4tzhqBMsEN0ZoIa6zbxEQQNqa4O2rjNLaF041gs';

webpush.setVapidDetails(
  'mailto:test@test.com',
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post('/subscribe', (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  console.log(subscription);

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({
    title: 'Push Test',
  });

  setTimeout(() => {
    // Pass object into sendNotification
    webpush
      .sendNotification(subscription, payload)
      .catch(err => console.error(err));
  }, 5000);
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
