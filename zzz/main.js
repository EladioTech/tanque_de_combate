document.addEventListener('DOMContentLoaded', function () {
    const botonMenu = document.querySelector('.menu-toggle');
    const menuFlotante = document.querySelector('.menu-flotante');
    const enlacesMenu = document.querySelectorAll('.menu-flotante a');
    const secciones = document.querySelectorAll('section');

    // Mostrar/ocultar el menú al hacer clic en el botón
    botonMenu.addEventListener('click', function (e) {
        e.stopPropagation(); // Evita que el clic se propague al documento
        menuFlotante.classList.toggle('mostrar'); // Alterna la visibilidad del menú
    });

    // Ocultar el menú si se hace clic fuera de él
    document.addEventListener('click', function (e) {
        if (!menuFlotante.contains(e.target) && !botonMenu.contains(e.target)) {
            menuFlotante.classList.remove('mostrar'); // Oculta el menú
        }
    });

    // Cierra el menú al hacer clic en una opción del menú (después de un pequeño retardo)
    enlacesMenu.forEach(function (enlace) {
        enlace.addEventListener('click', function (e) {
            // Evita que se recargue la página
            e.preventDefault();
            
            // Obtener el id de la sección a la que corresponde el enlace
            const idSeccion = enlace.getAttribute('href');

            // Ocultar todas las secciones
            secciones.forEach(function (seccion) {
                seccion.classList.remove('active');
            });

            // Mostrar la sección correspondiente
            const seccionActiva = document.querySelector(idSeccion);
            if (seccionActiva) {
                seccionActiva.classList.add('active');
            }

            // Ocultar el menú
            menuFlotante.classList.remove('mostrar');
        });
    });
});
