var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require("body-parser");
var url = require("url");
var userDatabase = require("../MyModules/getDataBase");
var mgFunctions = require("../MyModules/functions.js");
var obj = userDatabase.getUserTable();
var dir = "database/";
var fs = require("fs");
var path = require("path");
var ffmpeg = require("ffmpeg");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var ssn;
var staticDatabasePath = "./database";
var databasePath = path.resolve(staticDatabasePath);
var userListDao = userDatabase.getUserTable();
router.get("/app/apiCall", function(e, s) {
  s.json({ message: "hooray! welcome to our rest video api!" });
});
router.get("/apiTest", function(e, s) {
  s.send("home page");
});
router.get("/about", function(e, s) {
  s.send("About us");
});
router.post("/userverification", function(e, s) {
  var a = e.body.username;
  var r = "UserLoginDto.json";
  var t = "./database";
  var n = path.resolve(t);
  var o = path.join(n, r);
  if (!fs.existsSync(o)) {
    fs.writeFileSync(o, "{}");
  }
  if (obj[a]) {
    s.json({ res: "0" });
  } else {
    s.json({ res: "1" });
  }
});
router.post("/signupForm", function(e, s) {
  var a = e.body.username;
  var r = e.body.password;
  var t = e.body.userRole;
  var n = e.body.email;
  var o = e.body.gender;
  var i = e.body.empId;
  var d = new Date();
  var f = "UserLoginDto.json";
  var u = path.join(databasePath, f);
  if (!fs.existsSync(u)) {
    fs.writeFileSync(u, "{}");
  }
  if (obj[a]) {
    s.json({
      message: "Already register User!!!, Try with new domine",
      status: 0
    });
  } else {
    var v = {
      username: "",
      gender: "",
      email: "",
      department: "",
      password: "",
      empId: ""
    };
    v["username"] = a;
    v["password"] = r;
    v["department"] = t;
    v["gender"] = o;
    v["email"] = n;
    v["empId"] = i;
    obj[a] = v;
    fs.writeFileSync(u, JSON.stringify(obj));
    obj = userDatabase.getUserTable();
    userListDao = userDatabase.getUserTable();
    s.render("index", { message: "Success", status: 2 });
  }
});
router.get("/loginerror", function(e, s) {
  s.render("index", { status: "2" });
});
router.get("/login", function(e, s) {
  ssn = e.session;
  if (ssn.name) {
    s.redirect("home");
  } else {
    s.render("index");
  }
});
router.post("/verify", function(e, s) {
  var a = e.body.username;
  var r = e.body.Password;
  response = { Verification: "pass" };
  obj = userDatabase.getUserTable();
  userListDao = userDatabase.getUserTable();
  if (userListDao[a] && r == obj[a]["password"]) {
    ssn = e.session;
    ssn.name = a;
    if (!fs.existsSync(dir + a)) {
      fs.mkdirSync(dir + a);
    }
    s.redirect("home");
  } else {
    s.render("index", { status: "1" });
  }
});
router.post("/userroledetection", function(e, s) {
  var a = "./database/common";
  var r = path.resolve(a);
  r = path.join(r, "UserRoleDto.json");
  if (!fs.existsSync(r)) {
    fs.writeFileSync(r, "{}");
  }
  var t = fs.readFileSync(r, "utf8");
  var n = JSON.parse(t);
  s.send(n);
});
router.post("/getNotes", function(e, s) {
  var a = e.body;
  ssn = e.session;
  if (ssn.name) {
    var r = "./database/" + ssn.name;
    var t = path.resolve(r);
    t = path.join(t, "notes.json");
    var n = fs.readFileSync(t, "utf8");
    var o = JSON.parse(n);
    var i = o[a.id];
    s.send({ data: i });
  } else {
    s.render("index");
  }
});
router.post("/notesSearch", function(e, s) {
  var a = e.body;
  ssn = e.session;
  if (ssn.name) {
    var r = "./database/" + ssn.name;
    var t = path.resolve(r);
    t = path.join(t, "notes.json");
    var n = fs.readFileSync(t, "utf8");
    var o = JSON.parse(n);
    var i = {};
    var d = new RegExp(a.searchKey, "i");
    Object.keys(o).forEach(function(e) {
      if (d.test(o[e]["header"])) {
        i[e] = o[e];
      }
    });
    s.send({ data: i });
  } else {
    s.render("index");
  }
});
router.get("/taskTrack", function(e, s) {
  var a = e.body;
  console.log("user task : request came");

  ssn = e.session;
  if (ssn.name) {
    console.log("user task : " + ssn.name);
    var r = "./database/tracktask";
    var t = path.resolve(r);
    t = path.join(t, "TrackTaskDto.json");
    if (!fs.existsSync(t)) {
      fs.writeFileSync(t, "{}");
    }
    var n = fs.readFileSync(t, "utf8");
    var o = JSON.parse(n);
    console.log("task data  : " + n);
    if (o[ssn.name]) {
      var i = { data: o[ssn.name] };
      s.render("tasktrack", {
        data: o[ssn.name],
        empId: userListDao[ssn.name]["empId"],
        user: ssn.name
      });
    } else {
      s.render("tasktrack", {
        data: {},
        empId: userListDao[ssn.name]["empId"],
        user: ssn.name
      });
    }
  } else {
    console.log("user task : request came not served");
    s.render("index");
  }
});
router.post("/addNewTask", function(e, s) {
  var a = e.body;
  ssn = e.session;
  if (ssn.name) {
    var r = {
      id: "",
      name: "",
      chMember: "",
      storyId: "",
      chStartDate: "",
      chEndDate: "",
      analysisStartDate: "",
      analysisEndDate: "",
      analysisLLReview: "",
      analysisLLendDate: "",
      analysisQCReview: "",
      analysisQCEndDate: "",
      postChStartDate: "",
      postChEndDate: "",
      chLLReview: "",
      chLLEndDate: "",
      RRTEtartDate: "",
      RRTEndDate: "",
      RRTLLReview: "",
      RRTLLEndDate: "",
      finalChReview: "",
      finalChEndDate: "",
      finalQCReview: "",
      finalQCEndDate: "",
      createdby: "",
      createddate: "",
      modifieddate: "",
      modifiedby: "",
      extra1: "",
      extra2: "",
      extra3: ""
    };
    var t = mgFunctions.getId();
    r.id = t;
    Object.keys(a).forEach(function(e) {
      r[e] = a[e];
    });
    r["createdby"] = ssn.name;
    var n = new Date();
    r["createddate"] = n;
    r["modifiedby"] = ssn.name;
    r["modifieddate"] = n;
    var o = "./database/tracktask";
    var i = path.resolve(o);
    i = path.join(i, "TrackTaskDto.json");
    if (!fs.existsSync(i)) {
      fs.writeFileSync(i, "{}");
    }
    var d = fs.readFileSync(i, "utf8");
    var f = JSON.parse(d);
    if (f[ssn.name]) {
    } else {
      f[ssn.name] = {};
    }
    f[ssn.name][t] = r;
    fs.writeFileSync(i, JSON.stringify(f));
    s.redirect("/taskTrack");
  } else {
    s.render("index");
  }
});
router.post("/trackTaskEditReq", function(e, s) {
  var a = e.body;
  ssn = e.session;
  if (ssn.name) {
    var r = "./database/tracktask";
    var t = path.resolve(r);
    t = path.join(t, "TrackTaskDto.json");
    var n = fs.readFileSync(t);
    var o = JSON.parse(n);
    var i = o[ssn.name][a["id"]];
    s.send(i);
  } else {
    s.send({ error: 1 });
  }
});
router.post("/updateTask", function(e, s) {
  var a = e.body;
  ssn = e.session;
  if (ssn.name) {
    var r = "./database/tracktask";
    var t = path.resolve(r);
    t = path.join(t, "TrackTaskDto.json");
    var n = fs.readFileSync(t);
    var o = JSON.parse(n);
    var i = o[ssn.name][a["id"]];
    Object.keys(i).forEach(function(e) {
      i[e] = a[e];
    });
    var d = new Date();
    i["modifiedby"] = ssn.name;
    i["modifieddate"] = d;
    o[ssn.name][a["id"]] = i;
    fs.writeFileSync(t, JSON.stringify(o));
    s.redirect("/taskTrack");
  } else {
    s.redirect("/home");
  }
});
router.post("/deleteTask", function(e, s) {
  var a = e.body;
  ssn = e.session;
  if (ssn.name) {
    var r = "./database/tracktask";
    var t = path.resolve(r);
    t = path.join(t, "TrackTaskDto.json");
    var n = fs.readFileSync(t);
    var o = JSON.parse(n);
    delete o[ssn.name][a["id"]];
    fs.writeFileSync(t, JSON.stringify(o));
    s.send({ val: 1 });
  } else {
    s.send({ error: 1 });
  }
});
router.get("/pathToYourDownload", function(e, s) {
  json2csv({ data: "myCars", fields: "fields" }, function(e, a) {
    s.setHeader("Content-disposition", "attachment; filename=data.csv");
    s.set("Content-Type", "text/csv");
    s.status(200).send(a);
  });
});
router.use(function(e, s, a) {
  ssn = e.session;
  if (e.url !== "/login") {
    if (ssn.name) {
      a();
    } else {
      s.render("index");
    }
  }
});
router.get("/home", function(e, s) {
  var a;
  ssn = e.session;
  var r = dir + ssn.name + "/notes.json";
  if (!fs.existsSync(r)) {
    fs.writeFileSync(r, "{}");
  }
  fs.readFile(r, function(e, r) {
    if (e) {
    }
    a = JSON.parse(r);
    s.render("homepage", {
      data: a,
      user: ssn.name,
      empId: userListDao[ssn.name]["empId"]
    });
  });
});
router.get("/profile", function(e, s) {
  ssn = e.session;
  obj[ssn.name]["password"] = "";
  var a = "./database/common";
  var r = path.resolve(a);
  r = path.join(r, "UserRoleDto.json");
  if (!fs.existsSync(r)) {
    fs.writeFileSync(r, "{}");
  }
  var t = fs.readFileSync(r, "utf8");
  var n = JSON.parse(t);
  s.render("profile", {
    role: n.role,
    data: obj[ssn.name],
    user: ssn.name,
    empId: userListDao[ssn.name]["empId"]
  });
});
router.post("/profileUpdate", function(e, s) {
  var a = e.body.department;
  var r = e.body.email;
  var t = e.body.empId;
  var n = new Date();
  var o = "UserLoginDto.json";
  var i = path.join(databasePath, o);
  obj = userDatabase.getUserTable();
  obj[ssn.name]["empId"] = t;
  obj[ssn.name]["email"] = r;
  obj[ssn.name]["department"] = a;
  fs.writeFileSync(i, JSON.stringify(obj));
  obj = userDatabase.getUserTable();
  userListDao = userDatabase.getUserTable();
  s.send({ code: 1 });
});
router.get("/videoformatter", function(e, s) {
  var a;
  ssn = e.session;
  ffmpeg("video1")
    .setStartTime("00:00:03")
    .setDuration("10")
    .output("videos/test.mp4")
    .on("end", function(e) {
      if (!e) {
      }
    })
    .on("error", function(e) {})
    .run();
  var r = "videos/";
  var t = "test.mp4";
  s.download(r, t);
});
router.get("/logout", function(e, s) {
  e.session.destroy(function(e) {
    if (e) {
    } else {
      s.redirect("/login");
    }
  });
});
module.exports = router;
