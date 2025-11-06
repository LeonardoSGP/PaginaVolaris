document.addEventListener('DOMContentLoaded', function() {

    //MENU MOVIL

    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');

    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', () => {
            navMobile.classList.toggle('active');
        });
    }

    //HERO SLIDER (IMAGENES PRINCIPALES)

    const slides = ['slide1', 'slide2', 'slide3'];
    let currentSlide = 0;

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % 3;
        document.getElementById(slides[currentSlide]).checked = true;
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + 3) % 3;
        document.getElementById(slides[currentSlide]).checked = true;
    };

    document.querySelector('.prev')?.addEventListener('click', prevSlide);
    document.querySelector('.next')?.addEventListener('click', nextSlide);

    document.querySelectorAll('.manual-btn').forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentSlide = index;
        });
    });

    setInterval(nextSlide, 7000);

    // FORMULARIO DE BUSQUEDA

    // --- Configuración de Fechas ---
    const fechaSalidaInput = document.getElementById('fecha-salida');
    const fechaRegresoInput = document.getElementById('fecha-regreso');
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    if (fechaSalidaInput && fechaRegresoInput) {
        fechaSalidaInput.min = hoy.toISOString().split('T')[0];
        fechaSalidaInput.value = hoy.toISOString().split('T')[0];
        fechaRegresoInput.min = manana.toISOString().split('T')[0];
        fechaRegresoInput.value = manana.toISOString().split('T')[0];

        fechaSalidaInput.addEventListener('change', function() {
            const fechaSalida = new Date(this.value);
            const fechaRegresoMinima = new Date(fechaSalida);
            fechaRegresoMinima.setDate(fechaRegresoMinima.getDate() + 1);
            fechaRegresoInput.min = fechaRegresoMinima.toISOString().split('T')[0];

            if (new Date(fechaRegresoInput.value) <= fechaSalida) {
                fechaRegresoInput.value = fechaRegresoMinima.toISOString().split('T')[0];
            }
        });
    }

    // --- Tipo de Viaje (Sencillo/Redondo) ---
    const campoRegreso = document.querySelector('.campo-regreso');
    document.querySelectorAll('.tabs button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('on'));
            this.classList.add('on');
            const tipoViaje = this.dataset.tipo;

            if (tipoViaje === 'sencillo') {
                campoRegreso.classList.add('disabled');
                fechaRegresoInput.disabled = true;
            } else {
                campoRegreso.classList.remove('disabled');
                fechaRegresoInput.disabled = false;
            }
        });
    });

    // --- Código Promocional ---
    const campoCodigo = document.querySelector('.campo-codigo');
    const inputCodigo = campoCodigo?.querySelector('input');

    if (campoCodigo && inputCodigo) {
        campoCodigo.addEventListener('click', () => {
            campoCodigo.classList.add('activo');
            inputCodigo.focus();
        });
        inputCodigo.addEventListener('blur', function() {
            if (this.value === '') campoCodigo.classList.remove('activo');
        });
    }

    // --- Selector de Pasajeros ---
    let adultos = 1, menores = 0, bebes = 0;
    const campoPasajeros = document.querySelector('.campo-pasajeros');
    const inputPasajeros = campoPasajeros?.querySelector('input');

    if (campoPasajeros) {
        campoPasajeros.addEventListener('click', (e) => {
            if (!e.target.closest('.counter button')) {
                campoPasajeros.classList.toggle('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.campo-pasajeros')) {
                campoPasajeros.classList.remove('active');
            }
        });
    }

    function actualizarPasajeros() {
        document.querySelector('.adulto-count').textContent = adultos;
        document.querySelector('.menor-count').textContent = menores;
        document.querySelector('.bebe-count').textContent = bebes;

        const partes = [];
        if (adultos > 0) partes.push(`${adultos} Adulto${adultos > 1 ? 's' : ''}`);
        if (menores > 0) partes.push(`${menores} Menor${menores > 1 ? 'es' : ''}`);
        if (bebes > 0) partes.push(`${bebes} Bebé${bebes > 1 ? 's' : ''}`);
        inputPasajeros.value = partes.length > 0 ? partes.join(', ') : '0 Pasajeros';
    }

    function actualizarBotones() {
        document.querySelectorAll('.plus[data-type="adulto"]').forEach(btn => btn.disabled = adultos >= 9);
        document.querySelectorAll('.minus[data-type="adulto"]').forEach(btn => btn.disabled = adultos <= 0);
        document.querySelectorAll('.plus[data-type="menor"]').forEach(btn => btn.disabled = menores >= 9);
        document.querySelectorAll('.minus[data-type="menor"]').forEach(btn => btn.disabled = menores <= 0);
        document.querySelectorAll('.plus[data-type="bebe"]').forEach(btn => btn.disabled = bebes >= 9);
        document.querySelectorAll('.minus[data-type="bebe"]').forEach(btn => btn.disabled = bebes <= 0);
    }

    document.querySelectorAll('.counter button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const type = this.dataset.type;
            const isPlus = this.classList.contains('plus');

            if (type === 'adulto') {
                if (isPlus && adultos < 9) adultos++;
                else if (!isPlus && adultos > 0) adultos--;
            } else if (type === 'menor') {
                if (isPlus && menores < 9) menores++;
                else if (!isPlus && menores > 0) menores--;
            } else if (type === 'bebe') {
                if (isPlus && bebes < 9) bebes++;
                else if (!isPlus && bebes > 0) bebes--;
            }
            actualizarPasajeros();
            actualizarBotones();
        });
    });
    actualizarPasajeros();
    actualizarBotones();

    // CARRUSEL DE DESTINOS

    const grid = document.querySelector('.destinos-grid');
    const puntos = document.querySelectorAll('.pagina-punto');
    const flechaDer = document.querySelector('.flecha-destinos.flecha-der');
    const flechaIzq = document.querySelector('.flecha-destinos.flecha-izq');

    if (grid && puntos.length > 0) {
        let paginaActual = 0;
        const totalPaginas = 5;
        const tarjetasPorPagina = 4;
        const desplazamiento = 257;

        function deslizarA(pagina) {
            const desplazamientoX = pagina * (desplazamiento * tarjetasPorPagina);
            grid.style.transform = `translateX(-${desplazamientoX}px)`;

            puntos.forEach((punto, index) => {
                punto.classList.toggle('activo', index === pagina);
            });

            if (flechaIzq) flechaIzq.style.display = pagina === 0 ? 'none' : 'flex';
            if (flechaDer) flechaDer.style.display = pagina === totalPaginas - 1 ? 'none' : 'flex';
            paginaActual = pagina;
        }

        flechaDer?.addEventListener('click', () => {
            if (paginaActual < totalPaginas - 1) deslizarA(paginaActual + 1);
        });

        flechaIzq?.addEventListener('click', () => {
            if (paginaActual > 0) deslizarA(paginaActual - 1);
        });

        puntos.forEach((punto, index) => {
            punto.addEventListener('click', () => deslizarA(index));
        });

        // Inicialización
        document.querySelectorAll('.destino-card').forEach(card => card.style.display = 'block');
        deslizarA(0);
    }
    // ICONOS DE SERVICIOS (HOVER)

    const servicios = {
        'yavas.svg': 'yavas-morado.svg',
        'business.svg': 'business-morado.svg',
        'grupos.svg': 'grupos-morado.svg',
        'beneficios.svg': 'beneficios-morado.svg',
        'carga.svg': 'carga-morado.svg'
    };

    document.querySelectorAll('.card-servicio').forEach(card => {
        const img = card.querySelector('.icono-servicio img');
        if (img) {
            const originalSrc = img.src.split('/').pop();
            card.addEventListener('mouseenter', () => {
                if (servicios[originalSrc]) img.src = img.src.replace(originalSrc, servicios[originalSrc]);
            });
            card.addEventListener('mouseleave', () => {
                if (servicios[originalSrc]) img.src = img.src.replace(servicios[originalSrc], originalSrc);
            });
        }
    });

    // MODAL DE RESERVA
    const modal = document.getElementById('miModal');
    const modalContent = modal ? modal.querySelector('.modal-content') : null;
    const closeBtn = modal ? modal.querySelector('.close-btn') : null;

    // Abre el modal y opcionalmente llena el campo de destino con el texto de la tarjeta
    document.querySelectorAll('.reserva-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Intentar obtener el nombre del destino desde la tarjeta
            const cardInfo = e.currentTarget.closest('.destino-info');
            const destinoTexto = cardInfo ? (cardInfo.querySelector('h3')?.textContent || '') : '';
            const modalDestino = document.getElementById('modal-destino');
            if (modalDestino && destinoTexto) modalDestino.value = destinoTexto;

            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (!e.target.closest('.modal-content')) {
                modal.style.display = 'none';
            }
        });
    }

});