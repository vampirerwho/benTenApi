# 🧬 Ben 10 API

A fast, secure, and feature-rich REST API for exploring Ben 10 alien data. Built with **Express.js** and **MongoDB**, providing advanced search, filtering, and aggregation capabilities.

---

## ✨ Features

- ✅ **Advanced Search** - Full-text search across multiple fields
- ✅ **Smart Filtering** - Filter by species, homeworld, series, and more
- ✅ **Statistics & Analytics** - Get aggregated data about aliens, powers, and more
- ✅ **Flexible Sorting** - Sort by any field in ascending/descending order
- ✅ **Pagination** - Handle large datasets with cursor-based pagination
- ✅ **Security** - Rate limiting, CORS, XSS protection, and more
- ✅ **RESTful Design** - Intuitive and easy-to-use endpoints
- ✅ **Related Aliens** - Discover aliens from the same species or homeworld
- ✅ **Power & Homeworld Discovery** - Find aliens by their abilities or planetary origins
- ✅ **Field Selection** - Request only the fields you need

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd benTenApi

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/ben-ten
PORT=3000
NODE_ENV=development
EOF

# Seed database with alien data
npm run seed

# Start development server
npm run dev
```

### Production Deployment

```bash
# Start server
npm start
```

---

## 📚 API Endpoints

### Base URL

```
http://localhost:3000/api/v1/aliens
```

---

## 🎯 Core Endpoints

### 1️⃣ Get All Aliens

Retrieve all aliens without pagination. Perfect for getting the complete dataset at once.

**Endpoint:** `GET /`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sort` | string | name | Field to sort by (name, species, homeworld, \_id) |
| `order` | string | asc | Sort order (asc/desc) |
| `fields` | string | default | Comma-separated fields to return |
| `name` | string | - | Filter by alien name |
| `species` | string | - | Filter by species |
| `homeworld` | string | - | Filter by homeworld |
| `series` | string | - | Filter by series |

**Example Requests:**

```bash
# Get all aliens
curl "http://localhost:3000/api/v1/aliens"

# With filtering
curl "http://localhost:3000/api/v1/aliens?species=Pyronite"

# Custom sorting
curl "http://localhost:3000/api/v1/aliens?sort=species&order=desc"

# Select specific fields
curl "http://localhost:3000/api/v1/aliens?fields=name,slug,species"
```

**Response:**

```json
{
  "status": "success",
  "results": 61,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Heatblast",
      "slug": "heatblast",
      "species": "Pyronite",
      "homeworld": "Pyros",
      "series": ["Original Series", "Reboot"],
      "firstAppearance": "And Then There Were 10"
    }
  ]
}
```

---

### 2️⃣ Get All Aliens with Pagination

Retrieve aliens with pagination for better performance when handling subsets of data.

**Endpoint:** `GET /paginated`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 10 | Items per page (max 50) |
| `sort` | string | name | Field to sort by (name, species, homeworld, \_id) |
| `order` | string | asc | Sort order (asc/desc) |
| `fields` | string | default | Comma-separated fields to return |
| `name` | string | - | Filter by alien name |
| `species` | string | - | Filter by species |
| `homeworld` | string | - | Filter by homeworld |
| `series` | string | - | Filter by series |

**Example Requests:**

```bash
# First page with 10 items
curl "http://localhost:3000/api/v1/aliens/paginated?page=1&limit=10"

# With filtering and custom limit
curl "http://localhost:3000/api/v1/aliens/paginated?species=Pyronite&page=1&limit=20"

# Custom sorting with pagination
curl "http://localhost:3000/api/v1/aliens/paginated?sort=species&order=desc&limit=15"

# Select specific fields with pagination
curl "http://localhost:3000/api/v1/aliens/paginated?fields=name,slug,species&page=2"
```

**Response:**

```json
{
  "status": "success",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 61,
    "pages": 7
  },
  "results": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Heatblast",
      "slug": "heatblast",
      "species": "Pyronite",
      "homeworld": "Pyros",
      "series": ["Original Series", "Reboot"],
      "firstAppearance": "And Then There Were 10"
    }
  ]
}
```

---

### 3️⃣ Search Aliens

Perform a full-text search across multiple fields.

**Endpoint:** `GET /search`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | ✅ | Search query |
| `page` | number | - | Page number (default: 1) |
| `limit` | number | - | Items per page (max 50, default: 10) |

**Search Fields:**

- Name, Species, Homeworld, First Appearance, Powers, Weaknesses

**Example Requests:**

```bash
# Search for an alien
curl "http://localhost:3000/api/v1/aliens/search?q=heat"

# Search with pagination
curl "http://localhost:3000/api/v1/aliens/search?q=fire&page=1&limit=5"

# Search for power
curl "http://localhost:3000/api/v1/aliens/search?q=speed"
```

**Response:**

```json
{
  "status": "success",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "pages": 1
  },
  "results": 3,
  "searchQuery": "heat",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Heatblast",
      "slug": "heatblast",
      "species": "Pyronite",
      "homeworld": "Pyros",
      "image": ""
    }
  ]
}
```

---

### 4️⃣ Get Alien Statistics

Retrieve aggregated data including alien counts, top powers, species distribution, etc.

**Endpoint:** `GET /stats`

**Query Parameters:** None

**Example Request:**

```bash
curl "http://localhost:3000/api/v1/aliens/stats"
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "totalAliens": 25,
    "speciesByCount": [
      { "_id": "Pyronite", "count": 2 },
      { "_id": "Petrosapien", "count": 1 }
    ],
    "homeworldsByCount": [
      { "_id": "Pyros", "count": 2 },
      { "_id": "Petropia", "count": 1 }
    ],
    "seriesByCount": [
      { "_id": "Original Series", "count": 15 },
      { "_id": "Reboot", "count": 10 }
    ],
    "topPowers": [
      { "_id": "Flight", "count": 8 },
      { "_id": "Super strength", "count": 6 }
    ]
  }
}
```

---

### 5️⃣ Get Alien by Slug

Retrieve detailed information about a specific alien.

**Endpoint:** `GET /:slug`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | URL-friendly alien name (e.g., "heatblast") |

**Example Request:**

```bash
curl "http://localhost:3000/api/v1/aliens/heatblast"
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Heatblast",
    "slug": "heatblast",
    "species": "Pyronite",
    "homeworld": "Pyros",
    "powers": [
      "Fire manipulation",
      "Flight",
      "Pyrokinesis"
    ],
    "weaknesses": ["Water"],
    "series": ["Original Series", "Reboot"],
    "firstAppearance": "And Then There Were 10",
    "image": ""
  }
}
```

---

### 6️⃣ Get Related Aliens

Find aliens from the same species or homeworld.

**Endpoint:** `GET /:slug/related`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `slug` | string | Alien slug |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 5 | Maximum number of related aliens (max 10) |

**Example Request:**

```bash
curl "http://localhost:3000/api/v1/aliens/heatblast/related?limit=5"
```

**Response:**

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "alien": {
      "name": "Heatblast",
      "slug": "heatblast",
      "species": "Pyronite",
      "homeworld": "Pyros"
    },
    "relatedAliens": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Other Pyronite",
        "slug": "other-pyronite",
        "species": "Pyronite",
        "homeworld": "Pyros",
        "image": ""
      }
    ]
  }
}
```

---

### 7️⃣ Get Aliens by Power

Find all aliens with a specific power.

**Endpoint:** `GET /power/:power`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `power` | string | Power name (e.g., "flight", "speed") |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 50) |

**Example Requests:**

```bash
# Get all aliens with flight
curl "http://localhost:3000/api/v1/aliens/power/flight"

# With pagination
curl "http://localhost:3000/api/v1/aliens/power/fire?page=1&limit=5"
```

**Response:**

```json
{
  "status": "success",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "pages": 1
  },
  "results": 8,
  "searchPower": "flight",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Heatblast",
      "slug": "heatblast",
      "species": "Pyronite",
      "powers": [
        "Fire manipulation",
        "Flight",
        "Pyrokinesis"
      ],
      "image": ""
    }
  ]
}
```

---

### 8️⃣ Get Aliens by Homeworld

Find all aliens from a specific homeworld.

**Endpoint:** `GET /homeworld/:homeworld`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `homeworld` | string | Planet name (e.g., "pyros", "kinet") |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 50) |

**Example Request:**

```bash
curl "http://localhost:3000/api/v1/aliens/homeworld/pyros"
```

**Response:**

```json
{
  "status": "success",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  },
  "results": 2,
  "filterHomeworld": "pyros",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Heatblast",
      "slug": "heatblast",
      "species": "Pyronite",
      "homeworld": "Pyros",
      "image": ""
    }
  ]
}
```

---

### 9️⃣ Get Aliens by Series

Find all aliens from a specific series.

**Endpoint:** `GET /series/:series`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `series` | string | Series name (e.g., "original series", "reboot") |

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 50) |

**Example Request:**

```bash
curl "http://localhost:3000/api/v1/aliens/series/original%20series"
```

**Response:**

```json
{
  "status": "success",
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  },
  "results": 10,
  "filterSeries": "original series",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Heatblast",
      "slug": "heatblast",
      "species": "Pyronite",
      "homeworld": "Pyros",
      "series": ["Original Series"],
      "image": ""
    }
  ]
}
```

---

## 🔐 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured to allow cross-origin requests
- **Helmet**: Sets various HTTP headers for security
- **XSS Protection**: Cleans user input to prevent XSS attacks
- **HPP Protection**: Prevents HTTP Parameter Pollution
- **JSON Size Limit**: Limited to 10KB to prevent large payloads
- **Request Logging**: Morgan middleware logs all requests

---

## 📋 Query Examples

### Find all Pyronites with pagination

```bash
curl "http://localhost:3000/api/v1/aliens?species=Pyronite&page=1&limit=5"
```

### Search for "speed" and get only name and slug

```bash
curl "http://localhost:3000/api/v1/aliens/search?q=speed&fields=name,slug"
```

### Get all aliens sorted by species in descending order

```bash
curl "http://localhost:3000/api/v1/aliens?sort=species&order=desc&limit=20"
```

### Find aliens with flight power from original series

```bash
curl "http://localhost:3000/api/v1/aliens/power/flight?page=1&limit=10"
```

### Get related aliens and limit to 3 results

```bash
curl "http://localhost:3000/api/v1/aliens/heatblast/related?limit=3"
```

### Get stats about all aliens

```bash
curl "http://localhost:3000/api/v1/aliens/stats"
```

---

## 📊 Data Model

### Alien Schema

```javascript
{
  _id: ObjectId,
  name: String,                    // Unique alien name
  slug: String,                    // URL-friendly identifier (unique)
  species: String,                 // Alien species
  homeworld: String,               // Planet of origin
  powers: [String],                // Array of abilities
  weaknesses: [String],            // Array of weaknesses
  series: [String],                // Array of show appearances
  firstAppearance: String,         // Episode name of debut
  image: String                    // Image URL (optional)
}
```

---

## 🛠️ Development

### Project Structure

```
benTenApi/
├── index.js                 # Entry point
├── package.json             # Dependencies
├── seed.js                  # Database seeding script
├── data/
│   └── aliens.json          # Raw alien data
├── src/
│   ├── app.js               # Express setup
│   ├── server.js            # Server configuration
│   ├── controllers/
│   │   └── alienController.js   # Business logic
│   ├── models/
│   │   └── alienModel.js        # MongoDB schema
│   └── routes/
│       └── alienRoutes.js       # API endpoints
└── README.md                # This file
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/ben-ten
PORT=3000
NODE_ENV=development
```

### Scripts

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Seed database
npm run seed
```

---

## 🚨 Error Handling

### Common Error Responses

**400 Bad Request** - Missing required parameters

```json
{
  "status": "error",
  "message": "Search query parameter 'q' is required"
}
```

**404 Not Found** - Resource doesn't exist

```json
{
  "status": "fail",
  "message": "Alien not found"
}
```

**500 Internal Server Error** - Server error

```json
{
  "status": "error",
  "message": "Failed to fetch aliens",
  "error": "..." // Only in development mode
}
```

---

## 📈 Performance Notes

- **Pagination**: Always paginate large result sets to improve performance
- **Field Selection**: Use the `fields` parameter to request only needed data
- **Caching**: Frontend applications should implement caching for stats and search results
- **Rate Limiting**: Be mindful of rate limits; spread requests over time
- **Text Search**: The `/search` endpoint uses regex and works best with indexed fields

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Future Enhancements

- [ ] Authentication & Authorization
- [ ] Advanced filtering with operators ($gt, $lt, $in, etc.)
- [ ] Caching layer (Redis)
- [ ] GraphQL support
- [ ] Database indexing optimization
- [ ] API versioning
- [ ] Comprehensive test suite
- [ ] API documentation with Swagger/OpenAPI
- [ ] Webhooks for data updates
- [ ] Export to CSV/JSON functionality

---

## 📄 License

ISC License - feel free to use this project for your own purposes!

---

## 🎯 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy exploring the Ben 10 Universe! 🧬👽**
