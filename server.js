const cluster = require('cluster');
const restify = require('restify');
const stockBuy = require('./stock/buy');
const stockUpdate = require('./stock/update');
const stockView = require('./stock/view');
const logView = require('./stock/logs');
const numCPUs = require('os').cpus().length;

var server = restify.createServer({
    name: 'Adcash API',
    version: '1.0.0'
  });
  server.use(restify.plugins.acceptParser(server.acceptable));
  server.use(restify.plugins.queryParser());
  server.use(restify.plugins.bodyParser());
  
// TODO : Accept parameters from users and perform search, return response(highest stock first) and log request
// TODO : Fetch current Stock quotes from companies and populate DB

server.get("/api/buy", function (req, res, next) {
    stockBuy(req.query, res, next);
});

server.get("/api/view", function (req, res, next) {
    stockView(req.query, res, next);
});

server.get("/api/view/logs", function (req, res, next) {
    logView(req.query, res, next);
});

server.get("/api/update", function (req, res, next) {
    stockUpdate(req.query, res, next);
});

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
      console.log(`worker ${worker.process.pid} died`);
    });
}else{
    server.listen(8030, function () {
        console.log(`%s listening at %s with process ${process.pid}`, server.name, server.url);
    });
}