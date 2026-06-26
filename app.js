// instalasi

const BATAS_SESI = 5;

if (!localStorage.getItem("saldo")) {
    localStorage.setItem("saldo", 120000);
}

if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
}

if (!localStorage.getItem("pesanan")) {
    localStorage.setItem("pesanan", JSON.stringify([]));
}

if (!localStorage.getItem("riwayat")) {
    localStorage.setItem("riwayat", JSON.stringify([]));
}

if (!localStorage.getItem("notifikasi")) {
    localStorage.setItem("notifikasi", JSON.stringify([]));
}

if (!localStorage.getItem("antrian")) {
    localStorage.setItem("antrian", 1);
}


// format rp

function rupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}


// update saldo

function updateSaldo() {

    const saldo =
    Number(localStorage.getItem("saldo"));

    const saldoElements =
    document.querySelectorAll(".nav-2-p1");

    saldoElements.forEach(el => {

        el.innerHTML =
        rupiah(saldo);

    });

}

updateSaldo();



// keranjang

function updateCartBadge() {

    const badges =
        document.querySelectorAll(".cart-count");

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    let total = 0;

    cart.forEach(item => {
        total += item.qty;
    });

    badges.forEach(badge => {
        badge.innerHTML = total;
    });

}



// tambah keranjang

const tombolKeranjang =
document.querySelectorAll(".keranjang");

tombolKeranjang.forEach(btn => {

    btn.addEventListener("click", () => {

        const nama = btn.dataset.nama;
        const harga = Number(btn.dataset.harga);
        const gambar = btn.dataset.gambar;

        let cart =
            JSON.parse(localStorage.getItem("cart")) || [];

        const index =
            cart.findIndex(item => item.nama === nama);

        if (index > -1) {
            cart[index].qty++;
        } else {
            cart.push({
                nama,
                harga,
                gambar,
                qty: 1
            });
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartBadge();

        tambahNotifikasi(nama + " ditambahkan ke keranjang");
    });

});




// kode

function generateKode() {
    return "SK" + Math.floor(1000 + Math.random() * 9000);
}


// notif

function tambahNotifikasi(text) {

    let data =
        JSON.parse(localStorage.getItem("notifikasi")) || [];

    data.unshift({
        pesan: text,
        waktu: new Date().toLocaleString(),
        dibaca: false
    });

    localStorage.setItem("notifikasi", JSON.stringify(data));

    renderNotifPopup();
}



// CO

function checkout(metode) {

    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) return;

    let total = 0;

    cart.forEach(item => {
        total += item.harga * item.qty;
    });

    let saldo =
        Number(localStorage.getItem("saldo"));

    if (metode === "saldo" && total > saldo) {
        tambahNotifikasi("Saldo tidak cukup");
        return;
    }

    if (metode === "saldo") {
        saldo -= total;
        localStorage.setItem("saldo", saldo);
        updateSaldo();
    }

    const sekarang = new Date();

    const dibuatPada = Date.now();
    const selesaiPada = dibuatPada + 12 * 60 * 1000;
    
    const batas =
        new Date(sekarang.getTime() + 30 * 60000);

    const kode = generateKode();

    let nomorAntrian =
    Number(localStorage.getItem("antrian"));

    let sesi = Math.ceil(nomorAntrian / BATAS_SESI);

    localStorage.setItem("antrian", nomorAntrian + 1);

    let pesanan =
        JSON.parse(localStorage.getItem("pesanan")) || [];


    pesanan.unshift({
        kode,
        antrian: nomorAntrian,
        sesi: sesi,
        metode,
        total,
        status: "Diproses",
        waktu: sekarang.toLocaleTimeString(),
        batas: batas.toLocaleTimeString(),
        dibuatPada,
        selesaiPada,
        item: cart
    });

    localStorage.setItem("pesanan", JSON.stringify(pesanan));

    localStorage.setItem("cart", JSON.stringify([]));

    updateCartBadge();

    tambahNotifikasi("Pesanan " + kode + " berhasil dibuat");

    setTimeout(() => {
        location.href = "pesanan.html";
    }, 300);
}



// update status pesanan

function updateStatusPesanan() {

    let pesanan =
    JSON.parse(
        localStorage.getItem("pesanan")
    ) || [];

    let sekarang = Date.now();

    let berubah = false;

    pesanan.forEach(p => {

        const sisa =
        p.selesaiPada - sekarang;

        // 50% waktu
        if(
            sisa <= 6 * 60 * 1000 &&
            p.status === "Diproses"
        ){

            p.status =
            "Sedang Dimasak";

            berubah = true;

        }

        // selesai
        if(
            sisa <= 0 &&
            p.status !== "Siap Diambil"
        ){

            p.status =
            "Siap Diambil";

            berubah = true;

        }

    });

    if(berubah){

        localStorage.setItem(
            "pesanan",
            JSON.stringify(pesanan)
        );

    }

}

setInterval(updateStatusPesanan, 1000);




// notif popup
const notifBtns =
document.querySelectorAll(".notif-btn");

notifBtns.forEach(btn => {

    btn.addEventListener("click", (e) => {

        e.stopPropagation();

        const popup =
        btn.parentElement.querySelector(
            ".notif-popup"
        );

        if(popup){
            popup.classList.toggle("show");
        }

        let data =
        JSON.parse(
            localStorage.getItem("notifikasi")
        ) || [];

        data.forEach(item => {
            item.dibaca = true;
        });

        localStorage.setItem(
            "notifikasi",
            JSON.stringify(data)
        );

        renderNotifPopup();

    });

});

function renderNotifPopup() {

    const notifLists =
    document.querySelectorAll(".notif-list");

    let data =
    JSON.parse(
        localStorage.getItem("notifikasi")
    ) || [];

    notifLists.forEach(notifList => {

        notifList.innerHTML = "";

        data.forEach(notif => {

            notifList.innerHTML += `

            <div class="notif-item">

                <div>

                    <h4>${notif.pesan}</h4>

                    <p>${notif.waktu}</p>

                </div>

            </div>

            `;

        });

    });

    const badges =
    document.querySelectorAll(".notif-badge");

    const unread =
    data.filter(
        item => !item.dibaca
    ).length;

    badges.forEach(badge => {

        badge.innerHTML = unread;

    });

}

renderNotifPopup();



// close popup

document.addEventListener(
"click",
() => {

    document
    .querySelectorAll(".notif-popup")
    .forEach(popup => {

        popup.classList.remove("show");

    });

});



// hapus notif

function hapusSemuaNotif() {

    let data =
        JSON.parse(localStorage.getItem("notifikasi")) || [];

    if (data.length === 0) return;

    const confirmHapus = confirm("Hapus semua notifikasi?");

    if (!confirmHapus) return;

    localStorage.setItem("notifikasi", JSON.stringify([]));

    renderNotifPopup();

    // optional notif system
    tambahNotifikasi("Semua notifikasi telah dihapus");
}