const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();

/*
 * Environment variables in README
 */

const rootDir = process.env.server__root_dir || '';
const basePath = process.env.server__base_path || '';
const sourceUrl = process.env.server__source_url;
const port = process.env.http__port || 60000;

if(!sourceUrl) {
  console.log('server__source_url is not set, replacing will be skipped, Zemepan does not know how to do it.');
}

console.log('Configuration');
console.log('------------------------');
console.log('rootDir', rootDir);
console.log('basePath', basePath);
console.log('sourceUrl', sourceUrl);
console.log('HTTP port', port);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(basePath + '/', express.static(pathToSwaggerUi));
app.disable('x-powered-by');
app.disable('etag');


const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

const replaceAll = (target, search, replacement) => {
    return target.replace(new RegExp(search, 'g'), replacement);
};

const replaceMiddleware = (dir) => (req, res) => {
    const protocol = process.env.SSL === true || process.env.SSL === 'true' ? 'https://' : 'http://';
    const url = process.env.server__target_url ? process.env.server__target_url : (protocol + req.get('host'));
    const targetDir = rootDir + dir + req.url;
    console.log('in ' + targetDir + ' serving to url', url);

    fs.readFile(targetDir, 'utf8', (err, data) => {
      if (err) {
        res.status(500).set('Content-type', 'application/json').send({
          err
	});
      } else {
	//console.log('data size ', data.length);
	//console.log('data ', data);
	if(!sourceUrl) {
          res.status(200).set('Content-type', 'application/json').send(data);
	} else {
          const body = replaceAll(data, escapeRegExp(sourceUrl), url);
          res.status(200).set('Content-type', 'application/json').send(body);
	}
      }
    });
};

app.use(basePath + '/api', replaceMiddleware('api'));
app.use(basePath + '/schema', replaceMiddleware('schema'));

if (process.env.SSL === true || process.env.SSL === 'true') {
    console.log('Zemepán welcomes you at SECURED ' + port + 'th gate of Slovakia...');

    const key = fs.readFileSync(process.env.http__ssl__key_file || process.cwd() + '/ca/key.pem', 'utf-8');
    const cert = fs.readFileSync(process.env.http__ssl__cert_file || process.cwd() + '/ca/cert.pem', 'utf-8');

    https
        .createServer(
            {
                key,
                cert
            },
            app
        )
        .listen(port);
} else {
    console.log('Zemepán welcomes you at ' + port + 'th gate of Slovakia...');
    app.listen(port);
}
