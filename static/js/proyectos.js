// proyectos.js
document.addEventListener('DOMContentLoaded', function() {
    // Filtros
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Aquí puedes agregar lógica de filtrado
            const filter = this.textContent;
            console.log('Filtrar por:', filter);
        });
    });
    
    // Botones de proyectos
    window.openProyecto = function(id) {
        console.log('Abriendo proyecto:', id);
        // Aquí iría la navegación a la página del proyecto
        // window.location.href = `/proyecto/${id}`;
    };
    
    window.contactar = function(id) {
        console.log('Contactar por proyecto:', id);
        // Aquí iría la navegación al formulario de contacto
        // window.location.href = `/contacto?proyecto=${id}`;
    };
    
    // Botón ver más
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.textContent = 'Cargando...';
            this.disabled = true;
            
            // Simular carga de más proyectos
            setTimeout(() => {
                this.textContent = 'Ver más proyectos';
                this.disabled = false;
                alert('Aquí se cargarían más proyectos desde el backend');
            }, 1500);
        });
    }
    
    // Botones de planes
    const planBtns = document.querySelectorAll('.plan-btn');
    planBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const plan = this.closest('.plan-card').querySelector('h4').textContent;
            alert(`Contratando ${plan}. Redirigiendo a pago...`);
            // window.location.href = `/pago?plan=${plan}`;
        });
    });
});