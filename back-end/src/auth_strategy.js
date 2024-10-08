const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const bcrypt = require('bcrypt');

const database = require('../db/dbconnection');
const { USER_QUERY: QUERY } = require('../db/query');


passport.serializeUser((user, done) => {
    done(null, user.iduser);
});

passport.deserializeUser(async (id, done) => {

    try {
        const [user] = await database.query(QUERY.SELECT_USER, id);
        if (!user[0]) { throw new Error("User Not Found"); }
        done(null, user[0]);
    } catch (error) {
        done(error, null);
    }
});


passport.use(new LocalStrategy(async (username, password, done) => {

    try {
        const [user] = await database.query(QUERY.FIND_USER_AUTH, username);

        if (!user[0]) {
            return done(null, false, { path: 'username', msg: 'User not found' });
        }
        else {
            const isPasswordCorrect = bcrypt.compareSync(password, user[0].password)
            if (!isPasswordCorrect) { return done(null, false, { path: 'password', msg: 'Invalid password' }); }
            return done(null, user[0]);
        }

    } catch (error) {

        return done(error, null);
    }
}));

module.exports = passport;
