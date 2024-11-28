const config = require("../configs/database");

let mysql = require("mysql");
let pool = mysql.createPool(config);

pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  home(req, res) {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to database:", err);
        res.status(500).send("Database connection failed!");
        return;
      }

      const query = "SELECT * FROM table_user"; // Query untuk mengambil semua data dari tabel users
      connection.query(query, (error, results) => {
        connection.release(); // Pastikan koneksi dilepaskan setelah query selesai
        if (error) {
          console.error("Error executing query:", error);
          res.status(500).send("Failed to fetch data!");
        } else {
          res.render("home", {
            url: "http://localhost:5050/",
            userName: req.session.username,
            users: results, // Kirim data users ke template
          });
        }
      });
    });
  },
};
