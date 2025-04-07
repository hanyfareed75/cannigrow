import passport from "passport";
import { Strategy } from googleStrategy;

const GoogleStrategy = new Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userSchema.findOne({ googleId: profile.id });

            if (!user) {
                user = await userSchema.create({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    photo: profile.photos[0].value,
                });
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }    
    }
)   

passport.use(GoogleStrategy);

export function googlegetAuth() {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }); 
}