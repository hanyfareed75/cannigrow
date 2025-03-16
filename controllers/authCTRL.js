
const googleauth =(app,passport,userSchema,GoogleStrategy ,session,MongoStore,connstring)=>{

    app.use(
      session({
        secret: "your_secret_key",
        resave: false,
        saveUninitialized: false,
         cookie: { secure: false },
        store: MongoStore.create({ mongoUrl: connstring }),
      })
    ); 
  // **إعداد Passport**
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
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
  );

  // **حفظ بيانات المستخدم في الجلسة**
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userSchema.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

const localAuth=(app,passport,userSchema,LocalStrategy,session,MongoStore,connstring,bcrypt)=>{

     app.use(
       session({
         secret: "your_secret_key",
         resave: false,
         saveUninitialized: false,
         cookie: { secure: false },
         store: MongoStore.create({ mongoUrl: connstring }),
       })
     );
     // **إعداد Passport**
     app.use(passport.initialize());
     app.use(passport.session());

    passport.use(
        new LocalStrategy(
          {
            usernameField: "email",
            passwordField: "password",
          },
          async (email, password, done) => {
            try {
            
              const user = await userSchema.findOne({ email });
              console.log(user);
              if (!user) {
                console.log("No User Found");
                return done(null, false, { message: "Incorrect email" });
              }
              const isMatch = await bcrypt.compare(password, user.password);
              const isMatch1 = password === user.password;
              if (!isMatch1) {
                return done(null, false, { message: "Incorrect password" });
              }
              return done(null, user);
            } catch (err) {
                console.log(err);
              return done(err);
            }
          }
        )   
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser(async (id, done) => {
        try {
          const user = await userSchema.findById(id);
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      });

}
 
module.exports={googleauth,localAuth}