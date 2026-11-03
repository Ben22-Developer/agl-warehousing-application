import { useState } from 'react'
import './ProductCarousel.css'

function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const products = [
    {
      id: 1,
      name: 'Industrial Forklift',
      category: 'Heavy Machinery',
      location: 'Warehouse A - Lagos',
      stock: 15,
      image: '🏭',
      likes: 234,
      description: 'High-capacity forklift for warehouse operations'
    },
    {
      id: 2,
      name: 'Storage Containers',
      category: 'Storage',
      location: 'Warehouse B - Accra',
      stock: 42,
      image: '📦',
      likes: 189,
      description: '40ft shipping containers for bulk storage'
    },
    {
      id: 3,
      name: 'Pallet Jacks',
      category: 'Equipment',
      location: 'Warehouse C - Nairobi',
      stock: 28,
      image: '🔧',
      likes: 156,
      description: 'Manual pallet jacks for material handling'
    },
    {
      id: 4,
      name: 'Safety Gear Set',
      category: 'Safety',
      location: 'Warehouse A - Lagos',
      stock: 100,
      image: '⛑️',
      likes: 312,
      description: 'Complete safety equipment package'
    },
    {
      id: 5,
      name: 'Conveyor Belt System',
      category: 'Automation',
      location: 'Warehouse D - Johannesburg',
      stock: 8,
      image: '🔄',
      likes: 267,
      description: 'Automated conveyor system for efficient logistics'
    }
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const currentProduct = products[currentIndex]

  return (
    <div className="carousel-container">
      <div className="carousel-header">
        <h2>Featured Products</h2>
        <p className="carousel-subtitle">Browse our warehouse inventory</p>
      </div>

      <div className="carousel">
        <button className="carousel-nav-btn prev" onClick={prevSlide}>
          ‹
        </button>

        <div className="carousel-content">
          <div className="product-card instagram-style">
            <div className="product-image">
              <span className="product-emoji">{currentProduct.image}</span>
            </div>
            
            <div className="product-info">
              <div className="product-header">
                <div className="product-avatar">🏢</div>
                <div className="product-details">
                  <span className="product-name">{currentProduct.name}</span>
                  <span className="product-location">{currentProduct.location}</span>
                </div>
              </div>

              <p className="product-description">{currentProduct.description}</p>

              <div className="product-stats">
                <div className="stat">
                  <span className="stat-icon">📦</span>
                  <span className="stat-value">Stock: {currentProduct.stock}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">🏷️</span>
                  <span className="stat-value">{currentProduct.category}</span>
                </div>
              </div>

              <div className="product-actions">
                <button className="action-btn like-btn">
                  ❤️ {currentProduct.likes}
                </button>
                <button className="action-btn comment-btn">
                  💬 Comment
                </button>
                <button className="action-btn share-btn">
                  📤 Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <button className="carousel-nav-btn next" onClick={nextSlide}>
          ›
        </button>
      </div>

      <div className="carousel-indicators">
        {products.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default ProductCarousel
