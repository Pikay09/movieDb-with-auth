const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user.model");

router.get("/register", (req, res) => {
  res.render("auth/register");
});

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.redirect("/auth/register");
  } catch (e) {
    //
    console.log(e);
  }
});

router.get("/login", (req, res) => {
  req.flash('success', 'Flash is back!')
  res.render("auth/login");
});

/**
 * Handles the login
 */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    successFlash: "Successfully logged in"
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
