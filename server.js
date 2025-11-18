//server.js



const express = require('express');
const path = require('path');
const app = express();

// Debug bad route paths
const originalUse = app.use;
app.use = function (path, ...handlers) {
  if (typeof path === 'string' && path.includes('/:')) {
    console.log('❌ BAD ROUTE DETECTED:', path);
  } else if (typeof path === 'string') {
    console.log('✅ ROUTE:', path);
  }
  return originalUse.call(this, path, ...handlers);
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/restaurants', require('./api/restaurants'));
app.use('/api/location', require('./api/location'));
app.use('/api/cuisine', require('./api/cuisine'));
app.use('/api/search', require('./api/search'));

app.use((req, res, next) => {
  console.log('🛰️ Incoming Request:', req.method, req.url);
  next();
});


// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route
const fallbackPath = path.join(__dirname, 'public/html/index.html');
app.get('*', (req, res, next) => {
  if (
    req.path.startsWith('/api') || // Exclude API routes
    req.path.endsWith('.html') || // Exclude HTML files
    req.path.endsWith('.css') || // Exclude CSS files
    req.path.endsWith('.js') || // Exclude JS files
    req.path.endsWith('.jpg') || // Exclude image files
    req.path.endsWith('.ico') // Exclude favicon
  ) {
    return next(); // Let static middleware or other routes handle these requests
  }
  res.sendFile(fallbackPath, (err) => {
    if (err) {
      console.error('❌ Could not send index.html:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Log registered routes
console.log('🧩 All Registered Routes:');
app._router.stack.forEach((layer) => {
  if (layer.route?.path) {
    console.log('  ➤', layer.route.path);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
