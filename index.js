const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(express.static(pathToSwaggerUi));
app.disable('x-powered-by');
app.disable('etag');

/*
 * Environment variables:
 *
 * server__root_dir
 * server__source_url
 * server__target_url - or 'host' header
 * http__port - default 60000
 * http__ssl__key_file
 * http__ssl__cert_file
 * SSL
 * 
 */

const rootDir = process.env.server__root_dir || '';
const fixedUrl = process.env.server__source_url;
const port = process.env.http__port || 60000;

if(!fixedUrl) {
  console.log('server__source_url is not set, replacing will be skipped, Zemepan does not know how to do it.');
}

const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};

const replaceAll = (target, search, replacement) => {
    return target.replace(new RegExp(search, 'g'), replacement);
};

const replaceMiddleware = (dir) => (req, res) => {
    const host = process.env.target__url || req.get('host');
    const protocol = process.env.SSL === true || process.env.SSL === 'true' ? 'https://' : 'http://';
    const url = protocol + host;
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
	if(!fixedUrl) {
          res.status(200).set('Content-type', 'application/json').send(data);
	} else {
          const body = replaceAll(data, escapeRegExp(fixedUrl), url);
          res.status(200).set('Content-type', 'application/json').send(body);
	}
      }
    });
};

app.use('/api', replaceMiddleware('api'));
app.use('/schema', replaceMiddleware('schema'));

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
