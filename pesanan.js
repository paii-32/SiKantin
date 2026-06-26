
// format rupiah

function rupiah(n){
    return "Rp " + n.toLocaleString("id-ID");
}

// ambil container

const container =
document.getElementById("pesanan-container");


// ambil data

let pesanan =
JSON.parse(localStorage.getItem("pesanan")) || [];


//  format countdown

function formatCountdown(ms){

    if(ms <= 0){
        return "00:00";
    }

    const menit = Math.floor(ms / 60000);
    const detik = Math.floor((ms % 60000) / 1000);

    return String(menit).padStart(2,"0") + ":" +
           String(detik).padStart(2,"0");
}



// update status berdasarkan progres

function updateStatus(){

    let berubah = false;

    pesanan.forEach(p => {

        if (!p.dibuatPada || !p.selesaiPada) return;

        const totalWaktu = p.selesaiPada - p.dibuatPada;
        const sisa = p.selesaiPada - Date.now();
        


        let progress = 1 - (sisa / totalWaktu);



        if(progress < 0) progress = 0;
        if(progress > 1) progress = 1;

        // 0% - 50% → Diproses
        if(progress < 0.5 && p.status !== "Diproses"){
            p.status = "Diproses";
            berubah = true;
        }

        // 50% - 99% → Sedang Dimasak
        else if(progress >= 0.5 && progress < 1 && p.status !== "Sedang Dimasak"){
            p.status = "Sedang Dimasak";
            berubah = true;
        }

        // 100% → Siap Diambil
        else if(progress >= 1 && p.status !== "Siap Diambil"){
            p.status = "Siap Diambil";
            berubah = true;
        }

    });

    if(berubah){
        localStorage.setItem("pesanan", JSON.stringify(pesanan));
    }
}

// realtime render

function updateRealtime(){

    if(!container) return;

    // refresh data biar sinkron
    pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

    container.innerHTML = "";

    if(pesanan.length === 0){

        container.innerHTML = `
            <div class="pesanan-kosong">
                <h2>Belum ada pesanan</h2>
            </div>
        `;

        return;
    }

    pesanan.forEach((p,index)=>{

        if (!p.dibuatPada || !p.selesaiPada) return;

        let sisa = p.selesaiPada - Date.now();

        if(sisa < 0) sisa = 0;

        let countdown = formatCountdown(sisa);

        let daftarMenu = "";

        p.item.forEach(menu=>{
            daftarMenu += `
                <li>${menu.nama} (${menu.qty}x)</li>
            `;
        });

        container.innerHTML += `
        <div class="card">

            <div class="header">
                <h2>${p.kode}</h2>
                <span class="status">${p.status}</span>
            </div>

            <div class="info">

                <p>
                    Estimasi :
                    <b>${countdown}</b>
                </p>

                <p>
                    Metode :
                    <b>${p.metode.toUpperCase()}</b>
                </p>

                <p>
                    Total :
                    <b>${rupiah(p.total)}</b>
                </p>

                <p>
                    Waktu Pesan :
                    <b>${p.waktu}</b>
                </p>

                <p>
                    Batas Ambil :
                    <b>${p.batas}</b>
                </p>

                <p>
                    Sesi Ambil :
                    <b>${p.sesi}</b>
                </p>

            </div>

            <div class="menu-pesanan">
                <h3>Menu Pesanan</h3>
                <ul>${daftarMenu}</ul>
            </div>

            <button
                class="selesai"
                onclick="selesaikan(${index})"
                ${p.status !== "Siap Diambil" ? "disabled" : ""}
            >
                Pesanan Selesai
            </button>

        </div>
        `;
    });
}



// selesaikan pesanan

function selesaikan(index){

    let riwayat =
    JSON.parse(localStorage.getItem("riwayat")) || [];

    riwayat.unshift(pesanan[index]);

    localStorage.setItem("riwayat", JSON.stringify(riwayat));

    let notif =
    JSON.parse(localStorage.getItem("notifikasi")) || [];

    notif.unshift({
        pesan: "Pesanan " + pesanan[index].kode + " selesai",
        waktu: new Date().toLocaleString(),
        dibaca: false
    });

    localStorage.setItem("notifikasi", JSON.stringify(notif));

    pesanan.splice(index,1);

    localStorage.setItem("pesanan", JSON.stringify(pesanan));

    updateRealtime();

    alert("Pesanan selesai");
}

// loop sistem realtime

updateRealtime();

setInterval(()=>{
    updateStatus();
    updateRealtime();
},1000);