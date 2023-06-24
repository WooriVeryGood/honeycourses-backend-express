const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Api Online!",
  });
  console.log("안뇽, 여긴 api 루트양. 여긴 왜왔니?");
});

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
  pool.query(
    "SELECT * FROM reviews WHERE course_id = ?",
    [courseId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving reviews from database");
      } else {
        res.json(results);
      }
    }
  );
});

// 수업 이름 받아오기
router.get("/courses/:id/name", (req, res) => {
  const courseId = req.params.id;
  pool.query(
    "SELECT course_name FROM courses where course_id = ?",
    [courseId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error retrieving courses from database");
      } else {
        if (results.length === 0) {
          res.status(404).send("No such course found.");
        } else {
          res.json(results);
        }
      }
    }
  );
});

// id에 해당하는 강의에 새로운 리뷰 추가
router.post("/courses/:id/reviews", (req, res) => {
  const courseId = req.params.id;
  const { reviewContent, instructorName, reviewTitle, semester, gradeGot } = req.body;
  const formattedReview = reviewContent.replace(/\n/g, "<br>");
  const sql =
    "INSERT INTO reviews (course_id, review_content, instructor_name, review_title, taken_semyr, grade) VALUES (?, ?, ?, ?, ?, ?)";

  pool.query(sql, [courseId, formattedReview, instructorName, reviewTitle, semester, gradeGot], (err, result) => {
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
  const { courseName, courseCredit, courseCategory, yuanxi, youGuanStat } = req.body;
  const sql = `INSERT INTO courses (course_name, course_credit, course_category, kaikeYuanxi, isYouguan) VALUES (?, ?, ?, ?, ?)`;

  pool.query(sql, [courseName, courseCredit, courseCategory, yuanxi, youGuanStat], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error adding courses to the database");
      return;
    }
    console.log(`New course added :${courseName}`);
    res.status(200).send("Course added!");
  });
});

// 추천, 비추 업데이트
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
