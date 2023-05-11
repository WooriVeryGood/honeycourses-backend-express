const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', (req, res) => {
    res.status(200).json({
        "message": "Api Online!"
    })
    console.log("안뇽, 여긴 api 루트양. 여긴 왜왔니?")
})

router.post('/', function(req, res, next) {
    const courseData = req.body;
    const sql = 'INSERT INTO courses SET ?';
  
    db.query(sql, courseData, function(err, result) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      } else {
        res.status(201).json({ message: 'Course added successfully!' });
      }
    });
  });

// 수업 리스트 받아오기
router.get('/courses', (req, res) => {
  pool.query('SELECT * FROM courses', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error retrieving courses from database');
    } else {
      res.json(results);
    }
  });
});

//수업 리뷰 받아오기
router.get('/courses/:id/reviews', (req, res) => {
    const courseId = req.params.id;
    pool.query('SELECT * FROM reviews WHERE course_id = ?', [courseId], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error retrieving reviews from database');
      } else {
        res.json(results);
      }
    });
  });

module.exports = router;
