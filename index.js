const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "sudha",
    password: "1234",
    database: "Practice"
});

app.get("/user", (req, res) => {
    const q = "SELECT * FROM student_info";

    connection.query(q, (err, result) => {
        if (err){
            console.log(err);
            return res.send("Database Error");
        }

        res.render("students", { result });
    });
});
//Edit 
app.get("/user/:roll_no/edit", (req, res) => {

    let { roll_no } = req.params;

    let q = "SELECT * FROM student_info WHERE roll_no = ?";

    connection.query(q, [roll_no], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        if (result.length === 0) {
            return res.send("Student not found");
        }

        res.render("edit", { student: result[0] });
    });
});
app.patch("/user/:roll_no", (req, res) => {

    let { roll_no } = req.params;
    let { name } = req.body;

    let q = "UPDATE student_info SET name = ? WHERE roll_no = ?";

    connection.query(q, [name, roll_no], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.redirect("/user");
    });
});
//ADD new row
app.get("/user/new", (req, res) => {
    res.render("new");
});

app.post("/user", (req, res) => {

    let { roll_no, name, city, marks } = req.body;

    let q = `
        INSERT INTO student_info
        (roll_no, name, city, marks)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(q, [roll_no, name, city, marks], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        res.redirect("/user");
    });
});
//Delete
app.get("/user/delete", (req, res) => {
    res.render("delete");
});
app.post("/user/delete", (req, res) => {

    let { roll_no } = req.body;

    let q = "DELETE FROM student_info WHERE roll_no = ?";

    connection.query(q, [roll_no], (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Database Error");
        }

        if (result.affectedRows === 0) {
            return res.send("Student not found");
        }

        res.redirect("/user");
    });
});

app.listen(8080, () => {
    console.log("Server running on port 8080");
});