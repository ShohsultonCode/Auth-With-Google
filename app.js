const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const usermodel = require("./model")

const mongoose = require("mongoose");

try {
    const conn = mongoose.connect("mongodb://127.0.0.1:27017/authgoogle", {
        useNewUrlParser: true,
    });

    console.log(`MongoDB connected to`);
} catch (err) {
    console.log(err);
}

const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: true }));



app.set("view engine", "ejs");

app.use(
    session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new GoogleStrategy(
        {
            clientID:
                "819831711342-a4b58qeitii85lgmum9a6g9t2g5mbl4m.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get("/", (req, res) => {
    // console.log(req.user);
    res.render("index", { user: req.user });
});
app.get("/success", async (req, res) => {
    const { id, displayName, name, emails, photos, provider } = req.user
    const newUser = await usermodel.create({
        google_id: id,
        display_name: displayName,
        name: name.familyName,
        email: emails[0].value,
        photo: photos[0].value,
    })


    res.redirect("/success")

});


app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "/success",
        failureRedirect: "/login",
    })
);

app.get("/logout", (req, res) => {
    res.redirect("/");
});

//Salom
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});