const express = require('express');
const listEndpoints = require('express-list-endpoints');
const fs = require('fs');
const path = require('path');

// Import routes
const authRoutes      = require('../routes/authRoutes');
const conflictRoutes  = require('../routes/conflictRoutes');
const statsRoutes     = require('../routes/statsRoutes');
const adminRoutes     = require('../routes/adminRoutes');
const userRoutes      = require('../routes/userRoutes');
const searchRoutes    = require('../routes/searchRoutes');
const miscRoutes      = require('../routes/miscRoutes');
const jwtRoutes       = require('../routes/jwtRoutes');
const protectedRoutes = require('../routes/protectedRoutes');

const app = express();

// Mount routes
app.use('/api/v1/auth',      authRoutes);
app.use('/api/v1/conflicts', conflictRoutes);
app.use('/api/v1/stats',     statsRoutes);
app.use('/api/v1/admin',     adminRoutes);
app.use('/api/v1/users',     userRoutes);
app.use('/api/v1/search',    searchRoutes);
app.use('/api/v1/jwt',       jwtRoutes);
app.use('/api/v1/protected', protectedRoutes);
app.use('/api/v1',           miscRoutes);

const endpoints = listEndpoints(app);

const collection = {
  info: {
    name: "War Economic Impact API",
    description: "Comprehensive Postman collection for the War Economic Impact API with 150+ routes.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: [],
  variable: [
    {
      key: "baseUrl",
      value: "http://localhost:5000",
      type: "string"
    },
    {
      key: "token",
      value: "",
      type: "string"
    }
  ]
};

// Group by path segment (e.g., /api/v1/conflicts -> conflicts)
const groups = {};

endpoints.forEach(endpoint => {
  const pathParts = endpoint.path.split('/');
  // Usually ['', 'api', 'v1', 'group', ...]
  let groupName = "Misc";
  if (pathParts.length > 3) {
    groupName = pathParts[3];
  }

  if (!groups[groupName]) {
    groups[groupName] = [];
  }

  endpoint.methods.forEach(method => {
    // Generate a basic item
    let name = `${method} ${endpoint.path}`;
    
    let requestItem = {
      name: name,
      request: {
        method: method,
        header: [
          {
            key: "Authorization",
            value: "Bearer {{token}}",
            type: "text"
          }
        ],
        url: {
          raw: `{{baseUrl}}${endpoint.path}`,
          host: [
            "{{baseUrl}}"
          ],
          path: endpoint.path.split('/').filter(p => p !== '')
        }
      },
      response: []
    };

    // Add basic body for POST/PUT/PATCH
    if (["POST", "PUT", "PATCH"].includes(method)) {
      requestItem.request.body = {
        mode: "raw",
        raw: "{\n    \n}",
        options: {
          raw: {
            language: "json"
          }
        }
      };
    }

    // Attempt to extract query parameters if defined in the route.
    // express-list-endpoints doesn't list query params, but we can add placeholders for common ones.
    if (endpoint.path.includes('/search') || endpoint.path.includes('/stats') || endpoint.path.includes('/conflicts')) {
       if (method === "GET" && !endpoint.path.includes(':')) {
           // Provide common query params placeholders, disabled by default
           requestItem.request.url.query = [
               { key: "page", value: "1", disabled: true },
               { key: "limit", value: "10", disabled: true },
               { key: "sort", value: "-year", disabled: true },
               { key: "country", value: "", disabled: true },
               { key: "region", value: "", disabled: true }
           ];
       }
    }

    groups[groupName].push(requestItem);
  });
});

for (const [groupName, items] of Object.entries(groups)) {
  collection.item.push({
    name: groupName.charAt(0).toUpperCase() + groupName.slice(1),
    item: items
  });
}

const outputPath = path.join(__dirname, '..', 'War_Economic_Impact_API.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));

console.log(`Generated Postman collection with ${endpoints.length} routes at ${outputPath}`);
