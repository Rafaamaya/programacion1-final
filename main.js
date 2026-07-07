'use strict';

/*
 * AMAYA, Rafael
 */

// ===================== DATOS =====================
// Ruta base donde se alojan las imágenes de los productos.
// Si algún día cambian de carpeta, solo hay que modificar esta constante.
const IMAGES_PATH = 'images/products/';

const products = [
    {
        id: 1,
        name: 'Raphael',
        description: 'Figura impresa en 3D y pintada a mano. Edición limitada coleccionista de 18 cm de alto.',
        price: 574977,
        image: 'ninja-turtle.jpg',
        category: 'Cine y TV'
    },
    {
        id: 2,
        name: 'RoboCop',
        description: 'Figura impresa en 3D y pintada a mano. Réplica detallada del policía cibernético de Detroit, 20 cm de alto.',
        price: 735977,
        image: 'robocop.jpg',
        category: 'Cine y TV'
    },
    {
        id: 3,
        name: 'Depredador',
        description: 'Figura impresa en 3D y pintada a mano. El cazador alienígena con armadura y armas, 22 cm de alto.',
        price: 850977,
        image: 'predator.jpg',
        category: 'Cine y TV'
    },
    {
        id: 4,
        name: 'Mazinger Z',
        description: 'Figura impresa en 3D y pintada a mano. El clásico robot rojo y negro del anime, 21 cm de alto.',
        price: 804977,
        image: 'mazinger.jpg',
        category: 'Anime'
    },
    {
        id: 5,
        name: 'Maestro Roshi',
        description: 'Figura impresa en 3D y pintada a mano. El sabio maestro de artes marciales con su bastón, 17 cm de alto.',
        price: 459977,
        image: 'martial-arts-master.jpg',
        category: 'Anime'
    },
    {
        id: 6,
        name: 'He-Man',
        description: 'Figura impresa en 3D y pintada a mano. El héroe de Eternia con su espada de poder, 20 cm de alto.',
        price: 367977,
        image: 'he-man.jpg',
        category: 'Fantasía'
    },
    {
        id: 7,
        name: 'Espadachín Sombrío',
        description: 'Figura impresa en 3D y pintada a mano. Guerrero de abrigo negro y katana, 19 cm de alto.',
        price: 528977,
        image: 'blue-swordsman.jpg',
        category: 'Fantasía'
    },
    {
        id: 8,
        name: 'Orco',
        description: 'Figura impresa en 3D y pintada a mano. Pequeño hechicero de sombrero rojo y báculo mágico, 15 cm de alto.',
        price: 413977,
        image: 'wizard.jpg',
        category: 'Fantasía'
    }
];

// ===================== CLASES =====================
class ShoppingCart {
    constructor() {
        this.items = [];
    }
    // Agrega un producto; si ya está, sube la cantidad (consolida por id).
    addProduct(product) {
        const item = this.items.find(i => i.product.id === product.id);
        if (item) {
            item.quantity++;
        } else {
            this.items.push({ product, quantity: 1 });
        }
    }
    removeProduct(product) {
        this.items = this.items.filter(item => item.product !== product);
    }
    getTotal() {
        return this.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    }
    countItems() {
        return this.items.reduce((acc, item) => acc + item.quantity, 0);
    }
    empty() {
        this.items = [];
    }
}

// ===================== ESTADO =====================
const cart = new ShoppingCart();

// ===================== HELPERS =====================
// Crea un elemento con una clase, un texto y un objeto de atributos opcionales,
// y devuelve el nodo listo. Ej: createElement('img', null, undefined, { src: 'foto.jpg', alt: 'Foto' })
function createElement(tag, cssClass, text, attributes) {
    const $el = document.createElement(tag);
    if (cssClass) {
        $el.classList.add(cssClass);
    }
    if (text !== undefined) {
        $el.textContent = text;
    }
    // recorro el objeto de atributos y aplico cada par nombre/valor
    if (attributes) {
        for (const name in attributes) {
            $el.setAttribute(name, attributes[name]);
        }
    }
    return $el;
}

// Crea un botón con su texto y su acción de click. Devuelve el nodo.
function createButton(text, onClick) {
    const $button = createElement('button', null, text);
    $button.addEventListener('click', onClick);
    return $button;
}

// ===================== CATÁLOGO =====================
// Crea y devuelve la card (<li>) de un producto.
function createCard(product) {
    const $li = createElement('li');

    const $img = createElement('img', null, undefined, {
        src: IMAGES_PATH + product.image,
        alt: product.name
    });

    const $div = createElement('div');
    const $h2 = createElement('h2', null, product.name);
    const $description = createElement('p', 'descripcion', product.description);
    const $category = createElement('p', 'categoria', product.category);

    // precio: "$" en el <p> y el número en un <span> aparte (para estilarlos distinto)
    const $price = createElement('p', 'precio', '$ ');
    $price.append(createElement('span', null, product.price.toLocaleString('es-AR')));

    // botones
    const $btnViewDetail = createButton('Ver detalle', function () {
        showDetail(product);
    });
    const $btnAdd = createButton('Agregar', function () {
        cart.addProduct(product);
        updateMiniCart();
    });

    const $footer = createElement('footer');
    $footer.append($btnViewDetail, $btnAdd);

    // armo el árbol: div -> contenido ; li -> (img, div)
    $div.append($h2, $description, $price, $category, $footer);
    $li.append($img, $div);

    return $li;
}

// Dibuja el catálogo dentro del <ul id="productos"> a partir del listado recibido.
// Recibe los productos por parámetro para poder reutilizarla con cualquier
// subconjunto (filtros, destacados, resultados de búsqueda, etc.).
function renderCatalog(productsToRender) {
    const $productList = document.getElementById('productos');

    // limpio la lista antes de dibujar, así se puede volver a llamar sin duplicar
    $productList.textContent = '';

    productsToRender.forEach(function (product) {
        $productList.append(createCard(product));
    });
}

// ===================== MINI-CARRITO =====================
// Refresca la cantidad y el total del mini-carrito fijo de la página.
function updateMiniCart() {
    document.getElementById('mc-cantidad').textContent = cart.countItems();
    document.getElementById('mc-total').textContent = cart.getTotal().toLocaleString('es-AR');
}

// ===================== MODALES =====================
// Crea y abre la modal con el detalle de un producto.
function showDetail(product) {
    const $modal = document.getElementById('modal');

    const $dialog = createElement('dialog', 'modal');
    const $div = createElement('div', 'detalle');

    const $img = createElement('img', null, undefined, {
        src: IMAGES_PATH + product.image,
        alt: product.name
    });

    const $h2 = createElement('h2', null, product.name);
    const $description = createElement('p', 'descripcion', product.description);
    const $category = createElement('p', 'categoria', product.category);

    const $price = createElement('p', 'precio', '$ ');
    $price.append(createElement('span', null, product.price.toLocaleString('es-AR')));

    // botones
    const $btnClose = createButton('Cerrar', function () {
        $dialog.close();
    });
    // al cerrarse (botón o tecla Esc) se elimina del DOM
    $dialog.addEventListener('close', function () {
        $dialog.remove();
    });

    const $btnAdd = createButton('Agregar', function () {
        cart.addProduct(product);
        updateMiniCart();
    });

    const $footer = createElement('footer');
    $footer.append($btnClose, $btnAdd);

    // armo el árbol, lo inserto y abro como modal
    $div.append($img, $h2, $description, $price, $category, $footer);
    $dialog.append($div);
    $modal.append($dialog);
    $dialog.showModal();
}

// Dibuja (y redibuja) la lista de items del carrito y su header, dentro de los nodos recibidos.
// Recibe los nodos por parámetro para poder vivir fuera de showCart y reutilizarse:
// se llama al abrir la modal y también al eliminar/vaciar, así la modal se actualiza sin cerrarse.
function renderCartItems($ulItems, $spanCount, $spanTotal) {
    // vacío la lista de una sola vez, sin usar innerHTML
    $ulItems.textContent = '';

    $spanCount.textContent = 'Productos: ' + cart.countItems();
    $spanTotal.textContent = 'Total: $' + cart.getTotal().toLocaleString('es-AR');

    // si está vacío, muestro un mensaje y corto
    if (cart.items.length === 0) {
        $ulItems.append(createElement('li', null, 'El carrito está vacío.'));
        return;
    }

    // un <li> por producto (cada uno una vez), con cantidad y subtotal
    cart.items.forEach(function (item) {
        const subtotal = item.product.price * item.quantity;
        const text = item.product.name + ' - ' + item.quantity +
            ' x $' + item.product.price.toLocaleString('es-AR') +
            ' = $' + subtotal.toLocaleString('es-AR') + ' ';

        const $li = createElement('li', null, text);

        const $btnRemove = createButton('Eliminar', function () {
            cart.removeProduct(item.product);
            renderCartItems($ulItems, $spanCount, $spanTotal); // redibujo la lista (la modal sigue abierta)
            updateMiniCart();                                  // y refresco el mini-carrito de la página
        });

        $li.append($btnRemove);
        $ulItems.append($li);
    });
}

// Crea y abre la modal con el detalle del carrito.
function showCart() {
    const $modal = document.getElementById('modal');

    const $dialog = createElement('dialog', 'modal');
    const $div = createElement('div', 'carrito');

    // header con cantidad y total
    const $spanCount = createElement('span');
    const $spanTotal = createElement('span');
    const $header = createElement('header');
    $header.append($spanCount, $spanTotal);

    // lista de items
    const $ulItems = createElement('ul');

    // footer con Cerrar y Vaciar
    const $btnClose = createButton('Cerrar', function () {
        $dialog.close();
    });
    // al cerrarse (botón o tecla Esc) se elimina del DOM
    $dialog.addEventListener('close', function () {
        $dialog.remove();
    });
    const $btnEmpty = createButton('Vaciar', function () {
        cart.empty();
        renderCartItems($ulItems, $spanCount, $spanTotal);
        updateMiniCart();
    });
    const $footer = createElement('footer');
    $footer.append($btnClose, $btnEmpty);

    // armo el árbol, dibujo el contenido inicial y abro
    $div.append($header, $ulItems, $footer);
    $dialog.append($div);
    $modal.append($dialog);
    renderCartItems($ulItems, $spanCount, $spanTotal);
    $dialog.showModal();
}

// ===================== INICIO (se ejecuta al cargar) =====================
renderCatalog(products);
updateMiniCart();

// Conecto el botón "Ver carrito" para abrir la modal del carrito
document.getElementById('btn-ver-carrito').addEventListener('click', function () {
    showCart();
});
