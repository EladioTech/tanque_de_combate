document.addEventListener('DOMContentLoaded', function () {
    const botonMenu = document.querySelector('.menu-toggle');
    const menuFlotante = document.querySelector('.menu-flotante');
    const enlacesMenu = document.querySelectorAll('.menu-flotante a');
    const secciones = document.querySelectorAll('section');

    // Mostrar/ocultar menú
    botonMenu.addEventListener('click', function (e) {
        e.stopPropagation();
        menuFlotante.classList.toggle('mostrar');
    });

    // Ocultar menú si clic fuera
    document.addEventListener('click', function (e) {
        if (!menuFlotante.contains(e.target) && !botonMenu.contains(e.target)) {
            menuFlotante.classList.remove('mostrar');
        }
    });

    // Cambiar sección al click en menú
    enlacesMenu.forEach(function (enlace) {
        enlace.addEventListener('click', function (e) {
            e.preventDefault();
            const idSeccion = enlace.getAttribute('href');

            secciones.forEach(s => s.classList.remove('active'));
            const seccionActiva = document.querySelector(idSeccion);
            if (seccionActiva) seccionActiva.classList.add('active');

            menuFlotante.classList.remove('mostrar');
        });
    });

    insertarJSONLD();
});

function generarJSONLDProductos() {
    const productos = [];
    document.querySelectorAll('.galeria-venta .cuadro').forEach(cuadro => {
        const nombre = cuadro.querySelector('.titulo-cuadro')?.textContent.trim() || '';
        const img = cuadro.querySelector('img')?.src || '';
        const descripcionPartes = [];

        cuadro.querySelectorAll('p:not(.titulo-cuadro)').forEach(p => {
            descripcionPartes.push(p.textContent.trim());
        });
        const descripcion = descripcionPartes.join(' • ');

        let precio = null;
        const precioMatch = nombre.match(/(\d+)\s*€/);
        if (precioMatch) {
            precio = precioMatch[1];
        }

        const producto = {
            "@type": "Product",
            "name": nombre.replace(/\d+\s*€/, '').trim(),
            "image": img,
            "description": descripcion,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
            }
        };

        if (precio) {
            producto.offers.price = precio;
        }

        productos.push(producto);
    });

    return {
        "@context": "https://schema.org",
        "@graph": productos
    };
}

function insertarJSONLD() {
    // Evita insertar si ya existe uno
    if (document.querySelector('script[type="application/ld+json"]')) return;
    const jsonLD = generarJSONLDProductos();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLD, null, 2);
    document.head.appendChild(script);
}



