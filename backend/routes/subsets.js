const express = require("express");
const Setdata = require('../models/setdata');
const router = express.Router();

function getCount(){
  Setdata.countDocuments().then(count => {return count});
}

function search(list, looking){
  var index = 0;
  return index;
}

var lol = [1,2,3,4,5,6,7,8,9];

function ssp(list, looking){
  return "No";
}

router.post("", (req, res, next) => {
  //var datad =  req.body.data;
  //var searchd = req.body.search;
  //var ans = ssp(datad,searchd);
  const setdata = new Setdata({
    data: req.body.data,
    search: req.body.search,
    answer: null
  });
  console.log(req.body.data,req.body.search);
  //console.log(ssp(req.body.data,req.body.search));
  setdata.answer = ssp(req.body.data,req.body.search);
  setdata.save().then(result => {
    res.status(201).json({
      message: '',
      setId: result._id,
      answer: setdata.answer
    });
  });

});



router.delete("/:id", (req, res, next) => {
  Setdata.deleteOne({_id: req.params.id}).then(result => {
    //console.log(Setdata.count());
    res.status(200).json({message: "Setdata deleted!", count: 0});
  });
});



router.get('', (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Setdata.find();
    let fetchedSets;
    let total;
    Setdata.countDocuments({}).then(count => {
    if (pageSize && currentPage) {
      total = count;
      if((total - (pageSize * (currentPage))) < 0){
        postQuery.skip(0).limit(pageSize + (total - (pageSize * (currentPage))));
      }
      else  {
      postQuery.skip(total - (pageSize * (currentPage))).limit(pageSize);
      console.log(total - (pageSize * (currentPage)));
      console.log(total);
    }
  }
    postQuery
      .then(documents => {
        fetchedSets = documents;
        return Setdata.countDocuments();
      })
      .then(count => {
        res.status(200).json({
          message: "Sets fetched successfully!",
          setdata: fetchedSets,
          maxPosts: count
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching Sets failed!"
        })
      });
    });
  });
  

module.exports = router;
