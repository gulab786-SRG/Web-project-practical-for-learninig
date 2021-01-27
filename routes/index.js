var multer =require('multer');
var path=require('path');


var filtermodel = require('../module/model');

var express = require('express');
var router = express.Router();
//
var model = require('../module/model');
var info = model.find({});

//
/* GET home page. */

router.get('/', function (req, res, next) {
  info.exec((err, data) => {

    res.render('index', { title: 'Records', data: data , message:" " });

  })


});


router.post('/', function (req, res, next) {

  const addData = new model({
    name: req.body.name,
    type: req.body.type,
    hours: req.body.hours,
    salary: req.body.salary
  })

  addData.save((err, infoadd) => {
    info.exec((err, data) => {

      res.render('index', { title: 'Records', data: data ,message:"Records inserted successfully"});

    })
  });




});

// filter code 

router.post('/a', function (req, res, next) {

  var filtername = req.body.fname;
  var filtertype = req.body.ftype;
  var filterhours = req.body.fhours;
  var filtersalary = req.body.fsalary;

  console.log(filtername);
  if (filtername != '' && filtertype != '' && filterhours != '' && filtersalary != '') {

    var parameters = {
      $and: [{ name: filtername }, {
        $and: [{ type: filtertype }, {
          $and: [{
            hours: filterhours
          }, { salary: filtersalary }]
        }]
      }]
    }
  }



  else if (filtername == '' && filtertype != '' && filterhours != '' && filtersalary != '') {
    var parameters = {
      $and: [{ type: filtertype }, { $and: [{ hours: filterhours }, { salary: filtersalary }] }]
    }
  }



  else if (filtername != '' && filtertype == '' && filterhours != '' && filtersalary != '') {
    var parameters = {
      $and: [{ name: filtername }, { $and: [{ hours: filterhours }, { salary: filtersalary }] }]
    }
  }


  else if (filtername != '' && filtertype != '' && filterhours == '' && filtersalary != '') {
    var parameters = {
      $and: [{ name: filtername }, { $and: [{ type: filtertype }, { salary: filtersalary }] }]
    }
  }


  else if (filtername != '' && filtertype == '' && filterhours != '' && filtersalary == '') {
    var parameters = {
      $and: [{ name: filtername }, { $and: [{ hours: filterhours }, { type: filtertype }] }]
    }
  }
  // now two at a time will be blank




  // name=blank and type = blank
  else if (filtername == '' && filtertype == '' && filterhours != '' && filtersalary != '') {
    var parameters = {
      $and: [{ hours: filterhours }, { salary: filtersalary }]

    }
  }





  //name and hours  == blank 

  else if (filtername == '' && filtertype != '' && filterhours == '' && filtersalary != '') {
    var parameters = {
      $and: [{ type: filtertype }, { salary: filtersalary }]

    }
  }
  //name and salary == blank 

  else if (filtername == '' && filtertype != '' && filterhours != '' && filtersalary == '') {
    var parameters = {
      $and: [{ hours: filterhours }, { salary: filtersalary }]

    }
  }
  // type and hours ==blank

  else if (filtername != '' && filtertype == '' && filterhours == '' && filtersalary != '') {
    var parameters = {
      $and: [{ name: filtername }, { salary: filtersalary }]

    }
  }

  // now type and salary==blank

  else if (filtername == '' && filtertype != '' && filterhours != '' && filtersalary == '') {
    var parameters = {
      $and: [{ name: filtername }, { salary: filtersalary }]

    }
  }
  // now three blank and one working
  //name not blank
  else if (filtername != '' && filtertype == '' && filterhours == '' && filtersalary == '') {
    var parameters = { name: filtername }

  }


  // now type not blank 
  else if (filtername == '' && filtertype != '' && filterhours == '' && filtersalary == '') {
    var parameters = { type: filtertype }
  }
  //now hours not blank
  else if (filtername == '' && filtertype == '' && filterhours != '' && filtersalary == '') {
    var parameters = { hours: filterhours }
  }
  //now salary not blank 

  else if (filtername == '' && filtertype == '' && filterhours == '' && filtersalary != '') {
    var parameters = { name: filtername }
  }


  // else{
  //   var parameters={}

  // }

  var filterfinddata = filtermodel.find(parameters);


  filterfinddata.exec((err, data1) => {

    res.render('../views/filter.ejs', { title: 'Records', filter: data1 });



  })
})

// delete   code 
router.get('/delete/:id', (req, resp, next) => {

  var idInfo = req.params.id;
  var del = model.findByIdAndDelete(idInfo);

  del.exec((err) => {
    if (err) throw err;
  
//resp.redirect('/');
 info.exec((err, data) => {

  resp.render('index', { title: 'Records', data: data ,message:"Records deleted successfully"});
  
})

  })

})
// now  edit code 

router.get('/edit/:id', (req, resp, next) => {
  var idInfo = req.params.id;

  var editfind = model.findById(idInfo);
  
  editfind.exec((err, Iddata) => {
    resp.render('../views/edit.ejs',{title:"Edit Employee Records",records:Iddata})
  })
})


router.post('/update',(req,resp,next)=>{
var findAndUpdate=model.findByIdAndUpdate(req.body.id,{
  name: req.body.name,
  type: req.body.type,
  hours: req.body.hours,
  salary: req.body.salary

});

 findAndUpdate.exec((err,data)=>{
//resp.redirect('/');
info.exec((err, data) => {

  resp.render('index', { title: 'Records', data: data ,message:"Records updated successfully"});

})
})


})

router.get('/upload', function (req, res, next) {
  info.exec((err, data) => {

    res.render('../views/upload.ejs', { title: 'UPLOAD FILE', data: data , message:"File Successfully Uploaded " });

  })


});


















module.exports = router;

