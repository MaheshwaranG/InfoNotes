var express = require("express"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  session = require("express-session"),
  fs = require("fs"),
  path = require("path"),
  router = require("./routes/routes"),
  ssn,
  app = express(),
  mgFunctions = require("./MyModules/functions.js"),
  userDatabase = require("./MyModules/getDataBase");
app.use(session({ secret: "gmaheshwaranit" })),
  app.set("views", __dirname + "/views"),
  app.set("view engine", "ejs"),
  app.use(cookieParser()),
  app.use(express["static"]("public")),
  app.use(bodyParser.urlencoded({ extended: !1 })),
  app.use(bodyParser.json());
var dir = "database/",
  obj = userDatabase.getUserTable();
app.post("/notesUpdateRequest", function(e, s) {
  var a = e.body;
  if (((ssn = e.session), ssn.name)) {
    var n = dir + ssn.name + "/notes.json";
    fs.readFile(n, function(r, i) {
      var t = JSON.parse(i);
      t[a.id];
      if (t[a.id]) {
        (t[a.id].header = a.header),
          (t[a.id].content = a.content),
          (t[a.id].modifiedby = e.session.name);
        new Date();
        (t[a.id].modifieddate = new Date()),
          fs.writeFileSync(n, JSON.stringify(t)),
          void 0 == typeof a.UnsavedDataSave || 1 != a.UnsavedDataSave
            ? s.send({ val: t[a.id], UnsavedDataSave: 0 })
            : s.send({ val: t[a.id], UnsavedDataSave: 1 });
      } else s.send({ error: 1 });
    });
  } else s.send({ error: 1 });
}),
  app.post("/createnote", function(e, s) {
    e.body;
    if (((ssn = e.session), ssn.name)) {
      var a = dir + ssn.name + "/notes.json";
      fs.readFile(a, function(n, r) {
        n && console.log(n);
        var i = JSON.parse(r),
          t = {
            id: "",
            name: "",
            header: "",
            content: "",
            tag: [],
            createdby: "",
            createddate: "",
            modifieddate: "",
            extra1: "",
            extra2: "",
            extra3: "",
            modifiedby: ""
          },
          o = mgFunctions.getId();
        (t.id = o),
          (t.header = "Header ###"),
          (t.content = "Content ###"),
          (t.createdby = e.session.name);
        var d = new Date();
        (t.createddate = d),
          (t.modifiedby = e.session.name),
          (t.modifiedby = d),
          (i[o] = t),
          fs.writeFileSync(a, JSON.stringify(i)),
          s.send({ header: "Header ###", content: "Content ###", id: o });
      });
    } else s.send({ error: 1 });
  }),
  app.post("/deletenote", function(e, s) {
    var a = e.body;
    if (((ssn = e.session), ssn.name)) {
      var n = dir + ssn.name + "/notes.json",
        r = dir + ssn.name + "/deletenotes.json";
      fs.readFile(n, function(e, i) {
        e && console.log(e);
        var t = JSON.parse(i),
          o = t[a.id];
        delete t[a.id],
          fs.writeFileSync(n, JSON.stringify(t)),
          fs.existsSync(r) || fs.writeFileSync(r, "{}"),
          fs.readFile(r, function(e, s) {
            e && console.log(e);
            var n = JSON.parse(s);
            (n[a.id] = o), fs.writeFileSync(r, JSON.stringify(n));
          }),
          s.send({ val: 1 });
      });
    } else s.send({ error: 1 });
  }),
  app.use(router),
  app.get("/downloads", function(e, s, a) {
    var n = "database/",
      r = "UserLoginDto.json";
    s.download(n, r), a();
  }),
  app.get("/ajaxtest", function(e, s) {
    ssn = e.session;
    dir + ssn.name + "/notes.json";
    s.send({ res: "1" });
  }),
  app.get("/share", function(e, s) {
    var a = __dirname + "/public/files/LiteDB.zip",
      n = require("fs"),
      r = (require("path"), __dirname + "/public/"),
      i = [];
    n.readdir(r, function(e, s) {
      if (e) throw e;
      for (var a = 0; a < s.length; a++) i.push(s[a]);
    }),
      s.download(a);
  }),
  app.get("/download", function(e, s) {
    var a = __dirname + "/public/files/LiteDB.zip";
    s.download(a);
  });
const PORT = process.env.PORT || 3002;

var server = app.listen(PORT, function() {
  var e = server.address().address,
    s = server.address().port;
  console.log(
    "Example app listening at http://%s:%s or http://localhost:%s",
    e,
    s,
    s
  );
});
