const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;
const allowedOrigins = ['https://furniro-shop-frontend.onrender.com/', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
app.use(cors(corsOptions));
app.use(express.json());

// In-memory product database
let products = [
   { id: 1, name: 'Syltherine', category: 'Stylish cafe chair', price: 2500000, oldPrice: 3500000, tag: '-30%', image: '/images/chair.png' },
    { id: 2, name: 'Leviosa', category: 'Stylish cafe chair', price: 2500000, image: '/images/chair.png' },
    { id: 3, name: 'Lolito', category: 'Luxury big sofa', price: 7000000, oldPrice: 14000000, tag: '-50%', image: '/images/sofa.png' },
    { id: 4, name: 'Respira', category: 'Outdoor bar table', price: 500000, tag: 'New', image: '/images/table.png' },
    { id: 5, name: 'Grifo', category: 'Night lamp', price: 1500000, image: '/images/tabel2.jpg' },
    { id: 6, name: 'Muggo', category: 'Small mug', price: 150000, tag: 'New', image: '/images/chair.png' },
    { id: 7, name: 'Pingky', category: 'Cute bed set', price: 7000000, oldPrice: 14000000, tag: '-50%', image: '/images/sofa.png' },
    { id: 8, name: 'Potty', category: 'Minimalist flower pot', price: 500000, tag: 'New', image: '/images/table.png' },
    { id: 9, name: 'Syltherine 2', category: 'Stylish cafe chair', price: 2800000, oldPrice: 3600000, tag: '-30%', image: '/images/chair.png' },
    { id: 10, name: 'Leviosa 2', category: 'Stylish cafe chair', price: 2200000, image: '/images/chair.png' },
    { id: 11, name: 'Lolito 2', category: 'Luxury big sofa', price: 7500000, oldPrice: 15000000, tag: '-50%', image: '/images/sofa.png' },
    { id: 12, name: 'Respira 2', category: 'Outdoor bar table', price: 600000, tag: 'New', image: '/images/table.png' },
    { id: 13, name: 'Grifo 2', category: 'Night lamp', price: 1700000, image: '/images/tabel2.jpg' },
    { id: 14, name: 'Muggo 2', category: 'Small mug', price: 250000, tag: 'New', image: '/images/chair.png' },
    { id: 15, name: 'Pingky 2', category: 'Cute bed set', price: 7200000, oldPrice: 14500000, tag: '-50%', image: '/images/sofa.png' },
    { id: 16, name: 'Potty 2', category: 'Minimalist flower pot', price: 550000, tag: 'New', image: '/images/table.png' },
    { id: 17, name: 'Elegant Table', category: 'Dining furniture', price: 12000000, image: '/images/table.png' },
    { id: 18, name: 'Cozy Armchair', category: 'Living room chair', price: 4500000, tag: 'New', image: '/images/chair.png' },
    { id: 19, name: 'Modern Bookshelf', category: 'Storage', price: 3200000, image: '/images/sofa.png' },
    { id: 20, name: 'Simple Desk', category: 'Office furniture', price: 1800000, image: '/images/table.png' },
];
let nextProductId = 21;
function getImage(id){
    if(id%4===1) return '/images/chair.png';
    if(id%4===2) return '/images/sofa.png';
    if(id%4===3) return '/images/table.png';
    if(id%4===0) return '/images/tabel2.jpg';
    return '/images/chair.png';
}
// GET Products Endpoint
app.get('/api/products', (req, res) => {
    let results = [...products];
    let totalItems = results.length;
    const { category, name, price_min, price_max, sortBy, order = 'asc' } = req.query;

    // Server-Side Filtering
    if (name) results = results.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
    if (category) results = results.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
    if (price_min) results = results.filter(p => p.price >= parseInt(price_min));
    if (price_max) results = results.filter(p => p.price <= parseInt(price_max));

    // Server-Side Sorting
    if (sortBy) {
        results.sort((a, b) => {
            if (sortBy === 'price') return order === 'asc' ? a.price - b.price : b.price - a.price;
            if (sortBy === 'name') return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            return 0;
        });
    }

    // Server-Side Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    res.json({
        products: paginatedResults,
        totalPages: Math.ceil(results.length / limit),
        currentPage: page,
        totalItems,
        filterItems: results.length
    });
});

// CRUD Endpoints
app.post('/api/products', (req, res) => {
    const newProduct = { id: nextProductId, ...req.body, image: getImage(nextProductId) };
    nextProductId++;
    products.unshift(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
        products[index] = { ...products[index], ...req.body };
        res.json(products[index]);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    products = products.filter(p => p.id !== id);
    res.status(200).json({ message: 'Product deleted' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
