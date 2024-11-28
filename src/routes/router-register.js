// Definisikan router dari express
const router = require("express").Router();
// Ambil index.js dari controller dan panggil variabel didalamnya
const registerController = require("../controllers").register;
// Definisikan middleware verify.js
const verifyUser = require("../configs/verify");

// Rute 'http://localhost:5050/register/' digunakan untuk menampilkan form register
router.get("/", registerController.formRegister);
// Rute 'http://localhost:5050/register/save' digunakan untuk menyimpan data yang diinput user saat register
router.post("/save", registerController.saveRegister);

router.post("/delete/:id", registerController.deleteUser);
router.post("/update/:id", registerController.updateUser);

// Export agar dapat dibaca oleh express
module.exports = router;
