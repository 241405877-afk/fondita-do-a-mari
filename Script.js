const WHATSAPP = "523411189076";

let carrito = [];

const listaCarrito = document.getElementById("listaCarrito");
const totalElemento = document.getElementById("total");
const subtotalElemento = document.getElementById("subtotal");
const cantidadProductos = document.getElementById("cantidadProductos");

function formatoPrecio(precio) {
    return precio.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

function agregar(nombre, precio) {
    const productoExistente = carrito.find(
        producto => producto.nombre === nombre
    );

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    actualizarCarrito();
}

function cambiarCantidad(nombre, cambio) {
    const producto = carrito.find(
        elemento => elemento.nombre === nombre
    );

    if (!producto) return;

    producto.cantidad += cambio;

    if (producto.cantidad <= 0) {
        carrito = carrito.filter(
            elemento => elemento.nombre !== nombre
        );
    }

    actualizarCarrito();
}

function quitarProducto(nombre) {
    carrito = carrito.filter(
        producto => producto.nombre !== nombre
    );

    actualizarCarrito();
}

function actualizarCarrito() {
    const unidades = carrito.reduce(
        (suma, producto) => suma + producto.cantidad,
        0
    );

    const total = carrito.reduce(
        (suma, producto) => suma + producto.precio * producto.cantidad,
        0
    );

    cantidadProductos.textContent =
        unidades + (unidades === 1 ? " artículo" : " artículos");

    document.getElementById("contadorNav").textContent = unidades;
    document.getElementById("contadorFlotante").textContent = unidades;

    subtotalElemento.textContent = formatoPrecio(total);
    totalElemento.textContent = formatoPrecio(total);

    if (carrito.length === 0) {
        listaCarrito.innerHTML = `
            <div class="carrito-vacio">
                <span>🛍️</span>
                <h4>Tu carrito está esperando</h4>
                <p>Agrega algo rico del menú para comenzar.</p>
            </div>
        `;
        return;
    }

    listaCarrito.innerHTML = "";

    carrito.forEach(producto => {
        const item = document.createElement("div");
        item.className = "item-carrito";

        const informacion = document.createElement("div");

        const nombre = document.createElement("div");
        nombre.className = "item-carrito-nombre";
        nombre.textContent = producto.nombre;

        const precio = document.createElement("div");
        precio.className = "item-carrito-precio";
        precio.textContent = formatoPrecio(
            producto.precio * producto.cantidad
        );

        const controles = document.createElement("div");
        controles.className = "item-controles";

        const menos = document.createElement("button");
        menos.type = "button";
        menos.textContent = "−";
        menos.setAttribute("aria-label", "Restar " + producto.nombre);
        menos.addEventListener("click", () => {
            cambiarCantidad(producto.nombre, -1);
        });

        const cantidad = document.createElement("span");
        cantidad.className = "item-cantidad";
        cantidad.textContent = producto.cantidad;

        const mas = document.createElement("button");
        mas.type = "button";
        mas.textContent = "+";
        mas.setAttribute("aria-label", "Agregar " + producto.nombre);
        mas.addEventListener("click", () => {
            cambiarCantidad(producto.nombre, 1);
        });

        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "quitar";
        quitar.textContent = "Quitar";
        quitar.addEventListener("click", () => {
            quitarProducto(producto.nombre);
        });

        controles.append(menos, cantidad, mas, quitar);
        informacion.append(nombre, precio, controles);
        item.append(informacion);
        listaCarrito.appendChild(item);
    });
}

document.querySelectorAll(".boton-agregar").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        if (!nombre || !Number.isFinite(precio) || precio < 0) {
            return;
        }

        agregar(nombre, precio);

        const textoOriginal = boton.innerHTML;
        boton.innerHTML = "¡Agregado! ✓";

        setTimeout(() => {
            boton.innerHTML = textoOriginal;
        }, 900);
    });
});

document.querySelectorAll(".filtro").forEach(boton => {
    boton.addEventListener("click", () => {
        document.querySelectorAll(".filtro").forEach(filtro => {
            filtro.classList.remove("activo");
        });

        boton.classList.add("activo");

        const categoria = boton.dataset.filtro;

        document.querySelectorAll(".producto").forEach(producto => {
            const coincide =
                categoria === "todos" ||
                producto.dataset.categoria === categoria;

            producto.classList.toggle("oculto", !coincide);
        });
    });
});

document.getElementById("btnVaciar").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Tu carrito ya está vacío.");
        return;
    }

    if (confirm("¿Quieres quitar todos los productos del carrito?")) {
        carrito = [];
        actualizarCarrito();
    }
});

document.getElementById("btnWhatsApp").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Primero agrega algún producto a tu carrito.");
        return;
    }

    const total = carrito.reduce(
        (suma, producto) => suma + producto.precio * producto.cantidad,
        0
    );

    let mensaje = "¡Hola, Tacos El Güero! 🌮\n";
    mensaje += "Quiero hacer el siguiente pedido:\n\n";

    carrito.forEach(producto => {
        mensaje += `${producto.cantidad} x ${producto.nombre}`;
        mensaje += ` - ${formatoPrecio(producto.precio * producto.cantidad)}\n`;
    });

    mensaje += `\nTOTAL: ${formatoPrecio(total)}\n`;

    const notas = document.getElementById("notasPedido").value.trim();

    if (notas) {
        mensaje += `\nNotas: ${notas}\n`;
    }

    mensaje += "\n¿Me pueden confirmar mi pedido y el tiempo de preparación?";

    const url = "https://wa.me/" + WHATSAPP +
        "?text=" + encodeURIComponent(mensaje);

    window.open(url, "_blank", "noopener,noreferrer");
});

document.getElementById("formContacto").addEventListener("submit", function(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const mensajeUsuario = document.getElementById("mensaje").value.trim();
    const respuesta = document.getElementById("respuestaFormulario");

    if (!nombre || !telefono || !mensajeUsuario) {
        respuesta.textContent = "Completa todos los campos.";
        return;
    }

    if (!/^[0-9+\s()-]{7,20}$/.test(telefono)) {
        respuesta.textContent = "Escribe un teléfono válido.";
        return;
    }

    let mensaje = "Hola, Tacos El Güero. 👋\n\n";
    mensaje += `Mi nombre es: ${nombre}\n`;
    mensaje += `Mi teléfono: ${telefono}\n`;
    mensaje += `Mi mensaje: ${mensajeUsuario}`;

    respuesta.textContent = "Abriendo WhatsApp para enviar tu mensaje...";

    const url = "https://wa.me/" + WHATSAPP +
        "?text=" + encodeURIComponent(mensaje);

    window.open(url, "_blank", "noopener,noreferrer");
});

const menuToggle = document.getElementById("menuToggle");
const navegacion = document.getElementById("navegacion");

menuToggle.addEventListener("click", () => {
    const abierto = navegacion.classList.toggle("abierto");

    menuToggle.setAttribute("aria-expanded", String(abierto));
    menuToggle.setAttribute(
        "aria-label",
        abierto ? "Cerrar menú" : "Abrir menú"
    );

    menuToggle.textContent = abierto ? "✕" : "☰";
});

navegacion.querySelectorAll("a").forEach(enlace => {
    enlace.addEventListener("click", () => {
        navegacion.classList.remove("abierto");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
        menuToggle.textContent = "☰";
    });
});

actualizarCarrito();