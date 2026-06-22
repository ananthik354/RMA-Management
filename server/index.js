const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

// middleware FIRST
app.use(cors({
    origin: "http://localhost:3000"
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /require("./cron");

// database
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Mysql@123.",
    database: "crud_contact"
});

function generateReminders_l(item_id) {

    const reminderDays = [
        3, 5, 7, 10,
        13, 15, 17, 20,
        23, 25, 27, 30,
        33, 35, 37, 40
    ];

    const values = reminderDays.map(day => [
        item_id,
        day
    ]);

    const sql = `
        INSERT INTO rma_reminders
        (rma_item_id, reminder_day)
        VALUES ?
    `;

    db.query(sql, [values], (err) => {

        if (err) {
            console.log("Reminder Insert Error:", err);
        } else {
            console.log("Reminders Created For Item:", item_id);
        }

    });
}

function generateReminders(item_id) {

    const reminderDays = [
        3, 5, 7, 10,
        13, 15, 17, 20,
        23, 25, 27, 30,
        33, 35, 37, 40
    ];

    const values = reminderDays.map(day => [
        item_id,
        day
    ]);

    const sql = `
        INSERT INTO rma_reminders1
        (rma_item_id, reminder_day)
        VALUES ?
    `;

    db.query(sql, [values], (err) => {

        if (err) {
            console.log("Reminder Insert Error:", err);
        } else {
            console.log("Reminders Created For Item:", item_id);
        }

    });
}

// login api
app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const sql =
        "SELECT id,username,role FROM login_user WHERE username=? AND password=?";

    db.query(
        sql,
        [username, password],
        (err, data) => {

            if (err) {
                console.log(err);
                return res.status(500).json("Error");
            }

            if (data.length > 0) {
                return res.json({
                    message: "Login Successfully",
                    role: data[0].role,
                    id: data[0].id,
                    username: data[0].username,
                });
            } else {
                return res.json("No Record");
            }
        }
    );
});

// app.get("/api/get_product", (req, res) => {

//     const sqlGet =
//         SELECT * FROM rma_entry1;

//     db.query(sqlGet, (error, result) => {
//         res.send(result);
//     });
// });

// get api
app.get("/api/get", (req, res) => {

    const sqlGet =
        "SELECT id, customer_name, company_name, phone_no FROM customer_details";

    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});

app.get("/api/staff", (req, res) => {

    const sqlGet =
        "SELECT id, username,role from login_user";

    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});

app.get("/api/service", (req, res) => {

    const sqlGet =
        "SELECT id, servicer_name, center_name, phone_no FROM services_details";

    db.query(sqlGet, (error, result) => {
        res.send(result);
    });
});

app.delete("/api/remove/:id", (req, res) => {
    const id = req.params.id;
    const sqlRemove =
        "Delete from customer_details where id=?";
    db.query(sqlRemove, [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        console.log(result);

        res.send("Customer deleted successfully");
    });
});

app.delete("/api/ser_remove/:id", (req, res) => {
    const id = req.params.id;
    const sqlRemove =
        "Delete from services_details where id=?";
    db.query(sqlRemove, [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        console.log(result);

        res.send("Service deatails deleted successfully");
    });
});

// post api
app.post("/api/post", (req, res) => {

    const {
        customer_name,
        company_name,
        address,
        phone_no,
        gst_no,
        location,
        email
    } = req.body;

    // Required validation
    if (
        !customer_name ||
        !address ||
        !phone_no ||
        !location
    ) {
        return res.status(400).json({
            message: "Please fill required fields"
        });
    }

    const sql = `
    INSERT INTO customer_details
    (
        customer_name,
        company_name,
        address,
        phone_no,
        gst_no,
        location,
        email
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            customer_name,
            company_name,
            address,
            phone_no,
            gst_no,
            location,
            email
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json("Database Error");
            }

            res.json("Customer Added Successfully");
        }
    );
});

app.post("/api/service_d", (req, res) => {

    const {
        servicer_name,
        center_name,
        address,
        phone_no,
        mobile,
        location,
        email
    } = req.body;

    // Required validation
    if (
        !servicer_name ||
        !center_name ||
        !address ||
        !phone_no ||
        !mobile ||
        !location
    ) {
        return res.status(400).json({
            message: "Please fill required fields"
        });
    }

    const sql = `
    INSERT INTO services_details
    (
        servicer_name,
        center_name,
        address,
        phone_no,
        mobile,
        location,
        email
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            servicer_name,
            center_name,
            address,
            phone_no,
            mobile,
            location,
            email
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json("Database Error");
            }

            res.json("Service Added Successfully");
        }
    );
});

// app.post("/api/product", (req, res) => {

//     const {
//         product_name,
//         model_number,
//         quantity_no,
//         serial_no,
//         accessory,
//         customer_dc_no,
//         issues,
//         reminder_date
//     } = req.body;

//     // Required validation
//     if (
//         product_name ||
//         model_number ||
//         quantity_no ||
//         serial_no ||
//         accessory ||
//         customer_dc_no ||
//         issues ||
//         reminder_date
//     ) {
//         return res.status(400).json({
//             message: "Please fill required fields"
//         });
//     }

//     const sql = `
//     INSERT INTO rma_entry1
//     (
//         product_name,
//             model_number,
//             quantity_no,
//             serial_no,
//             accessory,
//             customer_dc_no,
//             issues,
//             reminder_date
//     )
//     VALUES (?, ?, ?, ?, ?, ?, ?,?)
//     `;

//     db.query(
//         sql,
//         [
//             product_name,
//             model_number,
//             quantity_no,
//             serial_no,
//             accessory,
//             customer_dc_no,
//             issues,
//             reminder_date
//         ],
//         (err, result) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).json("Database Error");
//             }

//             res.json("Service Added Successfully");
//         }
//     );
// });



app.post("/api/addstaff", (req, res) => {

    const {
        username,
        password,
        role
    } = req.body;

    // Required validation
    if (
        !username ||
        !password ||
        !role
    ) {
        return res.status(400).json({
            message: "Please fill required fields"
        });
    }

    const sql = `
    INSERT INTO login_user
    (
        username,
        password,
        role
    )
    VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            username,
            password,
            role
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json("Database Error");
            }

            res.json("Staff Added Successfully");
        }
    );
});


app.get(
    "/api/password/:id",
    (req, res) => {

        const { id } =
            req.params;

        const sql =
            "SELECT username FROM login_user WHERE id=?";

        db.query(
            sql,
            [id],
            (error, result) => {

                if (error) {
                    console.log(error);
                }

                res.send(result);
            }
        );
    }
);
app.put(
    "/api/password/:id",
    (req, res) => {

        const { id } =
            req.params;

        const { password } =
            req.body;

        const sqlUpdate =
            `UPDATE login_user
             SET password=?
             WHERE id=?`;

        db.query(
            sqlUpdate,
            [password, id],
            (error, result) => {

                if (error) {
                    console.log(error);

                    return res
                        .status(500)
                        .send(error);
                }

                res.json({
                    message:
                        "Password Updated Successfully"
                });
            }
        );
    }
);

app.get("/api/get/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "select  * from customer_details where id=?";
    db.query(sqlGet, id, (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

app.get("/api/getservice/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "select  * from services_details where id=?";
    db.query(sqlGet, id, (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

// Customer Count API
app.get("/api/customerCount",(req, res) => {
        const sql =
            `SELECT COUNT(*) AS total FROM customer_details`;
        db.query(
            sql,
            (error, result) => {
                if (error) {
                    console.log(
                        error);
                    return res
                        .status(500)
                        .send(error);
                }
                res.send( result);
            });
    });

app.get("/api/InwardCount",(req, res) => {
        const sql =
            `SELECT COUNT(*) AS total FROM rma_items WHERE TRIM(LOWER(status)) = 'pending'`;
        db.query(
            sql,
            (error, result) => {
                if (error) {
                    console.log(error );
                    return res
                        .status(500)
                        .send(error);
                }
                res.send(result);
            });
    });

app.get("/api/CompleteCount",(req, res) => {
        const sql =
            `SELECT COUNT(*) AS total FROM rma_items WHERE TRIM(LOWER(status)) = 'completed'`;
        db.query(
            sql,
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .send(error);
                }
                res.send(result);
            });
    });

app.get("/api/OutwardCount",(req, res) => {
        const sql =
            `SELECT COUNT(*) AS total FROM rma_items1 WHERE TRIM(LOWER(status)) = 'pending'`;
        db.query(
            sql,
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .send(error);
                }
                res.send(result
                );
            });
    });

app.get("/api/CompleteCount_o",(req, res) => {
        const sql =
            `SELECT COUNT(*) AS total FROM rma_items1 WHERE TRIM(LOWER(status)) = 'completed'`;
        db.query(
            sql,
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .send(error);
                }
                res.send(result);
            });
    });

    app.get("/api/pendingCount_irma",(req, res) => {
        const sql = `
        SELECT COUNT(DISTINCT r.rma_no) AS total
FROM rma_entry1 r
WHERE LOWER(TRIM(r.status)) = 'pending'`;
        db.query(
            sql,
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .send(error);
                }
                res.send(result);
            });
    });

app.get("/api/completeCount_irma",(req, res) => {
        const sql = `
        SELECT COUNT(DISTINCT r.rma_no) AS total
FROM rma_entry1 r
WHERE LOWER(TRIM(r.status)) = 'completed'`;
        db.query(
            sql,
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .send(error);
                }
                res.send(result);
            });
    });

app.get("/api/pendingCount_orma",(req, res) => {
        const sql = `
        SELECT COUNT(DISTINCT r.rma_no) AS total
FROM rma_out r
WHERE LOWER(TRIM(r.status)) = 'pending'`;
        db.query(
            sql,
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .send(error);
                }
                res.send(result);
            });
    });

app.get("/api/completeCount_orma",(req, res) => {
        const sql = `
        SELECT COUNT(DISTINCT r.rma_no) AS total
FROM rma_out r
WHERE LOWER(TRIM(r.status)) = 'completed'`;
        db.query(
            sql,
            (error, result) => {
                if (error) {
                    console.log(error);
                    return res
                        .status(500)
                        .send(error);
                }
                res.send(result);
            });
    });


app.put("/api/update/:id", (req, res) => {
    const { id } = req.params;
    const {
        customer_name,
        company_name,
        address,
        phone_no,
        gst_no,
        location,
        email
    } = req.body;
    const sqlUpdate = "update customer_details set customer_name=?,company_name=?,address=?,phone_no=?,gst_no=?,location=?,email=? where id=?";
    db.query(sqlUpdate, [customer_name, company_name, address, phone_no, gst_no, location, email, id], (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

app.put("/api/update_ser/:id", (req, res) => {
    const { id } = req.params;
    const {
        servicer_name,
        center_name,
        address,
        phone_no,
        mobile,
        location,
        email
    } = req.body;
    const sqlUpdate = "update services_details set servicer_name=?,center_name=?,address=?,phone_no=?,mobile=?,location=?,email=? where id=?";
    db.query(sqlUpdate, [servicer_name, center_name, address, phone_no, mobile, location, email, id], (error, result) => {
        if (error) {
            console.log(error);
        }
        res.send(result);
    });
});

// RMA Entry

app.get("/api/get_P", (req, res) => {
     const sql = `SELECT
    MIN(r.id) AS id,
    r.rma_no,
    MAX(c.customer_name) AS customer_name,
    MIN(r.product_name) AS product_name,
    MIN(r.model_number) AS model_number,
    MIN(r.quantity_no) AS quantity_no,
    MIN(r.status) AS status,
    MIN(r.entry_date) AS entry_date
FROM rma_entry1 r
JOIN customer_details c
ON r.customer_id = c.id
GROUP BY r.rma_no
ORDER BY r.rma_no ASC`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});

// get single data
app.get("/api/get_P/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
SELECT
customer_id,
product_name,
model_number,
quantity_no,
serial_no,
accessory,
customer_dc_no,
issues,
reminder_date
FROM rma_entry1
WHERE id=?
`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});

app.get("/test", (req, res) => {
    res.send("API Working");
});

app.post("/api/product", (req, res) => {

    const {
        customer_id,
        product_name,
        model_number,
        quantity_no,
        serial_no,
        accessory,
        customer_dc_no,
        issues
    } = req.body;

    const sql = `
    INSERT INTO rma_entry1
    (customer_id, product_name, model_number, quantity_no, serial_no, accessory, customer_dc_no, issues, status)
    VALUES (?,?,?,?,?,?,?,?,?)
    `;

    db.query(sql, [
        customer_id,
        product_name,
        model_number,
        quantity_no,
        serial_no,
        accessory,
        customer_dc_no,
        issues,
        "pending"
    ], (err, result) => {

        if (err) return res.status(500).json(err);

        const rmaId = result.insertId;

        let date = new Date();
        date.setDate(date.getDate() + 3);

        const reminderDate = date.toISOString().split("T")[0];

        db.query(
            `INSERT INTO rma_reminders (rma_entry1_id, reminder_date, status)
             VALUES (?,?,?)`,
            [rmaId, reminderDate, "pending"]
        );

        res.json({ message: "Saved" });
    });
});
// update data
app.put("/api/update_P/:id", (req, res) => {
    const { id } = req.params;
    console.log(req.body);

    const {
        customer_id,
        product_name,
        model_number,
        quantity_no,
        serial_no,
        accessory,
        customer_dc_no,
        issues,
        reminder_date,
        
    } = req.body;

    const formattedDate =
        reminder_date
            ? reminder_date.split("T")[0]
            : null;

    const sql = `
    UPDATE rma_entry1 SET
    customer_id=?,
    product_name=?,
    model_number=?,
    quantity_no=?,
    serial_no=?,
    accessory=?,
    customer_dc_no=?,
    issues=?,
    reminder_date=?
    
    WHERE id=?
    `;

    db.query(
        sql,
        [
            customer_id,
            product_name,
            model_number,
            quantity_no,
            serial_no,
            accessory,
            customer_dc_no,
            issues,
            formattedDate,
            
            id
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.send("Updated Successfully");
        }
    );
});

// Delete Data
app.delete("/api/remove_P/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM rma_entry1 WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send("Deleted Successfully");
    });
});

app.get("/api/customers", (req, res) => {
    const sql = `
        SELECT id, customer_name
        FROM customer_details
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.send(result);
    });
});


app.get("/api/pdf/:rmaNo", (req, res) => {

    const rmaNo = req.params.rmaNo;

    const sql = `
    SELECT
        r.id,
        r.rma_no,
        r.product_name,
        r.model_number,
        r.quantity_no,
        
        r.reminder_date,
        DATE_FORMAT(r.entry_date,'%d-%m-%Y') AS entry_date,
        r.created_by,
        l.username AS created_by_name,
        c.customer_name,
        c.phone_no,
        c.email,
        c.address,

        i.serial_no,
        i.accessory,
        i.issues,
        i.status

    FROM rma_entry1 r

    JOIN customer_details c
        ON r.customer_id = c.id

    JOIN rma_items i
        ON r.id = i.rma_id
LEFT JOIN login_user l
    ON r.created_by = l.id
    WHERE r.rma_no = ?
    `;

    db.query(sql, [rmaNo], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        console.log("PDF DATA:", result);

        res.json(result);

    });

});

app.put(
    "/api/service-complete/:id",
    (req, res) => {

        const { id } =
            req.params;

        const sql =
            `UPDATE customer_details
             SET status='completed'
             WHERE id=?`;

        db.query(
            sql,
            [id],
            (err, result) => {

                if (err) {
                    return res
                        .status(500)
                        .json(err);
                }

                res.json({
                    message:
                        "Service Completed"
                });
            }
        );
    }
);




// app.get("/api/reminders", (req, res) => {

//   const sql = `
//   SELECT
//   rr.id AS reminder_id,
//   rr.rma_id,
//   rr.reminder_date,
//   rr.status,
//   c.customer_name,
//   r.customer_dc_no,
//   r.model_number
// FROM rma_reminders rr
// JOIN rma_entry1 r ON rr.rma_id = r.id
// JOIN customer_details c ON r.customer_id = c.id
// WHERE rr.status LIKE '%pending%'
// ORDER BY rr.reminder_date ASC;
// `;

//   db.query(sql, (err, result) => {

//     if (err) {
//       console.log(err);
//       return res.status(500).send(err);
//     }

//     res.json(result);
//   });
// });

// app.get("/api/reminder/:id", (req, res) => {

//   const id = req.params.id;

//   const sql = `
//     SELECT
//       rr.id,
//       rr.rma_id,
//       rr.reminder_date,
//       rr.status,
//       r.product_name,
//       r.customer_dc_no,
//       r.model_number

//     FROM rma_reminders rr

//     JOIN rma_entry1 r
//     ON rr.rma_id = r.id

//     WHERE rr.id = ?
//   `;

//   db.query(sql, [id], (err, result) => {

//     if (err) {
//       console.log(err);
//       return res.status(500).send(err);
//     }

//     if (result.length === 0) {
//       return res
//         .status(404)
//         .json({
//           message:
//             "Reminder not found"
//         });
//     }

//     res.json(result[0]);
//   });
// });

// app.put("/api/reminder/update/:id", (req, res) => {

//   const { status } = req.body;
//   const id = req.params.id;

//   // STEP 1: get current reminder
//   db.query(
//     "SELECT * FROM rma_reminders WHERE id=?",
//     [id],
//     (err, rows) => {

//       if (err) return res.status(500).send(err);
//       if (!rows.length) return res.status(404).send("Not found");

//       const currentReminder = rows[0];

//       // STEP 2: update current reminder status
//       db.query(
//         "UPDATE rma_reminders SET status=? WHERE id=?",
//         [status, id]
//       );

//       // STEP 3: update main table status
//       db.query(
//         "UPDATE rma_entry1 SET status=? WHERE id=?",
//         [status, currentReminder.rma_id]
//       );

//       // STEP 4: IF completed → stop here
//       if (status === "completed") {
//         return res.send("Completed");
//       }

//       // ======================================================
//       // ✅ FIX 3 GOES HERE (GET LATEST REMINDER)
//       // ======================================================
//       db.query(
//         "SELECT * FROM rma_reminders WHERE rma_id=? ORDER BY id DESC LIMIT 1",
//         [currentReminder.rma_id],
//         (err2, rows2) => {

//           if (err2) return res.status(500).send(err2);

//           const last = rows2[0];

//           let nextDate = new Date(last.reminder_date);
//           nextDate.setDate(nextDate.getDate() + 2);

//           const formattedNext =
//             nextDate.toISOString().split("T")[0];

//           // ======================================================
//           // ✅ FIX 4 GOES HERE (INSERT HISTORY + NEXT REMINDER)
//           // ======================================================

//           // 1. INSERT HISTORY (VERY IMPORTANT)
//           db.query(`
//             INSERT INTO rma_history
//             (rma_id, old_status, new_status, old_reminder, new_reminder)
//             VALUES (?,?,?,?,?)
//           `, [
//             currentReminder.rma_id,
//             currentReminder.status,
//             status,
//             currentReminder.reminder_date,
//             formattedNext
//           ]);

//           // 2. INSERT NEXT REMINDER
//           db.query(`
//             INSERT INTO rma_reminders
//             (rma_id, reminder_date, status)
//             VALUES (?,?,?)
//           `, [
//             currentReminder.rma_id,
//             formattedNext,
//             "pending"
//           ]);

//           res.send("Reminder updated with history");
//         }
//       );
//     }
//   );
// });

// app.get("/api/history/:id", (req, res) => {
//   db.query(
//     "SELECT * FROM rma_history WHERE rma_id=? ORDER BY updated_at DESC",
//     [req.params.id],
//     (err, result) => {
//       if (err) return res.status(500).send(err);
//       res.json(result);
//     }
//   );
// });

// app.put("/api/reminder-status/:id", (req, res) => {

//     const id = req.params.id;

//     const sql = `
//     UPDATE rma_reminders
//     SET status='completed'
//     WHERE id=?
//     `;

//     db.query(sql, [id], (err) => {
//         if (err) return res.status(500).json(err);

//         res.json({ message: "Updated" });
//     });
// });
app.get(
    "/api/rma/:id",
    (req, res) => {

        const { id }
            = req.params;

        const sql =
            `
SELECT r.*,
c.customer_name
FROM rma_entry1 r
JOIN customer_details c
ON r.customer_id=c.id
WHERE r.id=?
`;

        db.query(
            sql,
            [id],
            (err, result) => {

                if (err) {
                    return res
                        .status(500)
                        .json(err);
                }

                res.json(result);

            });
    });


// app.put("/api/status/:id", (req, res) => {
//   const { status } = req.body;

//   db.query(
//     "UPDATE rma_entry1 SET status=? WHERE id=?",
//     [status, req.params.id],
//     (err) => {
//       if (err) return res.status(500).send(err);
//       res.send("Status updated");
//     }
//   );
// });

 const cron = require("node-cron");
// // const db = require("./db");

// // runs every day at 12:00 AM
// cron.schedule("0 0 * * *", () => {
//   console.log("Running reminder job...");

//   const today = new Date().toISOString().split("T")[0];

//   // step 1: get all active reminders
//   db.query(
//     `SELECT * FROM rma_entry1 
//      WHERE reminder_date <= ? 
//      AND status != 'completed'`,
//     [today],
//     (err, rows) => {
//       if (err) return console.log(err);

//       rows.forEach((item) => {
//         let newDate = new Date(item.reminder_date);
//         newDate.setDate(newDate.getDate() + 2);

//         // step 2: update reminder_date automatically
//         db.query(
//           `UPDATE rma_entry1 
//            SET reminder_date = ? 
//            WHERE id = ?`,
//           [newDate.toISOString().split("T")[0], item.id]
//         );
//       });
//     }
//   );
// });


//RMA OUT

app.get("/api/get_o", (req, res) => {
    const sql = `SELECT
    MIN(r.id) AS id,
    r.rma_no,
    MAX(c.center_name) AS center_name,

    MIN(i.product_name) AS product_name,
    MIN(i.model_number) AS model_number,

    MAX(r.quantity_no) AS quantity_no,
    MAX(r.entry_date) AS entry_date,
    MAX(r.status) AS status

FROM rma_out r

JOIN services_details c
    ON r.services_id = c.id

JOIN rma_items1 i
    ON r.id = i.rma_id

GROUP BY r.rma_no

ORDER BY r.rma_no ASC`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});

// get single data
app.get("/api/get_o/:id", (req, res) => {
    const { id } = req.params;

    const sql = `
SELECT
services_id,
product_name,
model_number,
quantity_no,
serial_no,
accessory,
customer_dc_no,
issues,
reminder_date
FROM rma_out
WHERE id=?
`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    });
});

app.get("/test", (req, res) => {
    res.send("API Working");
});

app.post("/api/out", (req, res) => {
    console.log("API HIT");

    console.log("BODY:", req.body);

    const {
        services_id,
        product_name,
        model_number,
        quantity_no,
        serial_no,
        accessory,
        customer_dc_no,
        issues,
        reminder_date
    } = req.body;

    const sql = `
    INSERT INTO rma_out
    (
        services_id,
        product_name,
        model_number,
        quantity_no,
        serial_no,
        accessory,
        customer_dc_no,
        issues,
        reminder_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        Number(services_id),
        product_name,
        model_number,
        Number(quantity_no),
        serial_no,
        accessory,
        customer_dc_no,
        issues,
        reminder_date
    ];

    console.log(values); // check values

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log("MYSQL ERROR:", err);
            return res.status(500).json(err);
        }

        console.log(result);

        res.status(200).json({
            message: "RMA Added Successfully"
        });
    });
});
// update data
app.put("/api/update_o/:id", (req, res) => {
    const { id } = req.params;

    const {
        services_id,
        product_name,
        model_number,
        quantity_no,
        serial_no,
        accessory,
        customer_dc_no,
        issues,
        reminder_date,
        status
    } = req.body;

    const formattedDate =
        reminder_date
            ? reminder_date.split("T")[0]
            : null;

    const sql = `
    UPDATE rma_out SET
    services_id=?,
    product_name=?,
    model_number=?,
    quantity_no=?,
    serial_no=?,
    accessory=?,
    customer_dc_no=?,
    issues=?,
    reminder_date=?
    WHERE id=?
    `;

    db.query(
        sql,
        [
            services_id,
            product_name,
            model_number,
            quantity_no,
            serial_no,
            accessory,
            customer_dc_no,
            issues,
            formattedDate,
            id
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.send("Updated Successfully");
        }
    );
});

// Delete Data
app.delete("/api/remove_o/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM rma_out WHERE id=?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send("Deleted Successfully");
    });
});

app.get("/api/services", (req, res) => {
    const sql = `
        SELECT id, servicer_name
        FROM services_details
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.send(result);
    });
});

app.post("/add-rma", (req, res) => {

  const {
    product_name,
    model_number,
    quantity_no,
    customer_dc_no,
    customer_id,
    entry_date,
    items
  } = req.body;

//   const values = [];

//     for (let i = 0; i < quantity; i++) {
//         values.push([customer_id, model_number,quantity_no]);
//     }

  let reminderDate = new Date(entry_date);

  reminderDate.setDate(
    reminderDate.getDate() + 3
  );

  const sql = `
  INSERT INTO rma_entry1
  (
    product_name,
    model_number,
    quantity_no,
    serial_no,
    accessory,
    customer_dc_no,
    issues,
    customer_id,
    entry_date,
    reminder_date,
    status
  )
  VALUES ?
  `;

  const values = items.map(item => [
    product_name,
    model_number,
    quantity_no,
    item.serial_no,
    item.accessory,
    customer_dc_no,
    item.issues,
    customer_id,
    entry_date,
    reminderDate.toISOString().split("T")[0],
    "pending"
  ]);

  db.query(sql, [values], (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.send("Entry Created");
  });

});



app.post("/complete-rma",(req,res)=>{

 const { id } = req.body;

 db.query(
 `
 UPDATE rma_entry1
 SET status='Completed'
 WHERE id=?
 `,
 [id],
 (err)=>{

   if(err){
     return res.send(err);
   }

   res.send("Completed");

 });

});

cron.schedule("* * * * *", () => {

    console.log("Cron Running");

    const sql = `
        SELECT *
        FROM rma_entry1
        WHERE reminder_date <= CURDATE()
        AND status <> 'Completed'
    `;

    db.query(sql, (err, rows) => {

        if (err) {
            console.log(err);
            return;
        }

        console.log("Rows Found:", rows.length);

        rows.forEach((row) => {

            // Insert reminder history
            db.query(
                `
                INSERT INTO reminder_notifications
                (
                    rma_id,
                    reminder_date
                )
                VALUES (?,?)
                `,
                [
                    row.id,
                    row.reminder_date
                ],
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );

            // Update next reminder date (+2 days)
            db.query(
                `
                UPDATE rma_entry1
                SET reminder_date =
                DATE_ADD(reminder_date, INTERVAL 2 DAY)
                WHERE id=?
                `,
                [row.id],
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );

        });

    });

});


app.get("/reminders",(req,res)=>{

  const sql = `
  SELECT
    rn.reminder_id,
    rn.rma_id,
    rn.reminder_date,
    c.customer_name
  FROM reminder_notifications rn
  JOIN rma_entry1 r
    ON rn.rma_id = r.id
  JOIN customer_details c
    ON r.customer_id = c.id
  WHERE rn.reminder_status='Pending'
  AND r.status <> 'Completed'
  ORDER BY rn.reminder_date ASC
  `;

  db.query(sql,(err,result)=>{

    if(err){
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

app.get("/reminder/:id", (req, res) => {

  db.query(
    `
    SELECT
      rn.reminder_id,
      rn.rma_id,
      rn.reminder_date,
      c.customer_name
    FROM reminder_notifications rn
    JOIN rma_entry1 r
      ON rn.rma_id = r.id
    JOIN customer_details c
      ON r.customer_id = c.id
    WHERE rn.reminder_id = ?
    `,
    [req.params.id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result[0]);

    }
  );

});

app.post("/update-status", (req, res) => {

  const {
    reminder_id,
    rma_id,
    status_text,
    completed
  } = req.body;

  db.query(
    `
    INSERT INTO status_history
    (rma_id, status_text)
    VALUES (?,?)
    `,
    [rma_id, status_text]
  );

  if (completed) {

    // Entire RMA close
    db.query(
      `
      UPDATE rma_entry1
      SET status='Completed'
      WHERE id=?
      `,
      [rma_id]
    );

    db.query(
      `
      UPDATE reminder_notifications
      SET reminder_status='Completed'
      WHERE rma_id=?
      `,
      [rma_id]
    );

  } else {

    // Save current status
    db.query(
      `
      UPDATE rma_entry1
      SET status=?
      WHERE id=?
      `,
      [status_text, rma_id]
    );

    // Close ONLY current reminder
    db.query(
      `
      UPDATE reminder_notifications
      SET reminder_status='Completed'
      WHERE reminder_id=?
      `,
      [reminder_id]
    );

  }

  res.send("Updated");

});

app.get("/history",(req,res)=>{

  db.query(
    `
    SELECT
      sh.history_id,
      sh.rma_id,
      c.customer_name,
      sh.status_text,
      sh.updated_date
    FROM status_history sh
    JOIN rma_entry1 r
      ON sh.rma_id = r.id
    JOIN customer_details c
      ON r.customer_id = c.id
    ORDER BY sh.updated_date DESC
    `,
    (err,result)=>{

      if(err){
        return res.send(err);
      }

      res.send(result);

    }
  );

});

app.get("/rma-list", (req, res) => {

  db.query(
    `
    SELECT
      r.id,
      c.customer_name,
      c.phone,
      r.entry_date,
      r.reminder_date,
      r.status
    FROM rma_entry1 r
    JOIN customer_details c
      ON r.customer_id = c.id
    ORDER BY r.id ASC
    `,
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

});

app.get("/history/:rma_id", (req, res) => {

  const rma_id = req.params.rma_id;

  const sql = `
    SELECT
      sh.history_id,
      sh.rma_id,
      c.customer_name,
      sh.status_text,
      sh.updated_date
    FROM status_history sh
    JOIN rma_entry1 r
      ON sh.rma_id = r.id
    JOIN customer_details c
      ON r.customer_id = c.id
    WHERE sh.rma_id = ?
    ORDER BY sh.updated_date DESC
  `;

  db.query(sql, [rma_id], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

app.get("/get-customers", (req, res) => {

    const sql = "SELECT id, customer_name FROM customer_details";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });

});

//RMA OUT reminder


app.post("/api/entry_out", (req, res) => {

    const {
        services_id,
        entry_date,
        items,
        created_by
    } = req.body;

    console.log("services_id:", services_id);
    console.log("entry_date:", entry_date);
    console.log("items:", items);
if (!items || items.length === 0) {
    return res.status(400).json({
        message: "No serial numbers added"
    });
}
    const serials = items.map(item => item.serial_no);
    const uniqueSerials = [...new Set(serials)];

if (serials.length !== uniqueSerials.length) {
    return res.status(400).json({
        message: "Duplicate serial numbers in current entry"
    });
}

const checkSql = `
    SELECT serial_no
    FROM rma_items1
    WHERE serial_no IN (?)
    AND status <> 'Completed'
`;

db.query(checkSql, [serials], (err, rows) => {

    if (err) {
        console.log("CHECK SERIAL ERROR:", err);
        return res.status(500).json(err);
    }

    if (rows.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Serial No already exists: ${
                rows.map(r => r.serial_no).join(", ")
            }`
        });
    }

    // ONLY IF NO DUPLICATES
    saveRma();

});
function saveRma() {

    
    const getRmaNo =
        "SELECT IFNULL(MAX(rma_no),1000)+1 AS rmaNo FROM rma_out";

    db.query(getRmaNo, (err, result) => {
       if (err) {
    console.log("GET RMA ERROR:", err);
    return res.status(500).json(err);
}

        const rmaNo = result[0].rmaNo;

        const reminderDate = new Date(entry_date);
        reminderDate.setDate(reminderDate.getDate() + 3);

        // 1. Insert into rma_out (MASTER)
        const sql = `
            INSERT INTO rma_out
            (rma_no, services_id,quantity_no,reminder_date, entry_date,status,created_by)
            VALUES (?,?,?,?,?,?,?)
        `;

        db.query(sql, [
            rmaNo,
            services_id,
            
            items.length,
            
            reminderDate,
            entry_date,
            "pending",
            created_by
        ], (err, result) => {

            if (err){ 
                console.log("RMA_OUT INSERT ERROR:", err);
                return res.status(500).json(err);
            }
            const rmaId = result.insertId;
            
            // 2. Insert multiple serials (CHILD TABLE)
            const insertItems = items.map(item => {
                return new Promise((resolve, reject) => {
                    db.query(
                        `INSERT INTO rma_items1 
                        (rma_id, serial_no, accessory, issues, product_name,model_number,status)
                        VALUES (?,?,?,?,?,?,?)`,
                        [
                            rmaId,
                            item.serial_no,
                           
                            item.accessory,
                            item.issues,
                            item. product_name,
                            item.model_number,
                            
                            "pending"
                        ],
                        (err, result) => {
                            if (err) return reject(err);
                            resolve(result);
                        }
                    );
                });
            });

            Promise.all(insertItems)
                .then(() => {
                    res.json({
                        success: true,
                        rma_no: rmaNo
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });

        });
    });
}
});      // INSERT INTO REMINDER TABLE
    //   db.query(
    //     `
    //     INSERT INTO rma_reminders
    //     (
    //       rma_id,
    //       reminder_date,
    //       status
    //     )
    //     VALUES (?,?,?)
    //     `,
    //     [
    //       result.insertId,
    //       formattedReminder,
    //       "pending"
    //     ],
    //     (err2) => {

        //   if (err2) {
        //     console.log(err2);

        //     return res
        //       .status(500)
        //       .send(err2);
        //   }

//           res.send(
//             "Entry Created"
//           );
//         }
//       );
//     }
//   );




// app.post("/api/add-rma", (req, res) => {

//   const { product_name,
//     model_number,
//     quantity_no,
//     serial_no,
//     accessory,
//     customer_dc_no,
//     issues,
//     customer_id,
//     entry_date } = req.body;

//   const reminderDate = new Date(entry_date);

//   reminderDate.setDate(reminderDate.getDate() + 3);

//   const sql = `
//   INSERT INTO rma_entry1
//   (product_name,
//       model_number,
//       quantity_no,
//       serial_no,
//       accessory,
//       customer_dc_no,
//       issues,
//       reminder_date,
//       customer_id,
    
//       entry_date)
//   VALUES (?,?,?,?,?,?,?,?,?)
//   `;

//   db.query(
//     sql,
//     [
//        product_name,
//       model_number,
//       quantity_no,
//       serial_no,
//       accessory,
//       customer_dc_no,
//       issues,
    
//       customer_id,
//       entry_date,
//       reminderDate.toISOString().split("T")[0]
//     ],
//     (err, result) => {

//       if(err){
//         return res.send(err);
//       }

//       res.send("Saved");
//     }
//   );

// });

app.post("/complete-rma_l",(req,res)=>{

 const { id } = req.body;

 db.query(
 `
 UPDATE rma_out
 SET status='Completed'
 WHERE id=?
 `,
 [id],
 (err)=>{

   if(err){
     return res.send(err);
   }

   res.send("Completed");

 });

});

cron.schedule("* * * * *", () => {

    console.log("Cron Running");

    const sql = `
        SELECT *
        FROM rma_out
        WHERE reminder_date <= CURDATE()
        AND status <> 'Completed'
    `;

    db.query(sql, (err, rows) => {

        if (err) {
            console.log(err);
            return;
        }

        console.log("Rows Found:", rows.length);

        rows.forEach((row) => {

            // Insert reminder history
            db.query(
                `
                INSERT INTO reminder_notifications_l
                (
                    rma_id,
                    reminder_date
                )
                VALUES (?,?)
                `,
                [
                    row.id,
                    row.reminder_date
                ],
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );

            // Update next reminder date (+2 days)
            db.query(
                `
                UPDATE rma_out
                SET reminder_date =
                DATE_ADD(reminder_date, INTERVAL 2 DAY)
                WHERE id=?
                `,
                [row.id],
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                }
            );

        });

    });

});


app.get("/reminders_l",(req,res)=>{

  const sql = `
  SELECT
    rn.reminder_id,
    rn.rma_id,
    rn.reminder_date,
    c.center_name
  FROM reminder_notifications_l rn
  JOIN rma_out r
    ON rn.rma_id = r.id
  JOIN services_details c
    ON r.services_id = c.id
  WHERE rn.reminder_status='Pending'
  AND r.status <> 'Completed'
  ORDER BY rn.reminder_date ASC
  `;

  db.query(sql,(err,result)=>{

    if(err){
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

app.get("/reminder_l/:id", (req, res) => {

  db.query(
    `
    SELECT
      rn.reminder_id,
      rn.rma_id,
      rn.reminder_date,
      c.center_name
    FROM reminder_notifications_l rn
    JOIN rma_out r
      ON rn.rma_id = r.id
    JOIN services_details c
      ON r.services_id = c.id
    WHERE rn.reminder_id = ?
    `,
    [req.params.id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result[0]);

    }
  );

});

app.post("/update-status_l", (req, res) => {

  const {
    reminder_id,
    rma_id,
    status_text,
    completed
  } = req.body;

  db.query(
    `
    INSERT INTO status_history_l
    (rma_id, status_text)
    VALUES (?,?)
    `,
    [rma_id, status_text]
  );

  if (completed) {

    // Entire RMA close
    db.query(
      `
      UPDATE rma_out
      SET status='Completed'
      WHERE id=?
      `,
      [rma_id]
    );

    db.query(
      `
      UPDATE reminder_notifications_l
      SET reminder_status='Completed'
      WHERE rma_id=?
      `,
      [rma_id]
    );

  } else {

    // Save current status
    db.query(
      `
      UPDATE rma_out
      SET status=?
      WHERE id=?
      `,
      [status_text, rma_id]
    );

    // Close ONLY current reminder
    db.query(
      `
      UPDATE reminder_notifications_l
      SET reminder_status='Completed'
      WHERE reminder_id=?
      `,
      [reminder_id]
    );

  }

  res.send("Updated");

});

app.get("/history_l",(req,res)=>{

  db.query(
    `
    SELECT
      sh.history_id,
      sh.rma_id,
      c.center_name,
      sh.status_text,
      sh.updated_date
    FROM status_history_l sh
    JOIN rma_out r
      ON sh.rma_id = r.id
    JOIN services_details c
      ON r.services_id = c.id
    ORDER BY sh.updated_date DESC
    `,
    (err,result)=>{

      if(err){
        return res.send(err);
      }

      res.send(result);

    }
  );

});

app.get("/rma_out-list", (req, res) => {

  db.query(
    `
    SELECT
      r.id,
      c.center_name,
      
      r.entry_date,
      r.reminder_date,
      r.status
    FROM rma_out r
    JOIN services_details c
      ON r.services_id = c.id
    ORDER BY r.id ASC
    `,
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

});

app.get("/history_l/:rma_id", (req, res) => {

  const rma_id = req.params.rma_id;

  const sql = `
    SELECT
      sh.history_id,
      sh.rma_id,
      c.center_name,
      sh.status_text,
      sh.updated_date
    FROM status_history_l sh
    JOIN rma_out r
      ON sh.rma_id = r.id
    JOIN services_details c
      ON r.services_id = c.id
    WHERE sh.rma_id = ?
    ORDER BY sh.updated_date DESC
  `;

  db.query(sql, [rma_id], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

app.get("/get-services", (req, res) => {

    const sql = "SELECT id, center_name FROM services_details";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });

});

app.get("/api/pdf1/:rmaNo", (req, res) => {

    const rmaNo = req.params.rmaNo;
    

    const sql = `
    SELECT
        r.id,
        r.rma_no,
        i.product_name,
        i.model_number,
        r.quantity_no,
        
        r.reminder_date,
        DATE_FORMAT(r.entry_date,'%d-%m-%Y') AS entry_date,
        r.created_by,
        l.username AS created_by_name,
        c.center_name,
        c.phone_no,
        c.email,
        c.address,

        i.serial_no,
        i.accessory,
        i.issues,
        i.status

    FROM rma_out r

    JOIN services_details c
        ON r.services_id = c.id

    JOIN rma_items1 i
        ON r.id = i.rma_id
        LEFT JOIN login_user l
    ON r.created_by = l.id

    WHERE r.rma_no = ?
    `;
    

    db.query(sql, [rmaNo], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        console.log("PDF DATA:", result);
         console.log("FIRST ROW:", result[0]);

        res.json(result);

    });

});


// app.get("/search-model/:model_number", (req, res) => {

//     const model_number = req.params.model_number;

//     const sql = `
//         SELECT
//             id,
//             product_name,
//             model_number,
//             quantity_no,
//             serial_no,
//             accessory,
//             issues,
//             entry_date
//         FROM rma_entry1
//         WHERE model_number LIKE ?
//     `;

//     db.query(
//         sql,
//         [`%${model_number}%`],
//         (err, result) => {

//             if (err) {
//                 console.log(err);
//                 return res.status(500).json(err);
//             }

//             res.json(result);
//         }
//     );

// });

app.get("/rma-summary", (req, res) => {

  const sql = `
    SELECT
      c.id AS customer_id,
      c.customer_name,
      r.product_name,
      r.model_number,
      COUNT(*) AS quantity
    FROM rma_entry1 r
    JOIN customer_details c
      ON r.customer_id = c.id
    GROUP BY
      c.id,
      c.customer_name,
      r.product_name,
      r.model_number
    ORDER BY c.customer_name
  `;

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

app.get("/rma-details/:rma_no", (req, res) => {

const { rma_no } = req.params;
    
  const sql = `
   SELECT
    r.id,
    r.rma_no,
    c.center_name,
    i.product_name,
    i.model_number,
    r.quantity_no,
    
    r.entry_date,

    i.id AS item_id,
    i.serial_no,
    i.accessory,
    i.issues,
    i.status

FROM rma_out r

LEFT JOIN services_details c
    ON r.services_id = c.id

LEFT JOIN rma_items1 i
    ON r.id = i.rma_id

WHERE r.rma_no = ?

ORDER BY r.id`;

  db.query(sql, [rma_no], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

// app.get("/rma-details/:customer_id/:model_number", (req, res) => {

//   const { customer_id, model_number } = req.params;

//   const sql = `
//     SELECT
//       r.id AS id,
//       c.id AS customer_id,
//       c.customer_name,
//       r.product_name,
//       r.model_number,
//       r.serial_no,
//       r.accessory,
//       r.issues,
//       r.customer_dc_no,
//       r.entry_date,
//       r.status
//     FROM rma_entry1 r
//     JOIN customer_details c
//       ON r.customer_id = c.id
//     WHERE
//       r.customer_id = ?
//       AND r.model_number = ?
//     ORDER BY r.id
//   `;

//   db.query(
//     sql,
//     [customer_id, model_number],
//     (err, result) => {

//       if (err) {
//         return res.status(500).json(err);
//       }

//       res.json(result);
//     }
//   );

// });
app.put("/update-rma/:rma_no", (req, res) => {

    const rows = req.body;

    rows.forEach((item) => {

        // Update rma_out
        const sql1 = `
            UPDATE rma_out
            SET
                product_name = ?,
                model_number = ?,
                quantity_no = ?,
                customer_dc_no = ?
            WHERE id = ?
        `;

        db.query(sql1, [
            item.product_name,
            item.model_number,
            item.quantity_no,
            item.customer_dc_no,
            item.id
        ]);

        // Update rma_items1
        const sql2 = `
            UPDATE rma_items1
            SET
                serial_no = ?,
                accessory = ?,
                issues = ?
            WHERE id = ?
        `;

        db.query(sql2, [
            item.serial_no,
            item.accessory,
            item.issues,
            item.item_id
        ]);
         (err, result) => {
    console.log(err);
    console.log(result);
}

    });

    res.json({
        message: "RMA Updated Successfully"
    });

});

app.put("/update-rma_in/:rma_no", (req, res) => {

    const rows = req.body;

    rows.forEach((item) => {

        // Update rma_out
        const sql1 = `
            UPDATE rma_entry1
            SET
                product_name = ?,
                model_number = ?,
                quantity_no = ?,
                customer_dc_no = ?
            WHERE id = ?
        `;

        db.query(sql1, [
            item.product_name,
            item.model_number,
            item.quantity_no,
            item.customer_dc_no,
            item.id
        ]);

        // Update rma_items1
        const sql2 = `
            UPDATE rma_items
            SET
                serial_no = ?,
                accessory = ?,
                issues = ?
            WHERE id = ?
        `;

        db.query(sql2, [
            item.serial_no,
            item.accessory,
            item.issues,
            item.item_id
        ]);
         (err, result) => {
    console.log(err);
    console.log(result);
}

    });

    res.json({
        message: "RMA Updated Successfully"
    });

});

app.put("/update-rma-status/:rma_no", (req, res) => {

    const { status } = req.body;
    const { rma_no } = req.params;

    const sql = `
        UPDATE rma_items1 i
        JOIN rma_out r
            ON i.rma_id = r.id
        SET i.status = ?
        WHERE r.rma_no = ?
    `;

    db.query(
        sql,
        [status, rma_no],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "All Status Updated",
                affectedRows: result.affectedRows
            });

        }
    );

});

app.delete("/delete-rma/:rma_no", (req, res) => {
    // console.log("DELETE CALLED", req.params.rma_no);
    // res.json({ success: true });
       const { rma_no } = req.params;
        console.log("RMA NO:", rma_no);
    const getItemIdsSql = `
        SELECT i.id
        FROM rma_items1 i
        JOIN rma_out r
            ON i.rma_id = r.id
        WHERE r.rma_no = ?
    `;

    db.query(getItemIdsSql, [rma_no], (err, items) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        const itemIds = items.map(item => item.id);

        if (itemIds.length === 0) {
            return res.status(404).json({
                message: "RMA not found"
            });
        }

        db.query(
            "DELETE FROM rma_status_history WHERE rma_item_id IN (?)",
            [itemIds],
            (err) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }

                db.query(
                    "DELETE FROM rma_reminders1 WHERE rma_item_id IN (?)",
                    [itemIds],
                    (err) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }

                        db.query(
                            `DELETE i
                             FROM rma_items1 i
                             JOIN rma_out r
                                ON i.rma_id = r.id
                             WHERE r.rma_no = ?`,
                            [rma_no],
                            (err) => {

                                if (err) {
                                    console.log(err);
                                    return res.status(500).json(err);
                                }

                                db.query(
                                    "DELETE FROM rma_out WHERE rma_no = ?",
                                    [rma_no],
                                    (err, result) => {

                                        if (err) {
                                            console.log(err);
                                            return res.status(500).json(err);
                                        }

                                        res.json({
                                            message: "RMA Deleted Successfully",
                                            affectedRows: result.affectedRows
                                        });
                                    });
                            });
                    });
            });
    });
});
// function generateReminders(rma_item_id, cycles = 20) {

//     const values = [];
//     let day = 0;

//     for (let i = 1; i <= cycles; i++) {

//         if (i === 1) day = 3;
//         else if (i % 4 === 2) day += 2;
//         else if (i % 4 === 3) day += 2;
//         else if (i % 4 === 0) day += 3;
//         else day += 3;

//         values.push([rma_item_id, day]);
//     }

//     const sql = `
//         INSERT INTO rma_reminders1
//         (rma_item_id, reminder_day)
//         VALUES ?
//     `;

//     db.query(sql, [values], (err) => {
//         if (err) console.log(err);
//     });
// }

app.get("/reminders_ls", (req, res) => {

    const sql = `
    SELECT
        r.rma_no,
        r.entry_date,

        i.id AS item_id,
        i.serial_no,
        i.status,

        rm.id AS reminder_id,
        rm.reminder_day

    FROM rma_out r

    JOIN rma_items1 i
        ON r.id = i.rma_id

    JOIN rma_reminders1 rm
        ON rm.rma_item_id = i.id

    WHERE
        LOWER(i.status) <> 'completed'
        AND rm.is_read = 0

        AND rm.reminder_day = (
            SELECT MAX(rm2.reminder_day)
            FROM rma_reminders1 rm2
            WHERE rm2.rma_item_id = i.id
            AND DATEDIFF(CURDATE(), r.entry_date)
                >= rm2.reminder_day
        )

    ORDER BY r.rma_no ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });

});
app.post("/update-status_ls/:item_id", (req, res) => {

    const item_id = req.params.item_id;
console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);
    const {
        status,
        status_text,
        reminder_id,
        updated_by
    } = req.body;

    console.log("item_id:", item_id);
    console.log("reminder_id:", reminder_id);
    console.log("body:", req.body);
//check before the status already completed or not
const checkStatusSql = `
    SELECT status
    FROM rma_items1
    WHERE id = ?
`;

db.query(checkStatusSql, [item_id], (err, rows) => {

    if (err) {
        return res.status(500).json(err);
    }

    if (rows.length === 0) {
        return res.status(404).json({
            message: "Item not found"
        });
    }

    if (
        rows[0].status &&
        rows[0].status.toLowerCase() === "completed"
    ) {
        return res.status(400).json({
            message: "Status already completed. Cannot update again."
        });
    }
    // 1. update item
    const updateSql = `
        UPDATE rma_items1
        SET status = COALESCE(NULLIF(?, ''), status)
        WHERE id = ?
    `;
    if (!status || status.trim() === "") {
    return res.status(400).json({
        message: "Please select a status"
    });
}

    db.query(updateSql, [status, item_id], (err) => {
        if (err) return res.status(500).json(err);
        // Check whether all serials under this RMA are completed
            const checkSql = `
        SELECT rma_id
        FROM rma_items1
        WHERE id = ?
    `;

    db.query(checkSql, [item_id], (err, rows) => {

        if (err) return res.status(500).json(err);

        const rmaId = rows[0].rma_id;

        const pendingSql = `
            SELECT COUNT(*) AS pendingCount
            FROM rma_items1
            WHERE rma_id = ?
            AND status <> 'Completed'
        `;

        db.query(pendingSql, [rmaId], (err, result) => {

            if (err) return res.status(500).json(err);

            if (result[0].pendingCount === 0) {

                const completeSql = `
                    UPDATE rma_out
                    SET status = 'Completed'
                    WHERE id = ?
                `;

                db.query(completeSql, [rmaId]);
            }

            // res.json({
            //     success: true
            // });

        });

    });




        // 2. history
        const historySql = `
            INSERT INTO rma_status_history
            (rma_item_id, status, status_text,updated_by)
            VALUES (?,?,?,?)
        `;

        db.query(historySql, [item_id, status, status_text,updated_by]);

        // 3. STOP ONLY THIS SERIAL IF COMPLETE
        // Mark ONLY the clicked reminder as handled
const reminderSql = `
    UPDATE rma_reminders1
    SET is_read = 1
    WHERE id = ?
`;

db.query(reminderSql, [reminder_id]);

// If status = complete, stop all reminders for this serial number
if (status.toLowerCase() === "completed") {

    const clearSql = `
        UPDATE rma_reminders1
        SET is_read = 1
        WHERE rma_item_id = ?
    `;

    db.query(clearSql, [item_id]);
}
        

        res.json({ success: true });
    });
});
});

app.post("/reminder-click/:id", (req, res) => {

    const reminder_id = req.params.id;

    const sql = `
        UPDATE rma_reminders1
        SET is_read = 1
        WHERE id = ?
    `;

    db.query(sql, [reminder_id], (err) => {

        if (err) return res.status(500).json(err);

        res.json({ success: true });
    });
});

app.get(
    "/status-history_ls/:item_id",
    (req, res) => {

         const { item_id } = req.params;

        const sql = `
       SELECT
    h.status,
    h.status_text,
    h.updated_at,
    h.updated_by,
    e.created_by,
    l.username AS created_by_name
FROM rma_status_history h

JOIN rma_items1 i
    ON h.rma_item_id = i.id

JOIN rma_out e
    ON i.rma_id = e.id

LEFT JOIN login_user l
    ON e.created_by = l.id

WHERE h.rma_item_id = ?

ORDER BY h.updated_at ASC`;

        db.query(
            sql,
            [item_id],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(result);

            }
        );

    }
);


//RMA Entry

app.post("/api/entry_in", (req, res) => {
     
    const {
        customer_id,
        customer_dc_no,
        entry_date,
        products,
        created_by
    } = req.body;

    const getRmaNo =
        "SELECT IFNULL(MAX(rma_no),1000)+1 AS rmaNo FROM rma_entry1";

    db.query(getRmaNo, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        const rmaNo = result[0].rmaNo;
//         const getDcNo =
//     "SELECT IFNULL(MAX(customer_dc_no),5000)+1 AS dcNo FROM rma_entry1";

// db.query(getDcNo, (err, dcResult) => {

//     if (err) {
//         return res.status(500).json(err);
//     }

//     const dcNo = dcResult[0].dcNo;


        products.forEach(product => {

            const reminderDate = new Date(entry_date);

            reminderDate.setDate(
                reminderDate.getDate() + 3
            );

            const productSql = `
            INSERT INTO rma_entry1
            (
                rma_no,
                customer_id,
                product_name,
                model_number,
                quantity_no,
                customer_dc_no,
                reminder_date,
                entry_date,
                created_by
            )
            VALUES (?,?,?,?,?,?,?,?,?)
            `;

            db.query(
                productSql,
                [
                    rmaNo,
                    customer_id,
                    product.product_name,
                    product.model_number,
                    product.quantity_no,
                    customer_dc_no,
                    reminderDate,
                    entry_date,
                    created_by
                ],
                (err, productResult) => {

                    if (err) {
                        console.log(err);
                        return;
                    }

                    const productId =
                        productResult.insertId;

                        console.log("Product ID:", productId);
        console.log("Product:", product);
        console.log("Items:", product.items);
        console.log("Items Count:", product.items.length);


                    product.items.forEach(item => {

                        const itemSql = `
                        INSERT INTO rma_items
                        (
                            rma_id,
                            serial_no,
                            accessory,
                            issues,
                            status
                            
                            
                    )
                        VALUES (?,?,?,?,?)
                        `;

                        db.query(
                            itemSql,
                            [
                                productId,
                                item.serial_no,
                                item.accessory,
                                item.issues,
                                "pending"
                            ],

                            (err,result) => {
        if (err) {
            console.log("Item Insert Error:", err);
        }
        else {
            console.log("Item Saved");

            const item_id = result.insertId;

        generateReminders_l(item_id);
        }
    }
   

    // MUST BE HERE
   
                        );

                    });
                    

                }
            );
        

        });
    

        res.json({
            success: true,
            rma_no: rmaNo
            
        });

    });

});



app.put("/update-rma_r/:rma_no", (req, res) => {

    const rows = req.body;

    rows.forEach((item) => {

        // Update rma_out
        const sql1 = `
            UPDATE rma_entry1
            SET
                product_name = ?,
                model_number = ?,
                quantity_no = ?,
                customer_dc_no = ?
            WHERE id = ?
        `;

        db.query(sql1, [
            item.product_name,
            item.model_number,
            item.quantity_no,
            item.customer_dc_no,
            item.id
        ]);

        // Update rma_items1
        const sql2 = `
            UPDATE rma_items
            SET
                serial_no = ?,
                accessory = ?,
                issues = ?
            WHERE id = ?
        `;

        db.query(sql2, [
            item.serial_no,
            item.accessory,
            item.issues,
            item.item_id
        ]);
         (err, result) => {
    console.log(err);
    console.log(result);
}

    });

    res.json({
        message: "RMA Updated Successfully"
    });

});

app.put("/update-rma-status_r/:rma_no", (req, res) => {

    const { status } = req.body;
    const { rma_no } = req.params;

    const sql = `
        UPDATE rma_items i
        JOIN rma_entry1 r
            ON i.rma_id = r.id
        SET i.status = ?
        WHERE r.rma_no = ?
    `;

    db.query(
        sql,
        [status, rma_no],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "All Status Updated",
                affectedRows: result.affectedRows
            });

        }
    );

});

app.delete("/delete-rma_r/:rma_no", (req, res) => {
    // console.log("DELETE CALLED", req.params.rma_no);
    // res.json({ success: true });
       const { rma_no } = req.params;
        console.log("RMA NO:", rma_no);
    const getItemIdsSql = `
        SELECT i.id
        FROM rma_items i
        JOIN rma_entry1 r
            ON i.rma_id = r.id
        WHERE r.rma_no = ?
    `;

    db.query(getItemIdsSql, [rma_no], (err, items) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        const itemIds = items.map(item => item.id);

        if (itemIds.length === 0) {
            return res.status(404).json({
                message: "RMA not found"
            });
        }

        db.query(
            "DELETE FROM rma_status_history1 WHERE rma_item_id IN (?)",
            [itemIds],
            (err) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }

                db.query(
                    "DELETE FROM rma_reminders WHERE rma_item_id IN (?)",
                    [itemIds],
                    (err) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }

                        db.query(
                            `DELETE i
                             FROM rma_items i
                             JOIN rma_entry1 r
                                ON i.rma_id = r.id
                             WHERE r.rma_no = ?`,
                            [rma_no],
                            (err) => {

                                if (err) {
                                    console.log(err);
                                    return res.status(500).json(err);
                                }

                                db.query(
                                    "DELETE FROM rma_entry1 WHERE rma_no = ?",
                                    [rma_no],
                                    (err, result) => {

                                        if (err) {
                                            console.log(err);
                                            return res.status(500).json(err);
                                        }

                                        res.json({
                                            message: "RMA Deleted Successfully",
                                            affectedRows: result.affectedRows
                                        });
                                    });
                            });
                    });
            });
    });
});

// function generateReminders(rma_item_id, cycles = 20) {

//     const values = [];
//     let day = 0;

//     for (let i = 1; i <= cycles; i++) {

//         if (i === 1) day = 3;
//         else if (i % 4 === 2) day += 2;
//         else if (i % 4 === 3) day += 2;
//         else if (i % 4 === 0) day += 3;
//         else day += 3;

//         values.push([rma_item_id, day]);
//     }

//     const sql = `
//         INSERT INTO rma_reminders1
//         (rma_item_id, reminder_day)
//         VALUES ?
//     `;

//     db.query(sql, [values], (err) => {
//         if (err) console.log(err);
//     });
// }

app.get("/reminders_lsr", (req, res) => {

    const sql = `
    SELECT
        r.rma_no,
        r.entry_date,

        i.id AS item_id,
        i.serial_no,
        i.status,

        rm.id AS reminder_id,
        rm.reminder_day

    FROM rma_entry1 r

    JOIN rma_items i
        ON r.id = i.rma_id

    JOIN rma_reminders rm
        ON rm.rma_item_id = i.id

    WHERE
        LOWER(i.status) <> 'completed'
        AND rm.is_read = 0

        AND rm.reminder_day = (
            SELECT MAX(rm2.reminder_day)
            FROM rma_reminders rm2
            WHERE rm2.rma_item_id = i.id
            AND DATEDIFF(CURDATE(), r.entry_date)
                >= rm2.reminder_day
        )

    ORDER BY r.rma_no ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });

});

function continueUpdate(
    db,
    item_id,
    status,
    status_text,
    updated_by,
    reminder_id,
    res
) {

    const updateSql = `
        UPDATE rma_items
        SET status = COALESCE(NULLIF(?, ''), status)
        WHERE id = ?
    `;

    db.query(updateSql, [status, item_id], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        // Save history
        const historySql = `
            INSERT INTO rma_status_history1
            (rma_item_id, status, status_text, updated_by)
            VALUES (?,?,?,?)
        `;

        db.query(
            historySql,
            [item_id, status, status_text, updated_by]
        );

        // Mark clicked reminder read
        if (reminder_id) {

            db.query(
                `UPDATE rma_reminders
                 SET is_read = 1
                 WHERE id = ?`,
                [reminder_id]
            );

        }

        // If completed, stop all reminders
        if (status.toLowerCase() === "completed") {

            db.query(
                `UPDATE rma_reminders
                 SET is_read = 1
                 WHERE rma_item_id = ?`,
                [item_id]
            );

        }

        // Check whether all serials under same RMA completed
        const checkSql = `
            SELECT rma_id
            FROM rma_items
            WHERE id = ?
        `;

        db.query(checkSql, [item_id], (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            const rmaId = rows[0].rma_id;

            const pendingSql = `
                SELECT COUNT(*) AS pendingCount
                FROM rma_items
                WHERE rma_id = ?
                AND LOWER(status) <> 'completed'
            `;

            db.query(pendingSql, [rmaId], (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (result[0].pendingCount === 0) {

                    db.query(
                        `UPDATE rma_entry1
                         SET status = 'Completed'
                         WHERE id = ?`,
                        [rmaId]
                    );

                }

                return res.json({
                    success: true
                });

            });

        });

    });

}

app.post("/update-status_lsr/:item_id", (req, res) => {

    const item_id = req.params.item_id;
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);

    const {
        status,
        status_text,
        reminder_id,
        updated_by
    } = req.body;

    console.log("item_id:", item_id);
    console.log("reminder_id:", reminder_id);
    console.log("body:", req.body);
    
    //check before the status already completed or not
const checkStatusSql = `
    SELECT status
    FROM rma_items
    WHERE id = ?
`;

db.query(checkStatusSql, [item_id], (err, rows) => {

    if (err) {
        return res.status(500).json(err);
    }

    if (rows.length === 0) {
        return res.status(404).json({
            message: "Item not found"
        });
    }

    if (
        rows[0].status &&
        rows[0].status.toLowerCase() === "completed"
    ) {
        return res.status(400).json({
            message: "Status already completed. Cannot update again."
        });
    }
if (!status || status.trim() === "") {
    return res.status(400).json({
        message: "Please select a status"
    });
}
   if (status.toLowerCase() === "completed") {

    const serialSql = `
        SELECT serial_no
        FROM rma_items
        WHERE id = ?
    `;

    db.query(serialSql, [item_id], (err, serialRows) => {

        if (err) {
            return res.status(500).json(err);
        }

        const serialNo = serialRows[0].serial_no;

        const outwardSql = `
            SELECT status
            FROM rma_items1
            WHERE serial_no = ?
        `;

        db.query(outwardSql, [serialNo], (err, outwardRows) => {

            if (err) {
                return res.status(500).json(err);
            }

            // Serial exists in rma_items1
            if (outwardRows.length > 0) {

                if (
                    outwardRows[0].status.toLowerCase() !==
                    "completed"
                ) {
                    return res.status(400).json({
                        message:
                            "Complete this serial in OUTWARD first."
                    });
                }

            }

            continueUpdate(
                db,
                item_id,
                status,
                status_text,
                updated_by,
                reminder_id,
                res
            );

        });

    });

} else {

    continueUpdate(
        db,
        item_id,
        status,
        status_text,
        updated_by,
        reminder_id,
        res
    );

}     

       
    });
});


app.post("/reminder-click_r/:id", (req, res) => {

    const reminder_id = req.params.id;

    const sql = `
        UPDATE rma_reminders
        SET is_read = 1
        WHERE id = ?
    `;

    db.query(sql, [reminder_id], (err) => {

        if (err) return res.status(500).json(err);

        res.json({ success: true });
    });
});

app.get(
    "/status-history_lsr/:item_id",
    (req, res) => {

        const { item_id } = req.params;

        const sql = `
       SELECT
    h.status,
    h.status_text,
    h.updated_at,
    h.updated_by,
    e.created_by,
    l.username AS created_by_name
FROM rma_status_history1 h

JOIN rma_items i
    ON h.rma_item_id = i.id

JOIN rma_entry1 e
    ON i.rma_id = e.id

LEFT JOIN login_user l
    ON e.created_by = l.id

WHERE h.rma_item_id = ?

ORDER BY h.updated_at ASC`;

        db.query(
            sql,
            [item_id],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(result);

            }
        );

    }
);

app.get("/get-services_r", (req, res) => {

    const sql = "SELECT id, customer_name FROM customer_details";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });

});

app.get("/rma-details_r/:rma_no", (req, res) => {

const { rma_no } = req.params;
    
  const sql = `
   SELECT
    r.id,
    r.rma_no,
    c.customer_name,
    r.product_name,
    r.model_number,
    r.quantity_no,
    r.customer_dc_no,
    r.entry_date,

    i.id AS item_id,
    i.serial_no,
    i.accessory,
    i.issues,
    i.status

FROM rma_entry1 r

LEFT JOIN customer_details c
    ON r.customer_id = c.id

LEFT JOIN rma_items i
    ON r.id = i.rma_id

WHERE r.rma_no = ?

ORDER BY r.id`;

  db.query(sql, [rma_no], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);

  });

});

app.get("/pending-serials", (req, res) => {

    const sql = `
        SELECT
    r.rma_no,
    c.customer_name,
    
    r.product_name,
    r.model_number,
    r.entry_date,
    i.id AS item_id,
    i.serial_no,
    i.accessory,
    i.issues,
    i.status
FROM rma_entry1 r
JOIN rma_items i
    ON r.id = i.rma_id
    LEFT JOIN customer_details c
    ON r.customer_id = c.id
WHERE LOWER(TRIM(i.status)) = 'pending'
ORDER BY r.entry_date DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });

});

app.get("/complete-serials", (req, res) => {

    const sql = `
        SELECT
    r.rma_no,
    c.customer_name,
    r.product_name,
    r.model_number,
    r.entry_date,
    i.id AS item_id,
    i.serial_no,
    i.accessory,
    i.issues,
    i.status
FROM rma_entry1 r
JOIN rma_items i
    ON r.id = i.rma_id
    LEFT JOIN customer_details c
    ON r.customer_id = c.id
WHERE LOWER(TRIM(i.status)) = 'completed'
ORDER BY r.entry_date DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });

});

app.get("/pending-serials_o", (req, res) => {

    const sql = `
        SELECT
    r.rma_no,
    
    i.product_name,
    i.model_number,
    r.entry_date,
    i.id AS item_id,
    i.serial_no,
    i.accessory,
    i.issues,
    i.status
FROM rma_out r
JOIN rma_items1 i
    ON r.id = i.rma_id
WHERE LOWER(TRIM(i.status)) = 'pending'
ORDER BY r.entry_date DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });

});

app.get("/complete-serials_o", (req, res) => {

    const sql = `
        SELECT
    r.rma_no,
    
    i.product_name,
    i.model_number,
    r.entry_date,
    i.id AS item_id,
    i.serial_no,
    i.accessory,
    i.issues,
    i.status
FROM rma_out r
JOIN rma_items1 i
    ON r.id = i.rma_id
WHERE LOWER(TRIM(i.status)) = 'completed'
ORDER BY r.entry_date DESC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result);
    });

});

app.get("/all-irma-data_pending", (req, res) => {

    const sql = `
        SELECT
    r.rma_no,
    MAX(c.customer_name) AS customer_name,
    MAX(r.customer_dc_no) AS customer_dc_no,
    MAX(r.product_name) AS product_name,
    MAX(r.model_number) AS model_number,
    MAX(r.entry_date) AS entry_date
FROM rma_entry1 r
JOIN customer_details c
    ON r.customer_id = c.id
WHERE LOWER(TRIM(r.status)) = 'pending'
GROUP BY r.rma_no
ORDER BY r.rma_no ASC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });

});
app.get("/all-irma-data_complete", (req, res) => {

    const sql = `
        SELECT
    r.rma_no,
    MAX(c.customer_name) AS customer_name,
    MAX(r.customer_dc_no) AS customer_dc_no,
    MAX(r.product_name) AS product_name,
    MAX(r.model_number) AS model_number,
    MAX(r.entry_date) AS entry_date
FROM rma_entry1 r
JOIN customer_details c
    ON r.customer_id = c.id
WHERE LOWER(TRIM(r.status)) = 'completed'
GROUP BY r.rma_no
ORDER BY r.rma_no ASC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });

});

app.get("/all-orma-data_pending", (req, res) => {

    const sql = `
       SELECT
    r.rma_no,
    MAX(c.center_name) AS center_name,

    MAX(i.product_name) AS product_name,
    MAX(i.model_number) AS model_number,
    MAX(r.quantity_no)AS quantity_no,
    MAX(r.entry_date) AS entry_date
FROM rma_out r
JOIN services_details c
    ON r.services_id = c.id
JOIN rma_items1 i
    ON r.id = i.rma_id
WHERE LOWER(TRIM(r.status)) = 'pending'
GROUP BY r.rma_no
ORDER BY r.rma_no ASC
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });

});
app.get("/all-orma-data_complete", (req, res) => {

    const sql = `
       SELECT
    r.rma_no,
    MAX(c.center_name) AS center_name,
    
    MAX(i.product_name) AS product_name,
    MAX(i.model_number) AS model_number,
    MAX(r.quantity_no)AS quantity_no,
    MAX(r.entry_date) AS entry_date
FROM rma_out r
JOIN services_details c
    ON r.services_id = c.id
JOIN rma_items1 i
    ON r.id = i.rma_id
WHERE LOWER(TRIM(r.status)) = 'completed'
GROUP BY r.rma_no
ORDER BY r.rma_no ASC;
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });

});



cron.schedule("* * * * *", () => {

    const sql = `
    INSERT INTO rma_status_history1
    (
        rma_item_id,
        status_text,
        status
    )
    SELECT
        rm.rma_item_id,
        CONCAT(
            'You missed ',
            rm.reminder_day,
            ' day reminder'
        ),
        'Missed'

    FROM rma_reminders rm

    JOIN rma_items i
        ON rm.rma_item_id = i.id

    JOIN rma_entry1 r
        ON i.rma_id = r.id

    WHERE
        LOWER(i.status) <> 'completed'
        AND rm.is_read = 0
        AND DATEDIFF(CURDATE(), r.entry_date) > rm.reminder_day

        AND NOT EXISTS (
            SELECT 1
            FROM rma_status_history1 h
            WHERE h.rma_item_id = rm.rma_item_id
            AND h.status_text = CONCAT(
                'You missed ',
                rm.reminder_day,
                ' day reminder'
            )
        )
    `;

    db.query(sql, (err) => {

        if (err) {
            console.log("Reminder History Error:", err);
        } else {
            console.log("Missed Reminder History Updated");
        }

    });

});

cron.schedule("* * * * *", () => {

    const sql = `
    INSERT INTO rma_status_history
    (
        rma_item_id,
        status_text,
        status
    )
    SELECT
        rm.rma_item_id,
        CONCAT(
            'You missed ',
            rm.reminder_day,
            ' day reminder'
        ),
        'Missed'

    FROM rma_reminders1 rm

    JOIN rma_items1 i
        ON rm.rma_item_id = i.id

    JOIN rma_out r
        ON i.rma_id = r.id

    WHERE
        LOWER(i.status) <> 'completed'
        AND rm.is_read = 0
        AND DATEDIFF(CURDATE(), r.entry_date) > rm.reminder_day

        AND NOT EXISTS (
            SELECT 1
            FROM rma_status_history h
            WHERE h.rma_item_id = rm.rma_item_id
            AND h.status_text = CONCAT(
                'You missed ',
                rm.reminder_day,
                ' day reminder'
            )
        )
    `;

    db.query(sql, (err) => {

        if (err) {
            console.log("Reminder History Error:", err);
        } else {
            console.log("Missed Reminder History Updated");
        }

    });

});


app.get("/search-serial/:serialNo", (req, res) => {

    const { serialNo } = req.params;
    const checkSql = `
        SELECT serial_no
        FROM rma_items1
        WHERE serial_no = ?
        AND status <> 'Completed'
    `;

    db.query(checkSql, [serialNo], (err, rows) => {

        if (err) return res.status(500).json(err);

        if (rows.length > 0) {
            return res.json({
                exists: true,
                message: "Serial Number Already Exists"
            });
        }
const sql = `
SELECT
    e.product_name,
    e.model_number,
    e.customer_dc_no,
    i.serial_no,
    i.accessory,
    i.issues,
    i.status
FROM rma_entry1 e
JOIN rma_items i
    ON e.id = i.rma_id
WHERE i.serial_no = ?
`;

db.query(sql, [serialNo], (err, result) => {

    if (err) {
        return res.status(500).json(err);
    }

    if (result.length === 0) {
        return res.json({
            success: false,
            message: "Serial Number Not Found"
        });
    }

    if (
        result[0].status &&
        result[0].status.toLowerCase() !== "pending"
    ) {
        return res.json({
            success: false,
            message: `Serial Number status is ${result[0].status}`
        });
    }

    res.json({
        success: true,
        data: result[0]
    });
});

    });
});

app.get("/serial-history/:serial_no", (req, res) => {

    const { serial_no } = req.params;
    console.log("SERIAL:", serial_no);

    const sql = `
        SELECT
            i.serial_no,
            h.status,
            h.status_text,
            h.updated_by,
            h.updated_at,
            'INWARD' AS source
        FROM rma_items i
        JOIN rma_status_history1 h
            ON i.id = h.rma_item_id
        WHERE i.serial_no = ?

        UNION ALL

        SELECT
            i1.serial_no,
            h1.status,
            h1.status_text,
            h1.updated_by,
            h1.updated_at,
            'OUTWARD' AS source
        FROM rma_items1 i1
        JOIN rma_status_history h1
            ON i1.id = h1.rma_item_id
        WHERE i1.serial_no = ?

        ORDER BY updated_at ASC
    `;

    db.query(sql, [serial_no, serial_no], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        console.log("RESULT:", result);
        res.json(result);
    });

});


app.use(express.static(path.join(__dirname, "build")));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(5000, () => {
    console.log(
        "server is running on port 5000"
    );
});