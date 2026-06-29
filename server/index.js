const express = require("express");
const app = express();

const bodyParser = require("body-parser");
//const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");
require("dotenv").config();

// middleware FIRST
// app.use(cors({
//     origin: "http://localhost:3000"
// }));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /require("./cron");

// database
// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "Mysql@123.",
//     database: "crud_contact"
// });
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
app.get("/test-neon", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function generateReminders_l(item_id) {

    const reminderDays = [3, 5, 7, 10, 13, 15, 17, 20, 23, 25, 27, 30, 33, 35, 37, 40];

    reminderDays.forEach(day => {

        db.query(
            `INSERT INTO rma_reminders
            (rma_item_id, reminder_day)
            VALUES ($1,$2)`,
            [item_id, day],
            (err) => {

                if (err) {
                    console.log(err);
                }

            }
        );

    });

}

function generateReminders(item_id) {

    const reminderDays = [3, 5, 7, 10, 13, 15, 17, 20, 23, 25, 27, 30, 33, 35, 37, 40];

    reminderDays.forEach(day => {

        db.query(
            `INSERT INTO rma_reminders1
            (rma_item_id, reminder_day)
            VALUES ($1,$2)`,
            [item_id, day],
            (err) => {

                if (err) {
                    console.log(err);
                }

            }
        );

    });

}

// login api
app.post("/login", (req, res) => {

    console.log("LOGIN REQUEST:", req.body);

    const { username, password } = req.body;

    const sql =
        "SELECT id,username,role FROM login_user WHERE username=$1 AND password=$2";

    db.query(sql, [username, password], (err, data) => {

        if (err) {
            console.error("LOGIN ERROR:", err);
            return res.status(500).json({
                error: err.message
            });
        }

        console.log("LOGIN RESULT:", data.rows);

        if (data.rows.length > 0) {
            return res.json({
                message: "Login Successfully",
                role: data.rows[0].role,
                id: data.rows[0].id,
                username: data.rows[0].username,
            });
        } else {
            return res.json("No Record");
        }
    });
});



// get api
app.get("/api/get", (req, res) => {

    const sqlGet =
        "SELECT id, customer_name, company_name, phone_no FROM customer_details";

    db.query(sqlGet, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }

        res.json(result.rows);
    });
});

app.get("/api/staff", (req, res) => {

    const sqlGet =
        "SELECT id, username,role from login_user";

    db.query(sqlGet, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }

        res.json(result.rows);
    });
});


app.get("/api/service", (req, res) => {

    const sqlGet =
        "SELECT id, servicer_name, center_name, phone_no FROM services_details";

    db.query(sqlGet, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }

        res.json(result.rows);
    });
});

app.delete("/api/remove/:id", (req, res) => {
    const id = req.params.id;
    const sqlRemove =
        "Delete from customer_details where id=$1 RETURNING *";
    db.query(sqlRemove, [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        console.log(result.rows);
        console.log(result.rows[0]);

        // Check whether that id actually existed
        if (result.rowCount === 0) {
            return res.status(404).send("Customer not found");
        }

        res.send("Customer deleted successfully");
    });
});

app.delete("/api/ser_remove/:id", (req, res) => {
    const id = req.params.id;
    const sqlRemove =
        "Delete from services_details where id= $1 RETURNING * ";
    db.query(sqlRemove, [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        console.log(result.rows);
        console.log(result.rows[0]);

        // Check whether that id actually existed
        if (result.rowCount === 0) {
            return res.status(404).send("Center name not found");
        }

        res.send("Service details deleted successfully");
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
    VALUES ($1, $2, $3, $4, $5, $6, $7)RETURNING *;
    `;

    db.query(
        sql,
        [
            customer_name,
            company_name|| null,
            address,
            phone_no,
            gst_no||null,
            location,
            email|| null
        ],
        (err, result) => {
            if (err) {
    console.error("POST CUSTOMER ERROR:", err);
    return res.status(500).json({
        error: err.message,
        detail: err.detail
    });
}

            res.json({
                message: "Customer Added Successfully",
                customer: result.rows[0]
            });
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
    VALUES ($1, $2, $3, $4, $5, $6, $7)
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
    VALUES ($1, $2, $3)
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
            "SELECT username FROM login_user WHERE id=$1";

        db.query(
            sql,
            [id],
            (error, result) => {

                if (error) {
                    return res.status(500).json(error);
    }

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(result.rows[0]);
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
             SET password=$1
             WHERE id=$2
             RETURNING *;`;

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

    const sqlGet = "SELECT * FROM customer_details WHERE id = $1";

    db.query(sqlGet, [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }

        console.log(result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(result.rows[0]);
    });
});
app.get("/api/getservice/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "select  * from services_details where id=$1";
    db.query(sqlGet, [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }

        console.log(result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Center not found" });
        }

        res.json(result.rows[0]);
    });
});

// Customer Count API
app.get("/api/customerCount", (req, res) => {
    const sql = `SELECT COUNT(*) AS total FROM customer_details`;
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        res.json(result.rows[0]);
    });
});

app.get("/api/InwardCount", (req, res) => {
    const sql = `SELECT COUNT(*) AS total FROM rma_items WHERE TRIM(LOWER(status)) = 'pending'`;
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        res.json(result.rows[0]);
    });
});

app.get("/api/CompleteCount", (req, res) => {
    const sql =
        `SELECT COUNT(*) AS total FROM rma_items WHERE TRIM(LOWER(status)) = 'completed'`;
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        res.json(result.rows[0]);
    });
});

app.get("/api/OutwardCount", (req, res) => {
    const sql =
        `SELECT COUNT(*) AS total FROM rma_items1 WHERE TRIM(LOWER(status)) = 'pending'`;
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        res.json(result.rows[0]);
    });
});

app.get("/api/CompleteCount_o", (req, res) => {
    const sql =
        `SELECT COUNT(*) AS total FROM rma_items1 WHERE TRIM(LOWER(status)) = 'completed'`;
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        res.json(result.rows[0]);
    });
});

app.get("/api/pendingCount_irma", (req, res) => {
    const sql = `
        SELECT COUNT(DISTINCT r.rma_no) AS total
FROM rma_entry1 r
WHERE LOWER(TRIM(r.status)) = 'pending'`;
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        res.json(result.rows[0]);
    });
});

app.get("/api/completeCount_irma", (req, res) => {
    const sql = `
        SELECT COUNT(DISTINCT r.rma_no) AS total
FROM rma_entry1 r
WHERE LOWER(TRIM(r.status)) = 'completed'`;
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        res.json(result.rows[0]);
    });
});

app.get("/api/pendingCount_orma", (req, res) => {
    const sql = `
        SELECT COUNT(DISTINCT r.rma_no) AS total
FROM rma_out r
WHERE LOWER(TRIM(r.status)) = 'pending'`;
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        res.json(result.rows[0]);
    });
});

app.get("/api/completeCount_orma", (req, res) => {
    const sql = `
        SELECT COUNT(DISTINCT r.rma_no) AS total
FROM rma_out r
WHERE LOWER(TRIM(r.status)) = 'completed'`;
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }
        res.json(result.rows[0]);
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
    const sqlUpdate = "update customer_details set customer_name=$1,company_name=$2,address=$3,phone_no=$4,gst_no=$5,location=$6,email=$7 where id=$8 RETURNING *;";
    db.query(sqlUpdate, [customer_name, company_name, address, phone_no, gst_no, location, email, id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }

        res.json(result.rows);
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
    const sqlUpdate = "update services_details set servicer_name=$1,center_name=$2,address=$3,phone_no=$4,mobile=$5,location=$6,email=$7 where id=$8 RETURNING *;";
    db.query(sqlUpdate, [servicer_name, center_name, address, phone_no, mobile, location, email, id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json(error);
        }

        res.json(result.rows);
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
            return res.status(500).json(err);
        }
        console.log(result.rows);
        res.json(result.rows);
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
WHERE id=$1
`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json(result.rows);
    });
});

app.get("/test", (req, res) => {
    res.send("API Working");
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

        res.json(result.rows);
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
        TO_CHAR(r.entry_date,'DD-MM-YYYY') AS entry_date,
        r.created_by,
        l.username AS created_by_name,
        c.customer_name,
        c.company_name,
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
    WHERE r.rma_no = $1
    `;

    db.query(sql, [rmaNo], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        console.log("PDF DATA:", result);

        res.json(result.rows);

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
             WHERE id=$1`;

        db.query(
            sql,
            [id],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    message: "Service Completed"
                });
            }
        );
    }
);




app.get("/api/rma/:id", (req, res) => {

    const { id } = req.params;

    const sql =
        `
SELECT r.*,
c.customer_name
FROM rma_entry1 r
JOIN customer_details c
ON r.customer_id=c.id
WHERE r.id=?
`;

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result.rows);

    });
});




const cron = require("node-cron");
// // const db = require("./db");


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
        res.json(result.rows);
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
WHERE id=$1
`;
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        res.json(result.rows);
    });
});

app.get("/test", (req, res) => {
    res.send("API Working");
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

        res.json(result.rows);
    });
});



app.post("/complete-rma", (req, res) => {

    const { id } = req.body;

    db.query(`
 UPDATE rma_entry1
 SET status='Completed'
 WHERE id=$1`, [id],
        (err) => {

            if (err) {
                return res.send(err);
            }

            res.send("Completed");

        });

});


app.get("/history", (req, res) => {

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
        (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }

            res.json(result.rows);

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
                console.log(err);
                return res.status(500).json(err);
            }

            res.json(result.rows);

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
    WHERE sh.rma_id = $1
    ORDER BY sh.updated_date DESC
  `;

    db.query(sql, [rma_id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result.rows);

    });

});

app.get("/get-customers", (req, res) => {

    const sql = "SELECT id, customer_name,company_name FROM customer_details";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result.rows);
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
    WHERE serial_no= ANY($1)
    AND status <> 'Completed'
`;

    db.query(checkSql, [serials], (err, result) => {

        if (err) {
            console.log("CHECK SERIAL ERROR:", err);
            return res.status(500).json(err);
        }

        if (result.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Serial No already exists: ${result.rows.map(r => r.serial_no).join(", ")
                    }`
            });
        }

        // ONLY IF NO DUPLICATES
        saveRma();

    });
    function saveRma() {


        const getRmaNo =
            "SELECT COALESCE(MAX(rma_no),1000)+1 AS rmano FROM rma_out";

        db.query(getRmaNo, (err, result) => {
            if (err) {
                console.log("GET RMA ERROR:", err);
                return res.status(500).json(err);
            }

            const rmaNo = result.rows[0].rmano;

            const reminderDate = new Date(entry_date);
            reminderDate.setDate(reminderDate.getDate() + 3);

            // 1. Insert into rma_out (MASTER)
            const sql = `
            INSERT INTO rma_out
            (rma_no, services_id,quantity_no,reminder_date, entry_date,status,created_by)
            VALUES ($1,$2,$3,$4,$5,$6,$7)RETURNING id
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

                if (err) {
                    console.log("RMA_OUT INSERT ERROR:", err);
                    return res.status(500).json(err);
                }
                const rmaId = result.rows[0].id;

                // 2. Insert multiple serials (CHILD TABLE)
                const insertItems = items.map(item => {
                    return new Promise((resolve, reject) => {
                        db.query(
                            `INSERT INTO rma_items1 
                        (rma_id, serial_no, accessory, issues, product_name,model_number,status)
                        VALUES ($1,$2,$3,$4,$5,$6,$7)RETURNING id`,
                            [
                                rmaId,
                                item.serial_no,

                                item.accessory,
                                item.issues,
                                item.product_name,
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
});

app.post("/complete-rma_l", (req, res) => {

    const { id } = req.body;

    db.query(
        `
 UPDATE rma_out
 SET status='Completed'
 WHERE id=$1
 `,
        [id],
        (err) => {

            if (err) {
                return res.send(err);
            }

            res.send("Completed");

        });

});


app.get("/history_l", (req, res) => {

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
        (err, result) => {

            if (err) {
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

            res.json(result.rows);

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
    WHERE sh.rma_id = $1
    ORDER BY sh.updated_date DESC
  `;

    db.query(sql, [rma_id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result.rows);

    });

});

app.get("/get-services", (req, res) => {

    const sql = "SELECT id, center_name FROM services_details";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result.rows);
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
        TO_CHAR(r.entry_date,'DD-MM-YYYY') AS entry_date,
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

    WHERE r.rma_no = $1
    `;


    db.query(sql, [rmaNo], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        console.log("PDF DATA:", result);
        console.log("FIRST ROW:", result.rows[0]);

        res.json(result.rows);

    });

});



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

        res.json(result.rows);

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

WHERE r.rma_no = $1

ORDER BY r.id`;

    db.query(sql, [rma_no], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result.rows);

    });

});

app.put("/update-rma/:rma_no", (req, res) => {

    const rows = req.body;

    rows.forEach((item) => {

        const sql = `
            UPDATE rma_items1
            SET issues = $1
            WHERE id = $2
        `;

        db.query(
            sql,
            [item.issues, item.item_id],
            (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }
            }
        );

    });

    res.json({
        message: "Issues Updated Successfully"
    });

});
//next
app.put("/update-rma_in/:rma_no", (req, res) => {

    const rows = req.body;

    rows.forEach((item) => {

        // Update rma_out
        const sql1 = `
            UPDATE rma_entry1
            SET
                product_name = $1,
                model_number = $2,
                quantity_no = $3,
                customer_dc_no =$4
            WHERE id = $5
            RETURNING *;
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
                serial_no = $1,
                accessory = $2,
                issues = $3
            WHERE id = $4
            RETURNING *;
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
SET status = $1
FROM rma_out r
WHERE i.rma_id = r.id
AND r.rma_no = $2
RETURNING *;
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
        WHERE r.rma_no = $1
    `;

    db.query(getItemIdsSql, [rma_no], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        const itemIds = result.rows.map(item => item.id);

        if (itemIds.length === 0) {
            return res.status(404).json({
                message: "RMA not found"
            });
        }

        db.query(
            "DELETE FROM rma_status_history WHERE rma_item_id =ANY($1)",
            [itemIds],
            (err) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }

                db.query(
                    "DELETE FROM rma_reminders1 WHERE rma_item_id=ANY($1)",
                    [itemIds],
                    (err) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }

                        db.query(
                            `DELETE FROM rma_items1
WHERE rma_id IN
(
SELECT id
FROM rma_out
WHERE rma_no=$1
)`,
                            [rma_no],
                            (err) => {

                                if (err) {
                                    console.log(err);
                                    return res.status(500).json(err);
                                }

                                db.query(
                                    "DELETE FROM rma_out WHERE rma_no = $1",
                                    [rma_no],
                                    (err, result) => {

                                        if (err) {
                                            console.log(err);
                                            return res.status(500).json(err);
                                        }

                                        res.json({
                                            message: "RMA Deleted Successfully",
                                            affectedRows: result.rowCount
                                        });
                                    });
                            });
                    });
            });
    });
});

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
            AND (CURRENT_DATE - r.entry_date::date) 
                >= rm2.reminder_day
        )

    ORDER BY r.rma_no ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result.rows);
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
    WHERE id = $1
`;

    db.query(checkStatusSql, [item_id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }
        result.rows[0]

        if (
            result.rows[0].status &&
            result.rows[0].status.toLowerCase() === "completed"
        ) {
            return res.status(400).json({
                message: "Status already completed. Cannot update again."
            });
        }
        // 1. update item
        const updateSql = `
        UPDATE rma_items1
        SET status = COALESCE(NULLIF($1, ''), status)
        WHERE id = $2
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
        WHERE id = $1
    `;

            db.query(checkSql, [item_id], (err, result) => {

    if (err) return res.status(500).json(err);

    const rmaId = result.rows[0].rma_id;

                const pendingSql = `
            SELECT COUNT(*) AS pendingcount
            FROM rma_items1
            WHERE rma_id = $1
            AND status <> 'Completed'
        `;

                db.query(pendingSql, [rmaId], (err, result) => {

                    if (err) return res.status(500).json(err);

                    if(Number(result.rows[0].pendingcount)===0) {

                        const completeSql = `
                    UPDATE rma_out
                    SET status = 'Completed'
                    WHERE id = $1
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
            VALUES ($1,$2,$3,$4)
        `;

            db.query(historySql, [item_id, status, status_text, updated_by]);

            // 3. STOP ONLY THIS SERIAL IF COMPLETE
            // Mark ONLY the clicked reminder as handled
            const reminderSql = `
    UPDATE rma_reminders1
    SET is_read = 1
    WHERE id = $1
`;

            db.query(reminderSql, [reminder_id]);

            // If status = complete, stop all reminders for this serial number
            if (status.toLowerCase() === "completed") {

                const clearSql = `
        UPDATE rma_reminders1
        SET is_read = 1
        WHERE rma_item_id = $1
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
        WHERE id = $1
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

WHERE h.rma_item_id = $1

ORDER BY h.updated_at ASC`;

        db.query(
            sql,
            [item_id],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(result.rows);

            }
        );

    }
);


//RMA Entry

app.post("/api/entry_in", async (req, res) => {
    const client = await db.connect();

    try {
        await client.query("BEGIN");

        const {
            customer_id,
            customer_dc_no,
            entry_date,
            products,
            created_by
        } = req.body;

        // Generate next RMA Number
        const rmaResult = await client.query(`
            SELECT COALESCE(MAX(rma_no),1220)+1 AS "rmaNo"
            FROM rma_entry1
        `);

        const rmaNo = rmaResult.rows[0].rmaNo;

        console.log("Generated RMA:", rmaNo);

        for (const product of products) {

            const reminderDate = new Date(entry_date);
            reminderDate.setDate(reminderDate.getDate() + 3);

            // Save Product
            const productResult = await client.query(
                `
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
                VALUES
                ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                RETURNING id
                `,
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
                ]
            );

            const productId = productResult.rows[0].id;

            console.log("Product ID:", productId);

            // Save Items
            for (const item of product.items) {

                const itemResult = await client.query(
                    `
                    INSERT INTO rma_items
                    (
                        rma_id,
                        serial_no,
                        accessory,
                        issues,
                        status
                    )
                    VALUES
                    ($1,$2,$3,$4,$5)
                    RETURNING id
                    `,
                    [
                        productId,
                        item.serial_no,
                        item.accessory,
                        item.issues,
                        "pending"
                    ]
                );

                const itemId = itemResult.rows[0].id;

                console.log("Item ID:", itemId);

                // Generate Reminder
                await generateReminders_l(itemId);
            }
        }

        await client.query("COMMIT");

        res.json({
            success: true,
            rma_no: rmaNo
        });

    } catch (err) {

        await client.query("ROLLBACK");

        console.log(err);

        res.status(500).json({
            success: false,
            error: err.message
        });

    } finally {

        client.release();

    }
});
//next

app.put("/update-rma_r/:rma_no", (req, res) => {

    const rows = req.body;

    rows.forEach((item) => {

        // Update rma_out
        const sql1 = `
            UPDATE rma_entry1
            SET
                product_name = $1,
                model_number = $2,
                quantity_no = $3,
                customer_dc_no = $4
            WHERE id = $5
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
                serial_no = $1,
                accessory = $2,
                issues = $3
            WHERE id = $4
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
        UPDATE rma_items
SET status = $1
FROM rma_entry1
WHERE rma_items.rma_id = rma_entry1.id
AND rma_entry1.rma_no = $2
RETURNING *;
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
        WHERE r.rma_no = $1
    `;

   db.query(getItemIdsSql, [rma_no], (err, result) => {

    if (err) {
        console.log(err);
        return res.status(500).json(err);
    }

    const itemIds = result.rows.map(item => item.id);

    console.log(itemIds);


        if (itemIds.length === 0) {
            return res.status(404).json({
                message: "RMA not found"
            });
        }

        db.query(
            "DELETE FROM rma_status_history1 WHERE rma_item_id=ANY($1)",
            [itemIds],
            (err) => {

                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                }

                db.query(
                    "DELETE FROM rma_reminders WHERE rma_item_id=ANY($1)",
                    [itemIds],
                    (err) => {

                        if (err) {
                            console.log(err);
                            return res.status(500).json(err);
                        }

                        db.query(
                            `DELETE FROM rma_items
WHERE rma_id IN
(
SELECT id
FROM rma_entry1
WHERE rma_no=$1
)
RETURNING *;`,
                            [rma_no],
                            (err) => {

                                if (err) {
                                    console.log(err);
                                    return res.status(500).json(err);
                                }

                                db.query(
                                    "DELETE FROM rma_entry1 WHERE rma_no = $1",
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
            AND (CURRENT_DATE - r.entry_date::date) 
                >= rm2.reminder_day
        )

    ORDER BY r.rma_no ASC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }

        res.json(result.rows);
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
        SET status = COALESCE(NULLIF($1, ''), status)
        WHERE id = $2
    `;

    db.query(updateSql, [status, item_id], (err,result) => {

        if (err) {
            return res.status(500).json(err);
        }
        console.log(result);
         console.log("Updated Item:", item_id);
    console.log("Status:", status);

        // Save history
        const historySql = `
            INSERT INTO rma_status_history1
            (rma_item_id, status, status_text, updated_by)
            VALUES ($1,$2,$3,$4)
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
                 WHERE id = $1`,
                [reminder_id]
            );

        }

        // If completed, stop all reminders
        if (status.toLowerCase() === "completed") {

            db.query(
                `UPDATE rma_reminders
                 SET is_read = 1
                 WHERE rma_item_id = $1`,
                [item_id]
            );

        }

        // Check whether all serials under same RMA completed
        const checkSql = `
            SELECT rma_id
            FROM rma_items
            WHERE id = $1
        `;

        db.query(checkSql, [item_id], (err, result) => {

    if (err) {
        return res.status(500).json(err);
    }

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Item not found"
        });
    }

    const rmaId = result.rows[0].rma_id;

    // console.log("RMA ID:", rmaId);



            const pendingSql = `
                SELECT COUNT(*) AS pendingcount
                FROM rma_items
                WHERE rma_id = $1
                AND LOWER(status) <> 'completed'
            `;

            db.query(pendingSql, [rmaId], (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                if (Number(result.rows[0].pendingcount) === 0) {

                    db.query(
                        `UPDATE rma_entry1
                         SET status = 'Completed'
                         WHERE id = $1`,
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
    WHERE id = $1
`;

    db.query(checkStatusSql, [item_id], (err, result) => {

    if (err) {
        return res.status(500).json(err);
    }

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Item not found"
        });
    }

    if (
        result.rows[0].status &&
        result.rows[0].status.toLowerCase() === "completed"
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
        WHERE id = $1
    `;
db.query(serialSql, [item_id], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.rows.length === 0) {
        return res.status(404).json({
            message: "Serial not found"
        });
    }

    const serialNo = result.rows[0].serial_no;

                const outwardSql = `
            SELECT status
            FROM rma_items1
            WHERE serial_no = $1
        `;

                db.query(outwardSql, [serialNo], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.rows.length > 0) {

        if (result.rows[0].status.toLowerCase() !== "completed") {
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
//next

app.post("/reminder-click_r/:id", (req, res) => {

    const reminder_id = req.params.id;

    const sql = `
        UPDATE rma_reminders
        SET is_read = 1
        WHERE id = $1
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

WHERE h.rma_item_id = $1

ORDER BY h.updated_at ASC`;

        db.query(
            sql,
            [item_id],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json(result.rows);

            }
        );

    }
);

app.get("/get-services_r", (req, res) => {

    const sql = "SELECT id, customer_name,company_name FROM customer_details";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result.rows);
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

WHERE r.rma_no = $1

ORDER BY r.id`;

    db.query(sql, [rma_no], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result.rows);

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

        res.json(result.rows);
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

        res.json(result.rows);
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

        res.json(result.rows);
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

        res.json(result.rows);
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
        res.json(result.rows);
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
        res.json(result.rows);
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
        res.json(result.rows);
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
        res.json(result.rows);
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
        AND (CURRENT_DATE - r.entry_date::date)  > rm.reminder_day

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
        AND (CURRENT_DATE - r.entry_date::date)  > rm.reminder_day

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
        WHERE serial_no = $1
        AND status <> 'Completed'
    `;

    db.query(checkSql, [serialNo], (err, result) => {

        if (err) return res.status(500).json(err);

        if (result.rows.length > 0) {
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
WHERE i.serial_no = $1
`;

        db.query(sql, [serialNo], (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.rows.length === 0) {
                return res.json({
                    success: false,
                    message: "Serial Number Not Found"
                });
            }

            if (
                result.rows[0].status &&
                result.rows[0].status.toLowerCase() !== "pending"
            ) {
                return res.json({
                    success: false,
                    message: `Serial Number status is ${result.rows[0].status}`
                });
            }

            res.json({
                success: true,
                data: result.rows[0]
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
        WHERE i.serial_no = $1

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
        WHERE i1.serial_no = $2

        ORDER BY updated_at ASC
    `;

    db.query(sql, [serial_no, serial_no], (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json(err);
        }
        console.log("RESULT:", result);
        res.json(result.rows);
    });

});


// app.use(express.static(path.join(__dirname, "build")));

// app.use((req, res) => {
//     res.sendFile(path.join(__dirname, "build", "index.html"));
// });
// API route must come FIRST
app.get("/test-db", async (req, res) => {
    try {
        const result = await db.query(
            "SELECT NOW() AS now"
        );

        res.json({
            success: true,
            now: result.rows[0].now
        });
    } catch (error) {
        console.log("Test DB error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// React build files
app.use(
    express.static(
        path.join(__dirname, "build")
    )
);

// Keep this LAST — it catches React page routes only
app.use((req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "build",
            "index.html"
        )
    );
});





const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});