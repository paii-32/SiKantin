function rupiah(n){

    return "Rp " +
    n.toLocaleString("id-ID");

}

const container =
document.getElementById(
    "riwayat-container"
);

let riwayat =
JSON.parse(
    localStorage.getItem(
        "riwayat"
    )
) || [];

renderRiwayat();

function renderRiwayat(){

    container.innerHTML = "";

    let totalPengeluaran = 0;

    document.getElementById(
        "jumlah-pesanan"
    ).innerHTML =
    riwayat.length;

    riwayat.forEach(item=>{

        totalPengeluaran +=
        item.total;

    });

    document.getElementById(
        "total-pengeluaran"
    ).innerHTML =
    rupiah(totalPengeluaran);

    if(riwayat.length === 0){

        container.innerHTML = `

        <div class="kosong">

            <h2>
                Belum ada riwayat pesanan
            </h2>

        </div>

        `;

        return;
    }

    riwayat.forEach(p=>{

        let menu = "";

        p.item.forEach(m=>{

            menu += `

            <li>

                ${m.nama}
                (${m.qty}x)

            </li>

            `;

        });

        container.innerHTML += `

        <div class="card-riwayat">

            <h2 class="kode">

                ${p.kode}

            </h2>

            <p>

                Metode :
                <b>

                    ${p.metode.toUpperCase()}

                </b>

            </p>

            <p>

                Total :
                <b>

                    ${rupiah(p.total)}

                </b>

            </p>

            <p>

                Nomor Antrian :
                <b>

                    A-${p.antrian}

                </b>

            </p>

            <ul class="menu-list">

                ${menu}

            </ul>

            <div class="status">

                Selesai

            </div>

        </div>

        `;

    });

}

function hapusRiwayat(){

    const konfirmasi =
    confirm(
        "Hapus seluruh riwayat?"
    );

    if(!konfirmasi) return;

    localStorage.setItem(
        "riwayat",
        JSON.stringify([])
    );

    riwayat = [];

    renderRiwayat();

}