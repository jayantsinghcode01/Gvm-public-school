require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const app = express();

const PORT = process.env.PORT || 3000;


// MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// MySQL connection check
db.connect((err) => {

    if (err) {
        console.log("MySQL connection failed:", err.message);
    } else {
        console.log("MySQL connected successfully!");
    }

});


// JSON data read karne ke liye
app.use(express.json());


// Website files serve karna
app.use(express.static(__dirname));
app.get("/test", (req, res) => {
    res.send("TEST ROUTE WORKING");
});


// Admission form API
app.post("/admission", (req, res) => {

    const {
        student_name,
        parent_name,
        class_name,
        phone,
        email,
        message
    } = req.body;


    const sql = `
        INSERT INTO admission_enquiries
        (student_name, parent_name, class_name, phone, email, message)
        VALUES (?, ?, ?, ?, ?, ?)
    `;


    const values = [
        student_name,
        parent_name,
        class_name,
        phone,
        email,
        message
    ];


    db.query(sql, values, (err, result) => {

        if (err) {

            console.log("Database error:", err.message);

            return res.status(500).json({
                message: "Admission data save nahi hua."
            });

        }


        console.log("Admission enquiry saved!");

        res.json({
            message: "Admission enquiry successfully saved!"
        });

    });

});
// Contact form API
app.post("/contact", (req, res) => {
    const {
        name,
        email,
        phone,
        subject,
        message
    } = req.body;

    const sql = `
        INSERT INTO contact_messages
        (name, email, phone, subject, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        name,
        email,
        phone,
        subject,
        message
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log("Database error:", err.message);

            return res.status(500).json({
                message: "Contact message save nahi hua."
            });
        }

        console.log("Contact message saved!");

        res.json({
            message: "Message successfully saved!"
        });
    });
});
// Secret Admin URL
app.get("/gvm-admin", (req, res) => {
    res.sendFile(__dirname + "/admin.html");
});
// Admin login API
app.post("/admin-login", (req, res) => {

    const { username, password } = req.body;

    // Admin username aur password
    const adminUsername = "admin";
    const adminPassword = "gvm123";

    if (username === adminUsername && password === adminPassword) {

        res.json({
            message: "Login successful!"
        });

    } else {

        res.status(401).json({
            message: "Username ya password galat hai."
        });

    }

});
// Admin Dashboard
app.get("/admin-dashboard", (req, res) => {
    res.sendFile(__dirname + "/admin-dashboard.html");
});
// Admin: Admission enquiries
app.get("/admin/admissions", (req, res) => {

    const sql = `
        SELECT *
        FROM admission_enquiries
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log("Database error:", err.message);

            return res.status(500).json({
                message: "Admission data load nahi hua."
            });
        }

        res.json(results);

    });

});


// Admin: Contact messages
app.get("/admin/contacts", (req, res) => {

    const sql = `
        SELECT *
        FROM contact_messages
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {

            console.log("Database error:", err.message);

            return res.status(500).json({
                message: "Contact data load nahi hua."
            });
        }

        res.json(results);

    });

});
// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});