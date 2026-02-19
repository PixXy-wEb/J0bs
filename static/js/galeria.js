document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const searchInput = document.getElementById('searchInput');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxMediaContainer = document.getElementById('lightboxMediaContainer');
    const closeLightbox = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentLightboxIndex = 0;
    let currentFilter = 'all';
    let currentSearchTerm = '';

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            filterGallery();
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearchTerm = this.value.toLowerCase().trim();
            filterGallery();
        });
    }

    function filterGallery() {
        let visibleCount = 0;
        
        galleryItems.forEach(item => {
            const categories = item.dataset.category.split(' ');
            const title = item.querySelector('.gallery-title').textContent.toLowerCase();
            const desc = item.querySelector('.gallery-desc').textContent.toLowerCase();
            
            // Check category filter
            const matchesCategory = currentFilter === 'all' || categories.includes(currentFilter);
            
            // Check search term
            const matchesSearch = currentSearchTerm === '' || 
                                title.includes(currentSearchTerm) || 
                                desc.includes(currentSearchTerm);
            
            if (matchesCategory && matchesSearch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show "no results" message if needed
        const grid = document.getElementById('galleryGrid');
        const existingMessage = document.querySelector('.no-results');
        
        if (visibleCount === 0) {
            if (!existingMessage) {
                const noResults = document.createElement('div');
                noResults.className = 'no-results';
                noResults.textContent = 'No se encontraron proyectos que coincidan con tu búsqueda.';
                grid.appendChild(noResults);
            }
        } else if (existingMessage) {
            existingMessage.remove();
        }
    }

    // Lightbox functionality
    window.openLightboxByIndex = function(index) {
        const visibleItems = Array.from(galleryItems).filter(item => 
            item.style.display !== 'none'
        );
        
        if (visibleItems.length === 0) return;
        
        // Find the actual index in visible items
        const targetItem = visibleItems[index];
        const actualIndex = Array.from(galleryItems).indexOf(targetItem);
        openLightbox(actualIndex);
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    function openLightbox(index) {
        const item = galleryItems[index];
        if (!item || item.style.display === 'none') return;
        
        currentLightboxIndex = index;
        
        const img = item.querySelector('.gallery-image');
        const title = item.querySelector('.gallery-title').textContent;
        const desc = item.querySelector('.gallery-desc').textContent;
        const date = item.querySelector('.gallery-date').textContent;
        const views = item.querySelector('.gallery-views').textContent;
        const tags = Array.from(item.querySelectorAll('.gallery-tag')).map(tag => tag.textContent);
        const type = item.dataset.type;
        
        // Set media
        if (type === 'video') {
            lightboxMediaContainer.innerHTML = `
                <video controls autoplay>
                    <source src="${img.src}" type="video/mp4">
                    Tu navegador no soporta el elemento de video.
                </video>
            `;
        } else {
            lightboxMediaContainer.innerHTML = `<img src="${img.src}" alt="${title}">`;
        }
        
        // Set info
        document.getElementById('lightboxTitle').textContent = title;
        document.getElementById('lightboxDesc').textContent = desc;
        document.getElementById('lightboxDate').textContent = date;
        document.getElementById('lightboxViews').textContent = views;
        
        const tagsContainer = document.getElementById('lightboxTags');
        tagsContainer.innerHTML = tags.map(tag => `<span>${tag}</span>`).join('');
        
        lightboxModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeLightboxFunc() {
        lightboxModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Stop video if playing
        const video = lightboxMediaContainer.querySelector('video');
        if (video) video.pause();
    }

    function navigateLightbox(direction) {
        const visibleItems = Array.from(galleryItems).filter(item => 
            item.style.display !== 'none'
        );
        
        if (visibleItems.length === 0) return;
        
        // Find current visible index
        const currentVisibleIndex = visibleItems.indexOf(galleryItems[currentLightboxIndex]);
        
        let newVisibleIndex;
        if (direction === 'next') {
            newVisibleIndex = (currentVisibleIndex + 1) % visibleItems.length;
        } else {
            newVisibleIndex = (currentVisibleIndex - 1 + visibleItems.length) % visibleItems.length;
        }
        
        // Convert back to global index
        const newGlobalIndex = Array.from(galleryItems).indexOf(visibleItems[newVisibleIndex]);
        openLightbox(newGlobalIndex);
    }

    // Event listeners
    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeLightboxFunc);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateLightbox('prev'));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateLightbox('next'));
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightboxModal.classList.contains('show')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightboxFunc();
                break;
            case 'ArrowLeft':
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                navigateLightbox('next');
                break;
        }
    });

    // Close on outside click
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            closeLightboxFunc();
        }
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('.gallery-image[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});