const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const prisma = require('./prisma');

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return done(null, false, { message: 'Usuario no encontrado' });
    if (!user.password) return done(null, false, { message: 'Por favor inicia sesión con Google' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
        
        if (!user) {
          const existingUser = await prisma.user.findUnique({ where: { email: profile.emails[0].value } });
          
          if (existingUser) {
            user = await prisma.user.update({
              where: { id: existingUser.id },
              data: { googleId: profile.id }
            });
          } else {
            user = await prisma.user.create({
              data: {
                googleId: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                role: 'CLIENT'
              }
            });
          }
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));
} else {
  console.warn("Google Client ID or Secret missing. Google Auth disabled.");
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});
