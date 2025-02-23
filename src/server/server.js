import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const app = express();
const PORT = 5000;

// PostgreSQL connection
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "Medvion",
  password: "admin",
  port: 5432,
});


app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());


//session
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Change to true if using HTTPS
  })
);

// 🔹 **Login Route**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT u.email, u.photo , u.sdc_code, u.password, d.full_name AS name FROM user_profiles u JOIN user_details d ON u.user_id = d.user_id WHERE u.email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.rows[0].password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Store user data in session
    req.session.user = { name: user.rows[0].name, email: user.rows[0].email , photo: user.rows[0].photo, sdc :user.rows[0].sdc_code};
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/session", (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});


app.get("/recent", async (req, res) => {  
  try {
     if (!req.session?.user?.email) {
        return res.status(400).json({ message: "User not authenticated" });
     }

     const queryText = `
        SELECT * FROM user_records 
        WHERE user_id = (SELECT user_id FROM user_profiles WHERE sdc_code = $1) 
        ORDER BY appointment_date DESC 
        LIMIT 1;
     `;

     const recent = await pool.query(queryText, [req.session.user.sdc]);

     if (recent.rows.length === 0) {
        return res.status(404).json({ message: "No records found" });
     }

     res.json({ recent: recent.rows[0] });

  } catch (error) {
     console.error("Error fetching recent record:", error);
     res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/getlogs", async (req, res) => {
  try {
    if (!req.session?.user?.email) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const queryText = `
      SELECT data_logs FROM user_details 
      WHERE user_id = (SELECT user_id FROM user_profiles WHERE sdc_code = $1)
    `;

    const recent = await pool.query(queryText, [req.session.user.sdc]);

    if (recent.rows.length === 0) {
      return res.status(404).json({ message: "No records found" });
    }

    const logsArray = recent.rows[0].data_logs || [];

    res.json({ logs: logsArray });

  } catch (error) {
    console.error("Error fetching recent records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  
});

app.get("/details", async (req, res) => {
  try {
    if (!req.session?.user?.sdc) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const queryText = `
      SELECT 
        u.*, 
        p.sdc_code, 
        p.qr_code, 
        p.visibility, 
        p.photo, 
        p.phone_no, 
        p.email 
      FROM user_details u 
      JOIN user_profiles p ON u.user_id = p.user_id
      WHERE p.sdc_code = $1
    `;

    const details = await pool.query(queryText, [req.session.user.sdc]);

    // Check if the user exists
    if (details.rows.length === 0) {
      return res.status(404).json({ message: "User details not found" });
    }

    // Extract the first row
    const userDetails = details.rows[0];

    // Convert BYTEA image to Base64 if photo exists
    if (userDetails.photo) {
      userDetails.photo = `data:image/jpeg;base64,${userDetails.photo.toString("base64")}`;
    }

    res.json({ details: userDetails });
  } catch (error) {
    console.error("Error fetching Details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/update-visibility", async (req, res) => {
  try {
    if (!req.session?.user?.sdc) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    const { visibility } = req.body;

    const queryText = `
      UPDATE user_profiles 
      SET visibility = $1
      WHERE sdc_code = $2
      RETURNING visibility, sdc_code;
    `;

    const updatedUser = await pool.query(queryText, [visibility, req.session.user.sdc]);

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update session with new SDC code from the trigger
    req.session.user.sdc = updatedUser.rows[0].sdc_code;

    res.json({
      success: true,
      visibility: updatedUser.rows[0].visibility,
      sdc_code: updatedUser.rows[0].sdc_code,
    });

  } catch (error) {
    console.error("Error updating visibility:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/records", async (req, res) => {
  try {
    console.log("Current SDC Code:", req.session?.user?.sdc);
    if (!req.session?.user?.sdc) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    const queryText = `SELECT * FROM user_records WHERE user_id = (
                     SELECT user_id FROM user_profiles WHERE sdc_code = $1
                   )`;
    const records = await pool.query(queryText, [req.session.user.sdc]);

    return res.json({ success: true, records: records.rows });

  } catch (err) {
    console.error("Error getting records:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


// 🔹 **Logout Route**
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
