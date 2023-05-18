const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Api Online!",
  });
  console.log("안뇽, 여긴 api 루트양. 여긴 왜왔니?");
});

/* router.post('/', function(req, res, next) {
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
  });*/

// 수업 리스트 받아오기
router.get("/courses", (req, res) => {
  pool.query("SELECT * FROM courses", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error retrieving courses from database");
    } else {
      res.json(results);
    }
  });
});

//수업 리뷰 받아오기
router.get("/courses/:id/reviews", (req, res) => {
  const courseId = req.params.id;
  const getReviewsQuery = "SELECT * FROM reviews WHERE course_id = ?";
  const getCourseNameQuery = "SELECT course_name FROM courses WHERE course_id = ?";

  pool.query(getReviewsQuery, [courseId], (error, reviews) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error retrieving reviews from the database");
      return;
    }

    pool.query(getCourseNameQuery, [courseId], (error, courseResult) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving course name from the database");
        return;
      }

      const courseName = courseResult[0]?.course_name;
      const reviewsWithCourseName = reviews.map((review) => {
        return { ...review, course_name: courseName };
      });

      res.json(reviewsWithCourseName);
    });
  });
});


// id에 해당하는 강의에 새로운 리뷰 추가
router.post("/courses/:id/reviews", (req, res) => {
  const courseId = req.params.id;
  const { reviewContent, reviewTitle } = req.body;
  const formattedReview = reviewContent.replace(/\n/g, "<br>");
  const sql =
    "INSERT INTO reviews (course_id, review_content, review_title) VALUES (?, ?, ?)";

  pool.query(sql, [courseId, formattedReview, reviewTitle], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error adding reviews to the database");
      return;
    }
    console.log(`New review added for course ID ${courseId}`);
    res.status(200).send("Review added!");
  });
});

// 새로운 수업 추가
router.post("/courses", (req, res) => {
  const { courseName, courseCredit, courseCategory } = req.body;
  const sql = `INSERT INTO courses (course_name, course_credit, course_category) VALUES (?, ?, ?)`;

  pool.query(sql, [courseName, courseCredit, courseCategory], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error adding courses to the database");
      return;
    }
    console.log(`New course added :${courseName}`);
    res.status(200).send("Course added!");
  });
});

router.post("/courses/:id/reviews/:rid", (req, res) => {
  // const courseId = req.params.id;
  const reviewId = req.params.rid;
  const { reviewPoint } = req.body;
  const sql = "UPDATE reviews SET review_point = ? WHERE review_id = ?";

  pool.query(sql, [reviewPoint, reviewId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating review points to the database");
      return;
    }
    console.log(`Review point updated for Review_id: ${reviewId}`);
    res.status(200).send("Review point updated!");
  });
});

module.exports = router;
