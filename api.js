const express = require('express');
const url = require('url');

const autheduuids = [];
const authedips = [];

const app = express();

function validateUUID(uuid) {
  if (!(isStringUUID(uuid) || isStringUUID(uuid, false)))
    return false;

  uuid = uuid.replace(/-/g, '');
  return true;
}

const UUIDRegex = /[0-9a-fA-F]{8}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{4}[0-9a-fA-F]{12}/;

function isStringUUID(value) {
  if (typeof value !== 'string') return false;
  return UUIDRegex.test(value);
}

app.get('/', (req, res) => {
  res.send('Welcome to our server!\nSit back, relax and enjoy a cup of coffee.');
});

app.get('/uuidlist', (req, res) => {
  res.send(autheduuids.filter(Boolean).join('\n'));
});

app.get('/adduuid', (req, res) => {
  const q = url.parse(req.url, true).query;

  if (q.uuid != undefined && validateUUID(q.uuid)) {
    if (!autheduuids.includes(q.uuid)) {
      if (!authedips.includes(req.ip)) {
        autheduuids.push(q.uuid);
        authedips.push(req.ip);

        setTimeout(function () {
          autheduuids.shift();
          authedips.shift();
        }, 14000);

        res.status(200).send('Success!');
      } else {
        res.status(403).send('Forbidden!');
      }
    } else {
      res.status(403).send('Forbidden!');
    }
  } else {
    res.status(403).send('Forbidden!');
  }
});

const port = 10100;
app.listen(port, () => {
  console.log(`Server running`);
});
