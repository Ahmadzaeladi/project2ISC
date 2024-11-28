// Definisi Library yang digunakan
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const flash = require("req-flash");
const app = express();

// Definisi lokasi file router
const mainRoutes = require("./src/routes/router-main");
const loginRoutes = require("./src/routes/router-login");
const registerRoutes = require("./src/routes/router-register");
const homeRoutes = require("./src/routes/router-home");

// Configurasi dan gunakan library
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configurasi library session
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "t@1k0ch3ng",
    name: "secretName",
    cookie: {
      sameSite: true,
      maxAge: 60000,
    },
  })
);
app.use(flash());

// Menyajikan file statis (assets, css, js, images, dll) dari folder 'public'
app.use(express.static(path.join(__dirname, "public")));

// Setting folder views
app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

// Gunakan routes yang telah didefinisikan
app.use("/", mainRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/home", homeRoutes);

// Rute default untuk halaman utama
app.get("/", (req, res) => {
  res.render("main", { title: "Halaman Utama" }); // Kirim data ke main.ejs jika perlu
});

// Gunakan port server
app.listen(5050, () => {
  console.log("Server Berjalan di Port : " + 5050);
});

app.use(flash());

// tambahkan ini
app.use(function (req, res, next) {
  res.setHeader(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.setHeader("Pragma", "no-cache");
  next();
});
// end

app.set("views", path.join(__dirname, "src/views"));
