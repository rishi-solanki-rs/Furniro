import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import Pagination from './components/Pagination';
import './App.css';

const API_URL = 'https://furniro-shop-backend.onrender.com/api/products';

function App() {
    // State management
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0); // State to hold total number of products

    // Filter and Sort State
    const [filters, setFilters] = useState({ name: '', category: '', price_min: '', price_max: '' });
    const [sort, setSort] = useState({ sortBy: 'default', order: 'asc' });
    const [limit, setLimit] = useState(10); // State for items per page
    const [isFilterVisible, setIsFilterVisible] = useState(false); // **NEW: State for filter visibility**

    const fetchProducts = useCallback(async () => {
        try {
            const activeFilters = { ...filters };
            // Ensure we don't send an invalid sortBy value
            const activeSort = sort.sortBy === 'default' ? {} : sort;

            const params = {
                page: currentPage,
                limit,
                ...activeFilters,
                ...activeSort
            };
            const response = await axios.get(API_URL, { params });
            console.log("Fetched products:", response.data);
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
            setTotalItems(response.data.totalItems); // Set total items from API
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }, [currentPage, filters, sort, limit]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        const [sortBy, order] = e.target.value.split('-');
        setSort({ sortBy, order });
        setCurrentPage(1);
    };
    
    const handleLimitChange = (e) => {
        setLimit(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) setCurrentPage(page);
    };

    // CRUD Handlers
    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);
    const handleFormSubmit = async (productData) => {
        await (editingProduct ? axios.put(`${API_URL}/${editingProduct.id}`, productData) : axios.post(API_URL, productData));
        fetchProducts();
        handleCloseModal();
    };
    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure?")) {
            await axios.delete(`${API_URL}/${productId}`);
            fetchProducts();
        }
    };
    
    // Calculate the range of items being shown
    const firstItem = totalItems > 0 ? (currentPage - 1) * limit + 1 : 0;
    const lastItem = Math.min(currentPage * limit, totalItems);

    return (
        <div className="app">
            <Header />
            <div className="shop-banner"><h1>Shop</h1><p>Home &gt; Shop</p></div>

            {/* --- UPDATED FILTER BAR --- */}
            <div className="filter-bar">
                <div className="filter-bar-left">
                    <button className="filter-toggle-btn" onClick={() => setIsFilterVisible(!isFilterVisible)}>
                        <span className="filter-icon"></span> Filter
                    </button>
                    <span className="results-text">Showing {firstItem}–{lastItem} of {totalItems} results</span>
                </div>
                
                <div className="filter-bar-right">
                    <button className="add-product-btn" onClick={() => handleOpenModal()}>Add Product</button>
                    <div className="control-group">
                        <label htmlFor="show-limit">Show</label>
                        <input id="show-limit" type="number" value={limit} onChange={handleLimitChange} className="show-input"/>
                    </div>
                    <div className="control-group">
                        <label htmlFor="sort-by">Short by</label>
                        <select id="sort-by" onChange={handleSortChange} value={sort.sortBy === 'default' ? 'default-asc' : `${sort.sortBy}-${sort.order}`} className="sort-select">
                            <option value="default-asc">Default</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="price-asc">Price (Low to High)</option>
                            <option value="price-desc">Price (High to Low)</option>
                        </select>
                    </div>
                </div>
            </div>

     {/* --- NEW: COLLAPSIBLE FILTER INPUTS --- */}
            {isFilterVisible && (
                <div className="filter-inputs-container">
                    <input type="text" name="name" placeholder="Filter by name..." value={filters.name} onChange={handleFilterChange} />
                    <input type="text" name="category" placeholder="Filter by category..." value={filters.category} onChange={handleFilterChange} />
                    <input type="number" name="price_min" placeholder="Min Price" value={filters.price_min} onChange={handleFilterChange} />
                    <input type="number" name="price_max" placeholder="Max Price" value={filters.price_max} onChange={handleFilterChange} />
                </div>
            )}
            
            <main className="container">
                <div className="product-grid">
                    {products.length > 0 ? products.map(p => <ProductCard key={p.id} product={p} onUpdateClick={handleOpenModal} onDeleteClick={handleDeleteProduct} />) : <p>No products found.</p>}
                </div>
                {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
            </main>
            <ProductModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleFormSubmit} product={editingProduct} />
            <footer className="features">
    <div className="feature-item">
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23333' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M8 21l8 0' /><path d='M12 17l0 4' /><path d='M7 4l10 0' /><path d='M17 4v8a5 5 0 0 1 -10 0v-8' /><path d='M5 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' /><path d='M19 9m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' /></svg>" alt="High Quality Icon" className="feature-icon" />
        <div className="feature-text">
            <h4>High Quality</h4>
            <p>crafted from top materials</p>
        </div>
    </div>
    <div className="feature-item">
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23333' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M9 12l2 2l4 -4' /><path d='M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3' /></svg>" alt="Warranty Protection Icon" className="feature-icon" />
        <div className="feature-text">
            <h4>Warranty Protection</h4>
            <p>Over 2 years</p>
        </div>
    </div>
    <div className="feature-item">
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23333' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' /><path d='M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' /><path d='M5 17l-2 0l0 -11l18 0l0 11l-2 0' /><path d='M9 17l8 0' /><path d='M9 11l0 -6l6 0' /></svg>" alt="Free Shipping Icon" className="feature-icon" />
        <div className="feature-text">
            <h4>Free Shipping</h4>
            <p>Order over 150 $</p>
        </div>
    </div>
    <div className="feature-item">
        <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23333' fill='none' stroke-linecap='round' stroke-linejoin='round'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M18 6l-2 0' /><path d='M8 6l6 0' /><path d='M13 11l0 -5' /><path d='M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7' /><path d='M21 10h-18' /><path d='M5 16l0 2.5' /><path d='M19 16l0 2.5' /></svg>" alt="24/7 Support Icon" className="feature-icon" />
        <div className="feature-text">
            <h4>24 / 7 Support</h4>
            <p>Dedicated support</p>
        </div>
    </div>
</footer>
        </div>
    );
}

export default App;