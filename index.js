const express = require('express'),
    bluebird = require('bluebird'),
    request = bluebird.promisifyAll(require('request')),
    argv = require('yargs')
        .alias('p', 'port')
        .default('p', 7070)
        .argv;

const port = argv.port;
const ROOT = __dirname;

const searchUrl = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDheaXmeP-MaW5buX-nxSbsYunQ1U9D6mc&cx=001868711167737196319:ma5f00vvfku&searchType=image&q={KEY}&startIndex={INDEX}';

const app = express();

app.use(express.static(ROOT + '/client'));

app.get('/api/search', (req, res) => {
    const key = req.query.key;
    const index = req.query.index || 0;
    request.getAsync(searchUrl.replace('{KEY}', encodeURIComponent(key)).replace('{INDEX}', index))
        .then((r) => {
            const body = JSON.parse(r.body);
            return (body.items || []).sort((a, b) => a.link > b.link);
        })
        .then(items => res.end(JSON.stringify({items})));
});

app.get('/', (req, res) => {
    res.sendFile('./client/index.html', {root: ROOT});
});

app.listen(port, () => console.log(`server is up on ${port}`));


    
