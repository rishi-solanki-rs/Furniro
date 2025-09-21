import React from 'react';

const ProductCard = ({ product, onUpdateClick, onDeleteClick }) => {
    const formatPrice = (p) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(p);

    return (
        <div className="product-card">
            <div className="product-card-image-wrapper">
                <img src={product.image} alt={product.name} className="product-card-image" />
                {product.tag && <span className={`product-card-tag ${product.tag.toLowerCase()}`}>{product.tag}</span>}
            </div>
            <div className="product-card-info">
                <h3>{product.name}</h3>
                <p className="product-card-category">{product.category}</p>
                <div className="product-card-price"
                style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
                >
                    {formatPrice(product.price)}
                    {product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}
                </div>
            </div>
            <div className="card-overlay">
                <button className="overlay-btn">Add to cart</button>
                <div className="overlay-actions">
                    <button onClick={() => onUpdateClick(product)}>✏️ Update</button>
                    <button onClick={() => onDeleteClick(product.id)}>🗑️ Delete</button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;