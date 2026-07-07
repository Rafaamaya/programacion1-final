'use strict';

/*
 * AMAYA, Rafael
 */

// ===================== DATOS =====================
// Ruta base donde se alojan las imágenes de los productos.
// Si algún día cambian de carpeta, solo hay que modificar esta constante.
const RUTA_IMAGENES = 'img/productos/';

const productos = [
    {
        id: 1,
        nombre: 'Raphael',
        descripcion: 'Figura impresa en 3D y pintada a mano. Edición limitada coleccionista de 18 cm de alto.',
        precio: 574977,
        imagen: 'tortuga-ninja.jpg',
        categoria: 'Cine y TV'
    },
    {
        id: 2,
        nombre: 'RoboCop',
        descripcion: 'Figura impresa en 3D y pintada a mano. Réplica detallada del policía cibernético de Detroit, 20 cm de alto.',
        precio: 735977,
        imagen: 'robocop.jpg',
        categoria: 'Cine y TV'
    },
    {
        id: 3,
        nombre: 'Depredador',
        descripcion: 'Figura impresa en 3D y pintada a mano. El cazador alienígena con armadura y armas, 22 cm de alto.',
        precio: 850977,
        imagen: 'depredador.jpg',
        categoria: 'Cine y TV'
    },
    {
        id: 4,
        nombre: 'Mazinger Z',
        descripcion: 'Figura impresa en 3D y pintada a mano. El clásico robot rojo y negro del anime, 21 cm de alto.',
        precio: 804977,
        imagen: 'mazinger.jpg',
        categoria: 'Anime'
    },
    {
        id: 5,
        nombre: 'Maestro Roshi',
        descripcion: 'Figura impresa en 3D y pintada a mano. El sabio maestro de artes marciales con su bastón, 17 cm de alto.',
        precio: 459977,
        imagen: 'maestro-artes-marciales.jpg',
        categoria: 'Anime'
    },
    {
        id: 6,
        nombre: 'He-Man',
        descripcion: 'Figura impresa en 3D y pintada a mano. El héroe de Eternia con su espada de poder, 20 cm de alto.',
        precio: 367977,
        imagen: 'he-man.jpg',
        categoria: 'Fantasía'
    },
    {
        id: 7,
        nombre: 'Espadachín Sombrío',
        descripcion: 'Figura impresa en 3D y pintada a mano. Guerrero de abrigo negro y katana, 19 cm de alto.',
        precio: 528977,
        imagen: 'espadachin-azul.jpg',
        categoria: 'Fantasía'
    },
    {
        id: 8,
        nombre: 'Orco',
        descripcion: 'Figura impresa en 3D y pintada a mano. Pequeño hechicero de sombrero rojo y báculo mágico, 15 cm de alto.',
        precio: 413977,
        imagen: 'mago.jpg',
        categoria: 'Fantasía'
    }
];

// ===================== CLASES =====================
class CarritoDeCompras {
    constructor() {
        this.items = [];
    }
    // Agrega un producto; si ya está, sube la cantidad (consolida por id).
    agregarProducto(producto) {
        const item = this.items.find(i => i.producto.id === producto.id);
        if (item) {
            item.cantidad++;
        } else {
            this.items.push({ producto: producto, cantidad: 1 });
        }
    }
    removerProducto(producto) {
        this.items = this.items.filter(item => item.producto !== producto);
    }
    calcularTotal() {
        return this.items.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    }
    contarItems() {
        return this.items.reduce((acc, item) => acc + item.cantidad, 0);
    }
    vaciar() {
        this.items = [];
    }
}

// ===================== ESTADO =====================
const carrito = new CarritoDeCompras();

// ===================== HELPERS =====================
// Crea un elemento con una clase y un texto opcionales, y devuelve el nodo listo.
function crearElemento(etiqueta, clase, texto) {
    const $el = document.createElement(etiqueta);
    if (clase) {
        $el.classList.add(clase);
    }
    if (texto !== undefined) {
        $el.textContent = texto;
    }
    return $el;
}

// Crea un botón con su texto y su acción de click. Devuelve el nodo.
function crearBoton(texto, onClick) {
    const $boton = crearElemento('button', null, texto);
    $boton.addEventListener('click', onClick);
    return $boton;
}

// ===================== CATÁLOGO =====================
// Crea y devuelve la card (<li>) de un producto.
function crearCard(producto) {
    const $li = crearElemento('li');

    const $img = crearElemento('img');
    $img.src = RUTA_IMAGENES + producto.imagen;
    $img.alt = producto.nombre;

    const $div = crearElemento('div');
    const $h2 = crearElemento('h2', null, producto.nombre);
    const $descripcion = crearElemento('p', 'descripcion', producto.descripcion);
    const $categoria = crearElemento('p', 'categoria', producto.categoria);

    // precio: "$" en el <p> y el número en un <span> aparte (para estilarlos distinto)
    const $precio = crearElemento('p', 'precio', '$ ');
    $precio.append(crearElemento('span', null, producto.precio.toLocaleString('es-AR')));

    // botones
    const $btnVerDetalle = crearBoton('Ver detalle', function () {
        mostrarDetalle(producto);
    });
    const $btnAgregar = crearBoton('Agregar', function () {
        carrito.agregarProducto(producto);
        actualizarMiniCarrito();
    });

    const $footer = crearElemento('footer');
    $footer.append($btnVerDetalle, $btnAgregar);

    // armo el árbol: div -> contenido ; li -> (img, div)
    $div.append($h2, $descripcion, $precio, $categoria, $footer);
    $li.append($img, $div);

    return $li;
}

// Dibuja todo el catálogo dentro del <ul id="productos">.
function renderCatalogo() {
    const $listaProductos = document.getElementById('productos');
    productos.forEach(function (producto) {
        $listaProductos.append(crearCard(producto));
    });
}

// ===================== MINI-CARRITO =====================
// Refresca la cantidad y el total del mini-carrito fijo de la página.
function actualizarMiniCarrito() {
    document.getElementById('mc-cantidad').textContent = carrito.contarItems();
    document.getElementById('mc-total').textContent = carrito.calcularTotal().toLocaleString('es-AR');
}

// ===================== MODALES =====================
// Crea y abre la modal con el detalle de un producto.
function mostrarDetalle(producto) {
    const $modal = document.getElementById('modal');

    const $dialog = crearElemento('dialog', 'modal');
    const $div = crearElemento('div', 'detalle');

    const $img = crearElemento('img');
    $img.src = RUTA_IMAGENES + producto.imagen;
    $img.alt = producto.nombre;

    const $h2 = crearElemento('h2', null, producto.nombre);
    const $descripcion = crearElemento('p', 'descripcion', producto.descripcion);
    const $categoria = crearElemento('p', 'categoria', producto.categoria);

    const $precio = crearElemento('p', 'precio', '$ ');
    $precio.append(crearElemento('span', null, producto.precio.toLocaleString('es-AR')));

    // botones
    const $btnCerrar = crearBoton('Cerrar', function () {
        $dialog.close();
    });
    // al cerrarse (botón o tecla Esc) se elimina del DOM
    $dialog.addEventListener('close', function () {
        $dialog.remove();
    });

    const $btnAgregar = crearBoton('Agregar', function () {
        carrito.agregarProducto(producto);
        actualizarMiniCarrito();
    });

    const $footer = crearElemento('footer');
    $footer.append($btnCerrar, $btnAgregar);

    // armo el árbol, lo inserto y abro como modal
    $div.append($img, $h2, $descripcion, $precio, $categoria, $footer);
    $dialog.append($div);
    $modal.append($dialog);
    $dialog.showModal();
}

// Crea y abre la modal con el detalle del carrito.
function mostrarCarrito() {
    const $modal = document.getElementById('modal');

    const $dialog = crearElemento('dialog', 'modal');
    const $div = crearElemento('div', 'carrito');

    // header con cantidad y total
    const $spanCantidad = crearElemento('span');
    const $spanTotal = crearElemento('span');
    const $header = crearElemento('header');
    $header.append($spanCantidad, $spanTotal);

    // lista de items
    const $ulItems = crearElemento('ul');

    // footer con Cerrar y Vaciar
    const $btnCerrar = crearBoton('Cerrar', function () {
        $dialog.close();
    });
    // al cerrarse (botón o tecla Esc) se elimina del DOM
    $dialog.addEventListener('close', function () {
        $dialog.remove();
    });
    const $btnVaciar = crearBoton('Vaciar', function () {
        carrito.vaciar();
        renderItems();
        actualizarMiniCarrito();
    });
    const $footer = crearElemento('footer');
    $footer.append($btnCerrar, $btnVaciar);

    // Dibuja (y redibuja) la lista + el header. Se llama al abrir y al eliminar/vaciar,
    // así la modal se actualiza sin cerrarse.
    function renderItems() {
        // vacío la lista sin usar innerHTML (saco los <li> uno por uno)
        while ($ulItems.firstChild) {
            $ulItems.firstChild.remove();
        }

        $spanCantidad.textContent = 'Productos: ' + carrito.contarItems();
        $spanTotal.textContent = 'Total: $' + carrito.calcularTotal().toLocaleString('es-AR');

        // si está vacío, muestro un mensaje y corto
        if (carrito.items.length === 0) {
            $ulItems.append(crearElemento('li', null, 'El carrito está vacío.'));
            return;
        }

        // un <li> por producto (cada uno una vez), con cantidad y subtotal
        carrito.items.forEach(function (item) {
            const subtotal = item.producto.precio * item.cantidad;
            const texto = item.producto.nombre + ' - ' + item.cantidad +
                ' x $' + item.producto.precio.toLocaleString('es-AR') +
                ' = $' + subtotal.toLocaleString('es-AR') + ' ';

            const $li = crearElemento('li', null, texto);

            const $btnEliminar = crearBoton('Eliminar', function () {
                carrito.removerProducto(item.producto);
                renderItems();           // redibujo la lista (la modal sigue abierta)
                actualizarMiniCarrito(); // y refresco el mini-carrito de la página
            });

            $li.append($btnEliminar);
            $ulItems.append($li);
        });
    }

    // armo el árbol, dibujo el contenido inicial y abro
    $div.append($header, $ulItems, $footer);
    $dialog.append($div);
    $modal.append($dialog);
    renderItems();
    $dialog.showModal();
}

// ===================== INICIO (se ejecuta al cargar) =====================
renderCatalogo();
actualizarMiniCarrito();

// Conecto el botón "Ver carrito" para abrir la modal del carrito
document.getElementById('btn-ver-carrito').addEventListener('click', function () {
    mostrarCarrito();
});
