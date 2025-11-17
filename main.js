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

// últimos cambios 17/11/2025

function mensajeDescarga() {
    alert("¡Gracias por tu interés! Tu dossier de ilustraciones se descargará automáticamente.");
}

function abrirYDscargarDossier(e) {
    e.preventDefault();

    const pdfURL = "Dossier_SantaCruz.pdf";  // ajusta si está en carpeta docs/

    // Mensaje de agradecimiento
    alert("¡Gracias por tu interés! Tu dossier de ilustraciones se abrirá ahora y se descargará automáticamente.");

    // Abrir en nueva pestaña
    window.open(pdfURL, "_blank");

    // Forzar descarga después de 1 segundo
    setTimeout(() => {
        const enlace = document.createElement("a");
        enlace.href = pdfURL;
        enlace.download = "Dossier_SantaCruz.pdf";
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
    }, 1000);
}

// Galería de servicios
const fotosServicios = {
    retratos: ["servicios/retratos1.webp", "servicios/retratos2.webp", "servicios/retratos3.webp"],
    cascos: ["servicios/casco1.webp", "servicios/casco2.webp", "servicios/casco3.webp"],
    faros: ["servicios/faros1.webp"],
    llantas: ["servicios/llantas1.webp"],
};

// Crear contenedor de galería dinámico
const galeriaServicios = document.createElement("div");
galeriaServicios.id = "galeria-servicios";
galeriaServicios.style.display = "none";
galeriaServicios.style.position = "fixed";
galeriaServicios.style.top = "0";
galeriaServicios.style.left = "0";
galeriaServicios.style.width = "100%";
galeriaServicios.style.height = "100%";
galeriaServicios.style.backgroundColor = "rgba(0,0,0,0.9)";
galeriaServicios.style.padding = "50px";
galeriaServicios.style.overflow = "auto";
galeriaServicios.style.zIndex = "1000";
galeriaServicios.style.textAlign = "center";
document.body.appendChild(galeriaServicios);

// Cerrar galería
const btnCerrar = document.createElement("button");
btnCerrar.textContent = "Cerrar";
btnCerrar.style.padding = "10px 20px";
btnCerrar.style.marginBottom = "20px";
btnCerrar.style.fontSize = "18px";
btnCerrar.style.cursor = "pointer";
btnCerrar.onclick = () => galeriaServicios.style.display = "none";
galeriaServicios.appendChild(btnCerrar);

const divImagenes = document.createElement("div");
galeriaServicios.appendChild(divImagenes);

// Eventos click en cada caja
document.querySelectorAll(".caja").forEach(caja => {
    caja.addEventListener("click", () => {
        const servicio = caja.dataset.servicio;
        divImagenes.innerHTML = ""; // limpiar galería
        fotosServicios[servicio].forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.style.width = "80%";       // ocupa el 80% del ancho de la ventana
            img.style.maxWidth = "1200px";  // no se haga gigantesca en pantallas muy grandes
            img.style.height = "auto";      // mantiene proporción
            img.style.margin = "20px 0";    // un poco más de margen
            img.style.border = "3px solid white";
            img.style.borderRadius = "10px";

            divImagenes.appendChild(img);
        });
        galeriaServicios.style.display = "block";
    });
});

