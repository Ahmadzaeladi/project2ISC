module.exports = {
  main(req, res) {
    res.render("main", {
      url: "http://localhost:5050/",
    });
  },
};
