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

    // GESTIÓN DE ENLACES DEL MENÚ - VERSIÓN DEFINITIVA
    enlacesMenu.forEach(function (enlace) {
        enlace.addEventListener('click', function (e) {
            const href = enlace.getAttribute('href');

            // CASO 1: Enlace de Google Drive (CRM) - CON MENSAJE DE CORTESÍA
            if (href && href.includes('drive.google.com')) {
                console.log("🔗 Click en CRM - mostrando mensaje");

                // Prevenimos temporalmente para mostrar el mensaje
                e.preventDefault();

                // Mostrar mensaje amigable
                alert("📢 ¡Gracias por tu interés en CRM Vivienda!\n\nSerás redirigido a Google Drive para iniciar la descarga.\n\nEl archivo pesa 94MB, así que puede tardar unos segundos.");

                // Abrir el enlace después del mensaje
                window.open(href, '_blank');

                // Cerrar el menú
                menuFlotante.classList.remove('mostrar');

                return; // Salimos
            }

            // CASO 2: Enlace del dossier PDF (tiene onclick)
            if (enlace.getAttribute('onclick')) {
                console.log("📘 Click en Dossier");
                menuFlotante.classList.remove('mostrar');
                return; // Dejamos que su función maneje el clic
            }

            // CASO 3: Enlaces internos (empiezan con #)
            if (href && href.startsWith('#')) {
                console.log("📍 Click en enlace interno:", href);
                e.preventDefault(); // Solo prevenimos para estos

                // Buscar la sección por su ID
                try {
                    const seccionActiva = document.querySelector(href);
                    if (seccionActiva) {
                        secciones.forEach(s => s.classList.remove('active'));
                        seccionActiva.classList.add('active');
                    } else {
                        console.warn("⚠️ No se encontró la sección:", href);
                    }
                } catch (error) {
                    console.error("❌ Error con selector:", href, error);
                }

                menuFlotante.classList.remove('mostrar');
            }
        });
    });

    insertarJSONLD();
});

// ===== TUS FUNCIONES EXISTENTES (NO CAMBIAN) =====

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
    if (document.querySelector('script[type="application/ld+json"]')) return;
    const jsonLD = generarJSONLDProductos();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLD, null, 2);
    document.head.appendChild(script);
}

function mensajeDescarga() {
    alert("¡Gracias por tu interés! Tu dossier de ilustraciones se descargará automáticamente.");
}

function abrirYDscargarDossier(e) {
    e.preventDefault();
    const pdfURL = "Dossier_SantaCruz.pdf";
    alert("¡Gracias por tu interés! Tu dossier de ilustraciones se abrirá ahora y se descargará automáticamente.");
    window.open(pdfURL, "_blank");
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
    retratos: ["servicios/madre-de-luz-arte-religioso-santacruz.webp", "servicios/papa-francisco-humildad-cercania-santacruz.webp", "servicios/santa-claus-alegria-esperanza-navidad-santacruz.webp"],
    cascos: ["servicios/sonic-casco-retro-alan-prost-aerografia79.webp", "servicios/indio-atletico-de-madrid-aerografia79.webp", "servicios/casco-de-moto-personalizado-chicago-bull-aerografia79.webp"],
    faros: ["servicios/lacado-faro-trasero-de-coche-aerografia79.webp"],
    llantas: ["servicios/pintado-de-llantas-rm-azul-oviedo-aerografia79.webp"],
};

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

document.querySelectorAll(".caja").forEach(caja => {
    caja.addEventListener("click", () => {
        const servicio = caja.dataset.servicio;
        divImagenes.innerHTML = "";
        fotosServicios[servicio].forEach(src => {
            const img = document.createElement("img");
            img.src = src;
            img.style.width = "80%";
            img.style.maxWidth = "1200px";
            img.style.height = "auto";
            img.style.margin = "20px 0";
            img.style.border = "3px solid white";
            img.style.borderRadius = "10px";
            divImagenes.appendChild(img);
        });
        galeriaServicios.style.display = "block";
    });
});