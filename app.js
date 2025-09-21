function MostrarSegundaPagina() {
    ReproducirCancion();
    const triggerEl = document.querySelector('a[href="#SegundaPagina"]');
    const tab = new bootstrap.Tab(triggerEl);
    tab.show();
}

function ReproducirCancion() {
    const audio = document.getElementById("ReproductorCancion");

    audio.volume = 0.2; // empieza en silencio
    audio.currentTime += 1; // saltar 1 segundo
    audio.play();

    // Fade in progresivo
    let fade = setInterval(() => {
        if (audio.volume < 1) {
            audio.volume = Math.min(audio.volume + 0.05, 1); // sube poco a poco
        } else {
            clearInterval(fade); // parar cuando llega a 1
        }
    }, 200); // cada 200ms
}

function PausarCancion() {
    const audio = document.getElementById("ReproductorCancion");
    audio.pause();
}



const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const countdown = document.getElementById("countdown");

function iniciarCuentaRegresiva() {
    const targetDate = new Date("Nov 29, 2025 00:00:00").getTime();

    function actualizar() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            daysEl.textContent = "0";
            hoursEl.textContent = "0";
            minutesEl.textContent = "0";
            secondsEl.textContent = "0";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = days;
        hoursEl.textContent = hours;
        minutesEl.textContent = minutes;
        secondsEl.textContent = seconds;
    }

    actualizar();
    setInterval(actualizar, 1000);
}

// animación en scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countdown.classList.add("visible");
            observer.unobserve(countdown);
        }
    });
});

iniciarCuentaRegresiva();
observer.observe(countdown);


function toggleAudio(element) {
    const audio = document.getElementById("ReproductorCancion");

    if (!audio) return;

    if (audio.paused) {
        audio.play();
        element.classList.remove("ph-play");
        element.classList.add("ph-pause");
    } else {
        audio.pause();
        element.classList.remove("ph-pause");
        element.classList.add("ph-play");
    }
}

function AbrirMapaTemplo() {
    var ruta = 'https://maps.app.goo.gl/y7Tec18a3GryrMhk7'
    window.open(ruta, "_blank");
}
function AbrirMapaCieneguilla() {
    var ruta = 'https://maps.app.goo.gl/cKkS9LjXXi5mx44d8'
    window.open(ruta, "_blank");
}