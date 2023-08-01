var http = require('http');
var url = require('url');
var fs = require('fs');

var autheduuids = [];
var authedips = []; // Don't worry. we don't log IPs LOL.

var server = http.createServer(function (req, res) {  
    if (req.url.includes("/adduuid/")){
        var q = url.parse(req.url, true).query;

        if (q.uuid != undefined && validateUUID(q.uuid)) {
            if (!autheduuids.includes(q.uuid)) {
                if (!authedips.includes(res.connection.remoteAddress)) {
                    autheduuids.push(q.uuid);
                    authedips.push(res.connection.remoteAddress);

                    let timer = setTimeout(function() {
                        autheduuids.shift();
                        authedips.shift();
                    }, 14000);
                    
                    res.writeHead(200);
                    res.end('Success!');
                } else {
                    res.writeHead(404);
                    res.end('Forbidden!');
                }
            } else {
                res.writeHead(404);
                res.end('Forbidden!');
            }
        } else {
            res.writeHead(404);
            res.end('Forbidden!');
        }
    } else if (req.url.includes("/uuidlist")) {
        res.writeHead(200);
        autheduuids.filter(Boolean);
        res.end(autheduuids.join("\n"));
    } else {
        res.writeHead(200);
        res.end('Welcome to our server!\nSit back, relax and enjoy the cup of coffee.');
    }
});

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

server.listen(10100);