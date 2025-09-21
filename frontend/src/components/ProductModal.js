import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, onSubmit, product }) => {
    const initialFormState = { name: '', category: '', price: '', oldPrice: '', tag: '' };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setFormData(product ? { ...product } : initialFormState);
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>{product ? 'Update Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="modal-form">
                    <input type="text" name="name" placeholder="Name" value={formData.name || ''} onChange={handleChange} required />
                    <input type="text" name="category" placeholder="Category" value={formData.category || ''} onChange={handleChange} required />
                    <input type="number" name="price" placeholder="Price" value={formData.price || ''} onChange={handleChange} required />
                    <input type="number" name="oldPrice" placeholder="Old Price (Optional)" value={formData.oldPrice || ''} onChange={handleChange} />
                    <input type="text" name="tag" placeholder="Tag (e.g. -30% or New)" value={formData.tag || ''} onChange={handleChange} />
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                        <button type="submit" className="submit-btn">{product ? 'Update' : 'Add Product'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;