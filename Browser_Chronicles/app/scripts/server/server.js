var express  = require('express');
var app      = express();
var morgan =   require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  'extended':'true',
  limit: '50mb',
  parameterLimit:50000
}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))
app.use(methodOverride());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");

  if ('OPTIONS' == req.method) {
    return res.send(200);
  }
  next();
});

app.listen(8080);
console.log("App listening on port 8080");

app.post('/api/story', function(req, res) {
  var storyId=req.body.storyId;
  var stepId=req.body.stepId;
  var title=req.body.title;
  var description=req.body.description;
  var json=null;

  console.log(req.body);

  var fs = require('fs'),
    parseString = require('xml2js').parseString,
    xml2js = require('xml2js');

  fs.readFile('app/stories/story'+storyId+'.xml', 'utf-8', function (err, data){
    if(err) console.log(err);

    parseString(data, function(err, result){
      if(err) console.log(err);

      json = result;

      console.log(json.story.steps[0].step.length);
      //json.root.graph[0].node[0].weight = "99";
      for (var d = 0, len = json.story.steps[0].step.length; d < len; d += 1) {
        //console.log(json.story.steps[0].step[d]);
        console.log('****');
        if (json.story.steps[0].step[d].$.id === stepId) {
          var id=d;
          json.story.steps[0].step[d].description=description;
          json.story.steps[0].step[d].title=title;

          break;
        }
      }

      var builder = new xml2js.Builder();
      var xml = builder.buildObject(json);

      fs.writeFile('app/stories/story'+storyId+'.xml', xml, function(err, data){
        if (err) console.log(err);

        console.log("successfully written our update xml to file");
      })

    });
  });

  res.send('OK');
});
