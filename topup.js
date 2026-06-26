function rupiah(n){

    return "Rp " +
    n.toLocaleString("id-ID");

}

function tampilSaldo(){

    const saldo =
    Number(
        localStorage.getItem("saldo")
    ) || 0;

    document.getElementById(
        "saldo-sekarang"
    ).innerHTML =
    rupiah(saldo);

}

function pilihNominal(nominal){

    document.getElementById(
        "nominal"
    ).value =
    nominal;

}

function topup(){

    const nominal =
    Number(
        document.getElementById(
            "nominal"
        ).value
    );

    if(nominal <= 0){

        alert(
            "Masukkan nominal yang valid"
        );

        return;
    }

    let saldo =
    Number(
        localStorage.getItem("saldo")
    ) || 0;

    saldo += nominal;

    localStorage.setItem(
        "saldo",
        saldo
    );

    let notif =
    JSON.parse(
        localStorage.getItem(
            "notifikasi"
        )
    ) || [];

    notif.unshift({

        pesan:
        "Top Up berhasil sebesar " +
        rupiah(nominal),

        waktu:
        new Date()
        .toLocaleString(),

        dibaca:false

    });

    localStorage.setItem(
        "notifikasi",
        JSON.stringify(notif)
    );

    alert(
        "Top Up berhasil!"
    );

    tampilSaldo();

    document.getElementById(
        "nominal"
    ).value = "";

}

tampilSaldo();