// Definisikan configurasi Database
const config = require("../configs/database");
// Gunakan library mysql
let mysql = require("mysql");
// Buat koneksi
let pool = mysql.createPool(config);

// Kirim error jika koneksi gagal
pool.on("error", (err) => {
  console.error(err);
});

module.exports = {
  // Fungsi untuk merender file register yang ada pada folder 'src/views/register.ejs'
  formRegister(req, res) {
    res.render("register", {
      // Definisikan semua varibel yang ingin ikut dirender kedalam register.ejs
      url: "http://localhost:5050/",
    });
  },
  // Fungsi untuk menyimpan data
  saveRegister(req, res) {
    // Tampung inputan user kedalam varibel username, email dan password
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.pass;
    // Pastikan semua varibel terisi
    if (username && email && password) {
      // Panggil koneksi dan eksekusi query
      pool.getConnection(function (err, connection) {
        if (err) throw err;
        connection.query(
          `INSERT INTO table_user (user_name,user_email,user_password) VALUES (?,?,SHA2(?,512));`,
          [username, email, password],
          function (error, results) {
            if (error) throw error;
            // Jika tidak ada error, set library flash untuk menampilkan pesan sukses
            req.flash("color", "success");
            req.flash("status", "Yes..");
            req.flash("message", "Registrasi berhasil");
            // Kembali kehalaman login
            res.redirect("/login");
          }
        );
        // Koneksi selesai
        connection.release();
      });
    } else {
      // Kondisi apabila variabel username, email dan password tidak terisi
      res.redirect("/login");
      res.end();
    }
  },
  deleteUser(req, res) {
    const userId = req.params.id;
    console.log("ID yang akan dihapus:", userId); // Debugging
    //pastikan id user ada
    if (!userId) {
      console.error("Id user tidak ditemukan");
      return res.redirect("/home");
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Koneksi ke database gagal", err);
        return res.status(500).send("Database connection failed");
      }

      //kesekusi querry delete
      connection.query(
        `DELETE FROM table_user WHERE user_id = ?`,
        [userId],
        (error, result) => {
          if (error) {
            console.error("gagal hapus user: ", error);
            res.status(500).send("Database connection failed");
          } else {
            console.log("user berhasil dihapus", result);
            connection.query(
              `SET @num := 0; 
             UPDATE table_user SET user_id = (@num := @num + 1); 
             ALTER TABLE table_user AUTO_INCREMENT = 1;`,
              (resetError, resetResult) => {
                if (resetError) {
                  console.error("Gagal reset ID: ", resetError);
                  res.status(500).send("Failed to reset ID sequence");
                } else {
                  console.log("ID berhasil direset", resetResult);
                  res.redirect("/home");
                }
              }
            );
          }
        }
      );
      connection.release();
    });
  },
  updateUser(req, res) {
    const userId = req.params.id; // Ambil ID dari parameter URL
    const { username, email, pass } = req.body; // Ambil data dari form input

    // Pastikan semua data input terisi
    if (!username || !email || !pass) {
      console.error("Data tidak lengkap");
      return res.status(400).send("Semua field harus diisi!");
    }

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Koneksi ke database gagal", err);
        return res.status(500).send("Database connection failed");
      }

      // Eksekusi query untuk mengupdate user
      connection.query(
        `UPDATE table_user SET user_name = ?, user_email = ?, user_password = SHA2(?, 512) WHERE user_id = ?`,
        [username, email, pass, userId],
        (error, result) => {
          connection.release(); // Lepaskan koneksi setelah selesai
          if (error) {
            console.error("Gagal update user: ", error);
            return res.status(500).send("Database operation failed");
          }

          console.log("User berhasil diupdate", result);
          res.redirect("/home"); // Kembali ke halaman home
        }
      );
    });
  },
};
