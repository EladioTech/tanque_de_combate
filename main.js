// ===== GALERÍA DE SERVICIOS =====
const fotosServicios = {
    retratos: [
        "servicios/madre-de-luz-arte-religioso-santacruz.webp",
        "servicios/papa-francisco-humildad-cercania-santacruz.webp",
        "servicios/santa-claus-alegria-esperanza-navidad-santacruz.webp"
    ],
    cascos: [
        "servicios/sonic-casco-retro-alan-prost-aerografia79.webp",
        "servicios/indio-atletico-de-madrid-aerografia79.webp",
        "servicios/casco-de-moto-personalizado-chicago-bull-aerografia79.webp"
    ],
    faros: [
        "servicios/lacado-faro-trasero-de-coche-aerografia79.webp"
    ],
    llantas: [
        "servicios/pintado-de-llantas-rm-azul-oviedo-aerografia79.webp"
    ],
};

// ===== CREAR GALERÍA OVERLAY =====
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

// ===== MAIN =====
document.addEventListener('DOMContentLoaded', function () {

    console.log("LIGHTBOX JS CARGADO ✔");

    const botonMenu = document.querySelector('.menu-toggle');
    const menuFlotante = document.querySelector('.menu-flotante');
    const enlacesMenu = document.querySelectorAll('.menu-flotante a');
    const secciones = document.querySelectorAll('section');

    // ===== LIGHTBOX =====
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    function abrirLightbox(src) {
        lightboxImg.src = src;
        lightbox.style.display = "flex";
    }

    function cerrarLightbox() {
        lightbox.style.display = "none";
        lightboxImg.src = "";
    }

    lightbox.addEventListener("click", cerrarLightbox);

    // ===== CAJAS (SERVICIOS) =====
    document.querySelectorAll(".caja").forEach(caja => {
        caja.addEventListener("click", () => {

            const tipo = caja.dataset.servicio;
            const imagenes = fotosServicios[tipo];

            if (!imagenes) return;

            divImagenes.innerHTML = "";

            imagenes.forEach(src => {
                const img = document.createElement("img");
                img.src = src;
                img.style.width = "300px";
                img.style.margin = "10px";
                img.style.cursor = "pointer";

                img.addEventListener("click", (e) => {
                    e.stopPropagation();

                    // 🔥 cerrar galería + abrir fullscreen
                    galeriaServicios.style.display = "none";
                    abrirLightbox(src);
                });

                divImagenes.appendChild(img);
            });

            galeriaServicios.style.display = "block";
        });
    });

    // ===== A LA VENTA =====
    document.querySelectorAll(".galeria-venta img").forEach(img => {
        img.addEventListener("click", () => {
            abrirLightbox(img.src);
        });
    });

    // ===== MENÚ =====
    botonMenu.addEventListener('click', function (e) {
        e.stopPropagation();
        menuFlotante.classList.toggle('mostrar');
    });

    document.addEventListener('click', function (e) {
        if (!menuFlotante.contains(e.target) && !botonMenu.contains(e.target)) {
            menuFlotante.classList.remove('mostrar');
        }
    });

    enlacesMenu.forEach(function (enlace) {
        enlace.addEventListener('click', function (e) {

            const href = enlace.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();

                const seccionActiva = document.querySelector(href);
                if (seccionActiva) {
                    secciones.forEach(s => s.classList.remove('active'));
                    seccionActiva.classList.add('active');
                }

                menuFlotante.classList.remove('mostrar');
            }
        });
    });

    insertarJSONLD();
});

// ===== FUNCIONES EXISTENTES =====

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

        const producto = {
            "@type": "Product",
            "name": nombre,
            "image": img,
            "description": descripcion,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "EUR",
                "availability": "https://schema.org/InStock"
            }
        };

        productos.push(producto);
    });

    return {
        "@context": "https://schema.org",
        "@graph": productos
    };
}

function insertarJSONLD() {
    if (document.querySelector('script[type="application/ld+json"]')) return;

    const jsonLD = generarJSONLDProductos();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLD, null, 2);
    document.head.appendChild(script);
}