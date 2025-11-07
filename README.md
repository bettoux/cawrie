# Amplify Communities - Bilingual Landing Page

A fully responsive, bilingual (English/French) Node.js application for Amplify Communities with an admin panel for content management.

## Features

- ✅ **Bilingual Support**: Seamless switching between English and French
- ✅ **Admin Panel**: Easy-to-use interface for content management
- ✅ **User Management**: Create and manage multiple admin and editor accounts
- ✅ **Secure Authentication**: Password hashing with bcrypt
- ✅ **Role-Based Access**: Admin and Editor roles with different permissions
- ✅ **Secure Login**: Protected admin area with session management
- ✅ **Responsive Design**: Mobile-first design using Tailwind CSS
- ✅ **Interactive Canvas**: Animated particle background on hero section
- ✅ **JSON-based Content**: All content stored server-side in JSON format
- ✅ **Real-time Updates**: Content changes reflect immediately

## Project Structure

```
amplify-communities/
├── server.js                 # Main server file
├── content.json             # Bilingual content storage
├── package.json             # Dependencies
├── views/
│   ├── index.ejs           # Main landing page
│   ├── admin-login.ejs     # Admin login page
│   └── admin-panel.ejs     # Admin content editor
└── public/
    └── js/
        └── main.js         # Client-side JavaScript
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start the Server

For development (with auto-restart):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:3000`

## Default Login Credentials

⚠️ **IMPORTANT**: Change these in production!

- **Username**: `admin`
- **Password**: `admin123`

To change credentials, edit the `server.js` file:

```javascript
const ADMIN_USERNAME = 'your-username';
const ADMIN_PASSWORD = 'your-password';
```

## Usage

### Public Website

- Visit: `http://localhost:3000`
- Switch languages using the EN/FR button in the header
- Language preference is maintained via URL parameter (`?lang=en` or `?lang=fr`)

### Admin Panel

1. Navigate to: `http://localhost:3000/admin/login`
2. Enter admin credentials
3. Edit content for both English and French versions
4. Click "Save Changes" to update the website
5. Changes are immediately visible on the public site

### Admin Panel Features

- **Language Tabs**: Switch between English and French content
- **Organized Sections**: Edit navigation, hero, about, initiatives, contact, and footer
- **Form Validation**: All fields are required before saving
- **Success Notifications**: Visual confirmation when content is saved
- **Logout**: Secure logout functionality

## Content Management

All website content is stored in `content.json` with the following structure:

```json
{
  "en": {
    "nav": { ... },
    "hero": { ... },
    "about": { ... },
    "initiatives": { ... },
    "contact": { ... },
    "footer": { ... }
  },
  "fr": { ... }
}
```

You can edit this file directly or use the admin panel.

## Security Considerations

### For Production Deployment:

1. **Change Admin Credentials**: Update username/password in `server.js`
2. **Use Environment Variables**: Store sensitive data in `.env` file
3. **Enable HTTPS**: Set `cookie: { secure: true }` in session config
4. **Use a Database**: Replace JSON file with a proper database
5. **Hash Passwords**: Implement bcrypt or similar for password hashing
6. **Add Rate Limiting**: Prevent brute force attacks on login
7. **Update Session Secret**: Use a strong, random secret key

Example `.env` file:
```
PORT=3000
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-hashed-password
SESSION_SECRET=your-random-secret-key
NODE_ENV=production
```

## Customization

### Changing Colors

The site uses two main brand colors defined in Tailwind config:
- **Purple**: `brand-purple` (primary brand color)
- **Green**: `brand-green` (call-to-action buttons)

Edit the Tailwind configuration in `views/index.ejs` to customize colors.

### Adding New Sections

1. Add content structure to `content.json`
2. Update `views/index.ejs` to display the new section
3. Add corresponding fields to `views/admin-panel.ejs`
4. Update form handling in admin panel JavaScript

### Changing Fonts

The site uses Inter font from Google Fonts. To change:

1. Update the font import link in all EJS files
2. Modify the Tailwind font-family configuration
3. Update the CSS `body { font-family: ... }` rule

## Troubleshooting

### Port Already in Use

If port 3000 is occupied, change it in `server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Changed to 3001
```

### Content Not Saving

- Check file permissions on `content.json`
- Ensure the file is not read-only
- Check server console for error messages

### Admin Panel Not Loading

- Clear browser cache
- Check browser console for JavaScript errors
- Verify you're logged in (session may have expired)

### Language Switch Not Working

- Ensure URL parameter is being passed correctly
- Check browser console for errors
- Verify `content.json` has both `en` and `fr` sections

## API Endpoints

- `GET /` - Main landing page
- `GET /admin/login` - Admin login page
- `POST /admin/login` - Login authentication
- `GET /admin/logout` - Logout and destroy session
- `GET /admin` - Admin panel (requires authentication)
- `GET /api/content` - Get all content (JSON)
- `POST /api/content` - Update content (requires authentication)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is provided as-is for the Amplify Communities organization.

## Support

For issues or questions, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: November 2024