
// =======================
// AMBIL DATA KERANJANG
// =======================

let cart =
JSON.parse(
    localStorage.getItem("cart")
) || [];

const cartList =
document.getElementById(
    "cart-list"
);


// =======================
// FORMAT RUPIAH
// =======================

function rupiah(nominal){

    return "Rp " +
    nominal.toLocaleString(
        "id-ID"
    );

}


// =======================
// RENDER KERANJANG
// =======================

function renderCart(){

    if(!cartList) return;

    cartList.innerHTML = "";

    let total = 0;

    if(cart.length === 0){

        cartList.innerHTML = `

        <div class="cart-kosong">

            <h3>
                Keranjang masih kosong
            </h3>

        </div>

        `;

    }

    cart.forEach((item,index)=>{

        total +=
        item.harga * item.qty;

        cartList.innerHTML += `

        <div class="cart-item">

            <img
            src="${item.gambar}"
            alt="${item.nama}">

            <div class="item-info">

                <h3>
                    ${item.nama}
                </h3>

                <p>
                    ${rupiah(item.harga)}
                </p>

            </div>

            <div class="qty">

                <button
                onclick="kurang(${index})">

                -

                </button>

                <span>

                    ${item.qty}

                </span>

                <button
                onclick="tambah(${index})">

                +

                </button>

            </div>

        </div>

        `;

    });

    const totalElement =
    document.getElementById(
        "total"
    );

    if(totalElement){

        totalElement.innerHTML =
        rupiah(total);

    }

    const saldoElement =
    document.getElementById(
        "saldo"
    );

    if(saldoElement){

        saldoElement.innerHTML =
        rupiah(
            Number(
                localStorage.getItem(
                    "saldo"
                )
            )
        );

    }

}


// =======================
// TAMBAH QTY
// =======================

function tambah(index){

    cart[index].qty++;

    simpan();

}


// =======================
// KURANG QTY
// =======================

function kurang(index){

    cart[index].qty--;

    if(cart[index].qty <= 0){

        cart.splice(index,1);

    }

    simpan();

}


// =======================
// SIMPAN
// =======================

function simpan(){

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    renderCart();

    if(
        typeof updateCartBadge ===
        "function"
    ){

        updateCartBadge();

    }

}


// =======================
// CHECKOUT
// =======================

function prosesCheckout(){

    const metode =
    document.querySelector(
        'input[name="payment"]:checked'
    );

    if(!metode){

        alert(
            "Pilih metode pembayaran"
        );

        return;

    }

    checkout(
        metode.value
    );

}


// =======================
// LOAD
// =======================

renderCart();

