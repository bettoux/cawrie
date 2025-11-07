const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Content Schema
const contentSchema = new mongoose.Schema({
  language: { type: String, required: true, enum: ['en', 'fr'] },
  nav: {
    about: String,
    initiatives: String,
    contact: String,
    donate: String
  },
  hero: {
    title1: String,
    title2: String,
    description: String,
    learnMore: String,
    getInvolved: String
  },
  about: {
    title: String,
    paragraph1: String,
    paragraph2: String
  },
  initiatives: {
    title: String,
    subtitle: String,
    cards: [{
      title: String,
      description: String
    }]
  },
  contact: {
    title: String,
    description: String,
    address: String,
    email: String,
    form: {
      name: String,
      email: String,
      subject: String,
      message: String,
      submit: String,
      success: String
    }
  },
  footer: {
    copyright: String
  },
  updatedAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'amplify-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Initialize database with default data
async function initializeDatabase() {
  try {
    // Check if admin user exists
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('✅ Default admin user created');
    }

    // Check if content exists
    const enContent = await Content.findOne({ language: 'en' });
    if (!enContent) {
      await Content.create({
        language: 'en',
        nav: {
          about: 'About Us',
          initiatives: 'Initiatives',
          contact: 'Contact',
          donate: 'Donate Now'
        },
        hero: {
          title1: 'Empowering Futures,',
          title2: 'Building Equity.',
          description: 'Amplify is dedicated to the cultural, educational, and economic advancement of Black communities through direct support and strategic partnerships.',
          learnMore: 'Learn More',
          getInvolved: 'Get Involved'
        },
        about: {
          title: 'Our Mission',
          paragraph1: 'We believe in a world where every individual has the opportunity to thrive. Our organization was founded on the principles of equity, justice, and community. We work tirelessly to dismantle systemic barriers and create tangible pathways for success.',
          paragraph2: 'Through a combination of grassroots action, policy advocacy, and community-led programs, we are amplifying the voices that need to be heard and investing in the change-makers of tomorrow.'
        },
        initiatives: {
          title: 'Current Initiatives',
          subtitle: 'We focus our efforts on three core pillars to create lasting impact.',
          cards: [
            {
              title: 'Youth & Education',
              description: 'Providing mentorship, scholarships, and STEM/arts programming to equip the next generation of leaders with the tools they need to succeed.'
            },
            {
              title: 'Economic Empowerment',
              description: 'Fostering Black-owned businesses through micro-grants, financial literacy workshops, and connecting entrepreneurs with vital resources.'
            },
            {
              title: 'Health & Wellness',
              description: 'Championing health equity by funding community clinics, mental health services, and wellness programs tailored to specific community needs.'
            }
          ]
        },
        contact: {
          title: 'Get in Touch',
          description: "We'd love to hear from you. Whether you're interested in volunteering, partnering, or simply want to learn more, reach out and a member of our team will get back to you.",
          address: '123 Community Lane<br>Prosperity, USA 12345',
          email: 'hello@amplify.org',
          form: {
            name: 'Full Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message',
            submit: 'Send Message',
            success: "Thank you! Your message has been sent. We'll be in touch soon."
          }
        },
        footer: {
          copyright: '© 2025 Amplify. All rights reserved.'
        }
      });
      console.log('✅ Default English content created');
    }

    const frContent = await Content.findOne({ language: 'fr' });
    if (!frContent) {
      await Content.create({
        language: 'fr',
        nav: {
          about: 'À Propos',
          initiatives: 'Initiatives',
          contact: 'Contact',
          donate: 'Faire un Don'
        },
        hero: {
          title1: 'Autonomiser les Avenirs,',
          title2: "Bâtir l'Équité.",
          description: "Amplify se consacre à l'avancement culturel, éducatif et économique des communautés noires par le soutien direct et des partenariats stratégiques.",
          learnMore: 'En Savoir Plus',
          getInvolved: "S'Impliquer"
        },
        about: {
          title: 'Notre Mission',
          paragraph1: "Nous croyons en un monde où chaque individu a l'opportunité de prospérer. Notre organisation a été fondée sur les principes d'équité, de justice et de communauté. Nous travaillons sans relâche pour démanteler les barrières systémiques et créer des voies tangibles vers le succès.",
          paragraph2: "Par une combinaison d'actions locales, de plaidoyer politique et de programmes communautaires, nous amplifions les voix qui doivent être entendues et investissons dans les acteurs du changement de demain."
        },
        initiatives: {
          title: 'Initiatives Actuelles',
          subtitle: 'Nous concentrons nos efforts sur trois piliers fondamentaux pour créer un impact durable.',
          cards: [
            {
              title: 'Jeunesse & Éducation',
              description: 'Offrir du mentorat, des bourses d\'études et des programmes STEM/arts pour équiper la prochaine génération de leaders avec les outils nécessaires à leur réussite.'
            },
            {
              title: 'Autonomisation Économique',
              description: 'Favoriser les entreprises appartenant à des Noirs par des micro-subventions, des ateliers de littératie financière et en connectant les entrepreneurs avec des ressources vitales.'
            },
            {
              title: 'Santé & Bien-être',
              description: "Promouvoir l'équité en santé en finançant des cliniques communautaires, des services de santé mentale et des programmes de bien-être adaptés aux besoins spécifiques de la communauté."
            }
          ]
        },
        contact: {
          title: 'Contactez-Nous',
          description: 'Nous aimerions avoir de vos nouvelles. Que vous soyez intéressé par le bénévolat, un partenariat ou simplement pour en savoir plus, contactez-nous et un membre de notre équipe vous répondra.',
          address: '123 Rue Communauté<br>Prospérité, USA 12345',
          email: 'hello@amplify.org',
          form: {
            name: 'Nom Complet',
            email: 'Courriel',
            subject: 'Sujet',
            message: 'Message',
            submit: 'Envoyer le Message',
            success: 'Merci ! Votre message a été envoyé. Nous vous contacterons bientôt.'
          }
        },
        footer: {
          copyright: '© 2025 Amplify. Tous droits réservés.'
        }
      });
      console.log('✅ Default French content created');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize database on startup
initializeDatabase();

// Helper function to read content
async function readContent() {
  try {
    const enContent = await Content.findOne({ language: 'en' }).lean();
    const frContent = await Content.findOne({ language: 'fr' }).lean();
    
    if (!enContent || !frContent) {
      throw new Error('Content not found in database');
    }
    
    return {
      en: enContent,
      fr: frContent
    };
  } catch (error) {
    console.error('Error reading content:', error);
    return null;
  }
}

// Helper function to write content
async function writeContent(content) {
  try {
    // Update English content
    if (content.en) {
      await Content.findOneAndUpdate(
        { language: 'en' },
        { ...content.en, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }
    
    // Update French content
    if (content.fr) {
      await Content.findOneAndUpdate(
        { language: 'fr' },
        { ...content.fr, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }
    
    return true;
  } catch (error) {
    console.error('Error writing content:', error);
    return false;
  }
}

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/admin/login');
}

// Routes

// Home page
app.get('/', async (req, res) => {
  const content = await readContent();
  const lang = req.query.lang || 'en';
  res.render('index', { content, lang });
});

// Admin login page
app.get('/admin/login', (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect('/admin');
  }
  res.render('admin-login', { error: null });
});

// Admin login POST
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const users = await readUsers();
  
  const user = users.find(u => u.username === username);
  
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.isAuthenticated = true;
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    res.redirect('/admin');
  } else {
    res.render('admin-login', { error: 'Invalid credentials' });
  }
});

// Admin logout
app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// Admin panel
app.get('/admin', isAuthenticated, async (req, res) => {
  const content = await readContent();
  res.render('admin-panel', { 
    content,
    user: req.session.user
  });
});

// User management page
app.get('/admin/users', isAuthenticated, async (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Access denied. Admin role required.');
  }
  const users = await readUsers();
  // Don't send passwords to the frontend
  const safeUsers = users.map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.render('admin-users', { users: safeUsers, user: req.session.user });
});

// API: Get users
app.get('/api/users', isAuthenticated, async (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  const users = await readUsers();
  const safeUsers = users.map(u => ({
    id: u.id,
    username: u.username,
    role: u.role,
    createdAt: u.createdAt
  }));
  res.json(safeUsers);
});

// API: Create user
app.post('/api/users', isAuthenticated, async (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  
  const { username, password, role } = req.body;
  
  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  const users = await readUsers();
  
  // Check if username already exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    password: await bcrypt.hash(password, 10),
    role,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  const success = await writeUsers(users);
  
  if (success) {
    res.json({ 
      success: true, 
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } else {
    res.status(500).json({ success: false, message: 'Failed to create user' });
  }
});

// API: Update user
app.put('/api/users/:id', isAuthenticated, async (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  
  const userId = parseInt(req.params.id);
  const { username, password, role } = req.body;
  
  const users = await readUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  // Check if new username conflicts with another user
  if (username && username !== users[userIndex].username) {
    if (users.find(u => u.username === username && u.id !== userId)) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }
    users[userIndex].username = username;
  }
  
  if (password) {
    users[userIndex].password = await bcrypt.hash(password, 10);
  }
  
  if (role) {
    users[userIndex].role = role;
  }
  
  const success = await writeUsers(users);
  
  if (success) {
    res.json({ 
      success: true, 
      message: 'User updated successfully',
      user: {
        id: users[userIndex].id,
        username: users[userIndex].username,
        role: users[userIndex].role,
        createdAt: users[userIndex].createdAt
      }
    });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
});

// API: Delete user
app.delete('/api/users/:id', isAuthenticated, async (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  
  const userId = parseInt(req.params.id);
  
  // Prevent deleting yourself
  if (userId === req.session.user.id) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
  }
  
  const users = await readUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  
  if (filteredUsers.length === users.length) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const success = await writeUsers(filteredUsers);
  
  if (success) {
    res.json({ success: true, message: 'User deleted successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
});

// API: Get content
app.get('/api/content', async (req, res) => {
  const content = await readContent();
  res.json(content);
});

// API: Update content
app.post('/api/content', isAuthenticated, async (req, res) => {
  const success = await writeContent(req.body);
  if (success) {
    res.json({ success: true, message: 'Content updated successfully' });
  } else {
    res.status(500).json({ success: false, message: 'Failed to update content' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin/login`);
  console.log(`Default credentials - Username: admin, Password: admin123`);
  console.log(`User management: http://localhost:${PORT}/admin/users`);
});