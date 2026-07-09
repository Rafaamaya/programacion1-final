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
// Clave con la que se guarda el carrito en el localStorage del navegador.
const CART_STORAGE_KEY = 'carrito';

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
        this.save();
    }
    // Filtra por id (valor primitivo) y no por referencia del objeto,
    // para que la comparación sea confiable sin importar de dónde venga el producto.
    removeProduct(product) {
        this.items = this.items.filter(item => item.product.id !== product.id);
        this.save();
    }
    getTotal() {
        return this.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    }
    countItems() {
        return this.items.reduce((acc, item) => acc + item.quantity, 0);
    }
    empty() {
        this.items = [];
        this.save();
    }
    // Guarda los items en localStorage. Solo acepta strings, por eso JSON.stringify.
    save() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    }
    // Recupera los items guardados la última vez (getItem devuelve null si no hay nada).
    load() {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
            this.items = JSON.parse(saved);
        }
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

// ===================== FILTRO POR CATEGORÍAS =====================
// Redibuja el catálogo con los productos de la categoría recibida.
function filterByCategory(category) {
    let filtered = products;
    let categoryFirstButton = document.querySelector('#categorias button').textContent;
    if (category !== categoryFirstButton) {
        filtered = products.filter(p => p.category === category);
    }
    renderCatalog(filtered);

    // cada vez que se filtra, aparece una oferta de ese listado
    showOfferBanner(filtered);
}

// ===================== BANNER DE OFERTA =====================
// Duración del banner en pantalla: 10 segundos exactos, como pide la consigna.
const BANNER_DURATION = 10000;
// Descuentos posibles para la oferta (se elige uno al azar).
const BANNER_DISCOUNTS = [10, 15, 20, 25];

let $activeBanner = null;   // nodo del banner visible (null si no hay ninguno)
let bannerTimeoutId = null; // id del setTimeout, para poder cancelarlo

// Saca el banner de pantalla (lo REMUEVE del DOM) y cancela su temporizador.
function removeBanner() {
    if ($activeBanner) {
        $activeBanner.remove();
        $activeBanner = null;
    }
    clearTimeout(bannerTimeoutId);
}

// Crea y muestra un banner flotante con una oferta aleatoria del listado recibido.
// A los 10 segundos desaparece solo; también se puede cerrar antes con la ✕.
function showOfferBanner(offerPool) {
    // si quedó un banner anterior (filtro tras filtro), lo saco antes de crear el nuevo
    removeBanner();

    // elijo un producto y un descuento al azar: por eso el banner "rota" en cada filtrado
    const product = offerPool[Math.floor(Math.random() * offerPool.length)];
    const discount = BANNER_DISCOUNTS[Math.floor(Math.random() * BANNER_DISCOUNTS.length)];
    const offerPrice = Math.round(product.price * (1 - discount / 100));

    const $banner = createElement('aside', 'banner-oferta');

    const $img = createElement('img', null, undefined, {
        src: IMAGES_PATH + product.image,
        alt: product.name
    });

    const $info = createElement('div');
    const $title = createElement('p', null, '🔥 ¡Oferta! ' + product.name + ' con ' + discount + '% OFF');
    const $price = createElement('p', 'precio-oferta', '$' + offerPrice.toLocaleString('es-AR'));

    // interacción de la oferta: abre el detalle del producto ofertado
    const $btnView = createButton('Ver oferta', function () {
        removeBanner();
        showDetail(product);
    });
    $info.append($title, $price, $btnView);

    // cierre manual antes de los 10 segundos
    const $btnClose = createButton('✕', removeBanner);
    $btnClose.classList.add('cerrar');

    // barrita animada que muestra el tiempo restante (la animación CSS dura 10 s, igual que el setTimeout)
    const $countdown = createElement('div', 'cuenta-regresiva');

    $banner.append($img, $info, $btnClose, $countdown);
    document.body.append($banner);
    $activeBanner = $banner;

    // pasados los 10 segundos, el banner desaparece solo
    bannerTimeoutId = setTimeout(removeBanner, BANNER_DURATION);
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
    $btnEmpty.classList.add('vaciar');
    // marca el final de la selección: cierra el carrito y pasa al ingreso de datos
    const $btnCheckout = createButton('Finalizar compra', function () {
        $dialog.close();
        showCheckout();
    });
    const $footer = createElement('footer');
    $footer.append($btnClose, $btnEmpty, $btnCheckout);

    // armo el árbol, dibujo el contenido inicial y abro
    $div.append($header, $ulItems, $footer);
    $dialog.append($div);
    $modal.append($dialog);
    renderCartItems($ulItems, $spanCount, $spanTotal);
    $dialog.showModal();
}

// ===================== CHECKOUT =====================
// Campos de datos del cliente que pide la consigna.
const CHECKOUT_FIELDS = [
    { label: 'Nombre', name: 'nombre', type: 'text' },
    { label: 'Teléfono', name: 'telefono', type: 'tel' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Lugar de entrega', name: 'lugar', type: 'text' },
    { label: 'Fecha de entrega', name: 'fecha', type: 'date' }
];
const PAYMENT_METHODS = ['Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia', 'Efectivo'];
const INSTALLMENT_OPTIONS = ['1', '3', '6', '12'];

// Crea un campo del formulario: un <label> con su texto y el control adentro.
function createField(labelText, $control) {
    const $label = createElement('label', null, labelText + ' ');
    $label.append($control);
    return $label;
}

// Crea un <select> con una opción vacía inicial (obliga a elegir) más las recibidas.
function createSelect(name, options) {
    const $select = createElement('select', null, undefined, { name: name, required: '' });
    const $placeholder = createElement('option', null, 'Elegir...');
    $placeholder.setAttribute('value', '');
    $select.append($placeholder);
    options.forEach(function (text) {
        const $option = createElement('option', null, text);
        $option.setAttribute('value', text);
        $select.append($option);
    });
    return $select;
}

// Validación con DOM: la consigna solo pide que los datos no estén vacíos.
// Marca los campos que fallan con la clase 'invalido' y devuelve true/false.
function validateForm($form) {
    let valid = true;
    $form.querySelectorAll('input, select').forEach(function ($control) {
        if ($control.value.trim() === '') {
            $control.classList.add('invalido');
            valid = false;
        } else {
            $control.classList.remove('invalido');
        }
    });
    return valid;
}

// Modal de agradecimiento al confirmar la compra (todo con DOM, sin alert).
function showThanks(customerName) {
    const $modal = document.getElementById('modal');

    const $dialog = createElement('dialog', 'modal');
    const $div = createElement('div', 'gracias');

    const $h2 = createElement('h2', null, '¡Gracias por tu compra, ' + customerName + '! 🎉');
    const $p = createElement('p', null, 'Te va a llegar un email con el detalle del pedido.');
    const $btnClose = createButton('Cerrar', function () {
        $dialog.close();
    });
    $dialog.addEventListener('close', function () {
        $dialog.remove();
    });

    $div.append($h2, $p, $btnClose);
    $dialog.append($div);
    $modal.append($dialog);
    $dialog.showModal();
}

// Crea y abre la modal del checkout: datos del cliente y del pago.
function showCheckout() {
    const $modal = document.getElementById('modal');

    const $dialog = createElement('dialog', 'modal');
    // novalidate: desactivo los globos nativos del navegador para validar yo con DOM
    const $form = createElement('form', 'checkout', undefined, {
        method: 'get',
        action: '#',
        novalidate: ''
    });

    const $h2 = createElement('h2', null, 'Finalizar compra');
    const $summary = createElement('p', 'resumen',
        cart.countItems() + ' productos · Total: $' + cart.getTotal().toLocaleString('es-AR'));
    $form.append($h2, $summary);

    // campos del cliente (uno por cada entrada de CHECKOUT_FIELDS)
    CHECKOUT_FIELDS.forEach(function (field) {
        const $input = createElement('input', null, undefined, {
            name: field.name,
            type: field.type,
            required: ''
        });
        $form.append(createField(field.label, $input));
    });

    // método de pago
    const $paymentSelect = createSelect('pago', PAYMENT_METHODS);
    $form.append(createField('Método de pago', $paymentSelect));

    // cuotas: solo corresponden con tarjeta de crédito, así que el campo
    // se AGREGA o se QUITA del DOM según el método elegido (no se oculta)
    const $installmentsField = createField('Cuotas', createSelect('cuotas', INSTALLMENT_OPTIONS));
    $paymentSelect.addEventListener('change', function () {
        if ($paymentSelect.value === 'Tarjeta de crédito') {
            $paymentSelect.parentElement.after($installmentsField);
        } else {
            $installmentsField.remove();
        }
    });

    // aviso general de validación (se agrega al DOM solo si hace falta)
    const $error = createElement('p', 'error', 'Completá los campos marcados.');

    // botones: Cancelar vuelve al carrito para seguir agregando/eliminando
    const $btnCancel = createButton('Cancelar', function () {
        $dialog.close();
        showCart();
    });
    $btnCancel.setAttribute('type', 'button'); // que no dispare el submit del form
    const $btnConfirm = createElement('button', null, 'Confirmar compra'); // type=submit por defecto

    const $footer = createElement('footer');
    $footer.append($btnCancel, $btnConfirm);
    $form.append($footer);

    // al enviar: valido con DOM; si está todo completo se confirma la compra
    $form.addEventListener('submit', function (event) {
        event.preventDefault(); // cancela el envío tradicional: todo pasa en este documento

        if (!validateForm($form)) {
            // muestro el aviso (una sola vez) arriba de los botones
            if (!$error.parentElement) {
                $footer.before($error);
            }
            return;
        }

        const customerName = $form.querySelector('input[name="nombre"]').value;
        $dialog.close();
        cart.empty();      // compra finalizada: se resetea el carrito
        updateMiniCart();
        showThanks(customerName);
    });

    // al corregir un campo, le saco la marca de inválido al instante
    $form.addEventListener('input', function (event) {
        event.target.classList.remove('invalido');
    });

    $dialog.addEventListener('close', function () {
        $dialog.remove();
    });

    $dialog.append($form);
    $modal.append($dialog);
    $dialog.showModal();
}

// ===================== INICIO (se ejecuta al cargar) =====================
cart.load(); // recupero el carrito guardado, así sobrevive a recargas y cierres
renderCatalog(products);
updateMiniCart();

// Conecto el botón "Ver carrito" para abrir la modal del carrito
document.getElementById('btn-ver-carrito').addEventListener('click', function () {
    showCart();
});

// Conecto la barra de categorías: cada botón filtra el catálogo y queda marcado como activo
const $categoryButtons = document.querySelectorAll('#categorias button');
$categoryButtons.forEach(function ($button) {
    $button.addEventListener('click', function () {
        $button.classList.add('activa');
        filterByCategory($button.textContent);
        // desactivo los demás botones
        $categoryButtons.forEach(function ($otherButton) {
            if ($otherButton !== $button) {
                $otherButton.classList.remove('activa');
            }
        });
    });
});
