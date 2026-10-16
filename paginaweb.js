    var total = 0;
    var carrito = [];

    document.querySelectorAll('.precio').forEach(function(etiqueta) {
      var original = Number(etiqueta.textContent.replace(/[^\d.]/g, ''));
      var rebajado = Math.round(original * 0.9 * 100) / 100;
      etiqueta.innerHTML = '<del>S/ ' + original.toFixed(2) + '</del><strong>S/ ' + rebajado.toFixed(2) + '</strong>';
    });

    var modalAniversario = document.getElementById('modal-aniversario');
    modalAniversario.showModal();

    var modalDetalleJuego = document.getElementById('modal-detalle-juego');
    var detalleImagen = document.getElementById('detalle-imagen');
    var detallePlataforma = document.getElementById('detalle-plataforma');
    var detalleTitulo = document.getElementById('detalle-titulo');
    var detalleResumen = document.getElementById('detalle-resumen');
    var detalleLista = document.getElementById('detalle-lista');
    var detallePrecio = document.getElementById('detalle-precio');
    var botonDetalleComprar = document.getElementById('boton-detalle-comprar');
    var cerrarDetalleBoton = document.getElementById('cerrar-detalle');

    function cerrarAniversario() {
      modalAniversario.close();
    }

    function cerrarDetalleJuego() {
      modalDetalleJuego.classList.remove('activo');
      modalDetalleJuego.setAttribute('aria-hidden', 'true');
    }

    function obtenerDescripcionJuego(titulo) {
      var descripciones = {
        'Cyberpunk 2077': 'Cyberpunk 2077 te sumerge en Night City, una metrópolis futurista llena de peligros, tramas complejas y decisiones que cambian tu destino. Explora barrios peligrosos, mejora tu estilo de vida, crea tu propio legado y vive una historia de corrupción, ambición y supervivencia en un mundo completamente abierto.',
        'Elden Ring': 'Elden Ring es una odisea épica de exploración, combate y descubrimiento. Te espera un vasto mundo repleto de ruinas ancestrales, criaturas colosales, mazmorras escondidas y una narrativa misteriosa que invita a cada jugador a escribir su propia aventura y a enfrentarse a encuentros legendarios.',
        'GTA V': 'GTA V combina acción, humor y libertad sin límites en Los Santos. Con una mezcla de misiones principales, actividades paralelas, mundo abierto y personajes memorables, el juego ofrece una experiencia completa para explorar, conducir, rolear y vivir historias intensas en cada rincón de la ciudad.',
        'Minecraft': 'Minecraft transforma la creatividad en un juego infinito. Construye refugios, explora paisajes enormes, extrae recursos, crea herramientas y vive tanto la aventura de sobrevivir como el placer de diseñar tu propio mundo, ya sea solo o en compañía de otros jugadores.',
        'Red Dead Redemption 2': 'Red Dead Redemption 2 te lleva al salvaje oeste con una narrativa profunda, paisajes cinematográficos y una jugabilidad cuidadosa en cada detalle. Desde cazar, montar y explorar hasta vivir la historia de Arthur Morgan y su banda, cada momento se siente intenso, inmersivo y memorable.',
        'God of War Ragnarök': 'God of War Ragnarök sigue la épica saga nórdica con una historia poderosa, narración brillante y combates brutales. Viaja por reinos mitológicos, enfrenta enemigos colosales, descubre secretos ancestrales y vive una aventura emocional donde la fuerza, la estrategia y la familia se convierten en el centro del conflicto.',
        'Hogwarts Legacy': 'Hogwarts Legacy te permite adentrarte en el mundo mágico de Hogwarts con libertad para explorar, aprender hechizos, descubrir misterios y vivir una historia original dentro del universo de Harry Potter. Cada rincón del castillo y del bosque que lo rodea tiene secretos, magia y peligros por descubrir.',
        'The Last of Us Part I': 'The Last of Us Part I ofrece una experiencia narrativa intensa y realista en un mundo postapocalíptico. Con personajes profundamente humanos, tensión constante y una dirección artística excepcional, cada viaje se vuelve emocional, táctico y memorable, desde los primeros pasos hasta la decisión final.',
        'Resident Evil 4 Remake': 'Resident Evil 4 Remake revive el clásico con una mezcla brutal de terror, tensión y acción. Enfréntate a enemigos mutantes, resuelve enigmas, gestiona recursos limitados y vive una experiencia de supervivencia que exige concentración, valentía y precisión en cada segundo.',
        'Call of Duty: MW III': 'Call of Duty: MW III pone la acción a toda velocidad con combates intensos, mapas dinámicos y una intensidad competitiva que exige reflejos rápidos y trabajo en equipo. Es una experiencia de disparos moderna pensada para jugadores que buscan adrenalina, precisión y partidas espectaculares.',
        'Zelda: Tears of the Kingdom': 'Zelda: Tears of the Kingdom lleva la exploración a un nivel completamente nuevo con un vasto mundo lleno de secretos, puzles y viajes asombrosos. Usando creatividad, ingenio y nuevas mecánicas, cada descubrimiento se convierte en una aventura gigantesca con mucho valor de exploración.',
        'EA SPORTS FC 24': 'EA SPORTS FC 24 ofrece una experiencia futbolística realista y competitiva con equipos, jugadores y dinámicas del mundo del fútbol moderno. Desde partidas rápidas hasta estrategias más profundas, cada partido invita a disfrutar del deporte con precisión, improvisación y control total del terreno.',
        "Marvel's Spider-Man 2": 'Marvel\'s Spider-Man 2 eleva la sensación de ser un héroe al máximo con combates ágiles, una historia emocionante y un mapa de la ciudad lleno de detalles. Salta entre edificios, resuelve conflictos urbanos y vive una aventura llena de velocidad, estilo y emoción.',
        'Super Mario Wonder': 'Super Mario Wonder ofrece una vuelta de tuerca fresca y alegre al universo clásico de Mario. Con niveles coloridos, nuevas mecánicas, creatividad constante y una energía caricaturesca, el juego es perfecto para explorar, saltar y disfrutar de una aventura accesible y espectacular.',
        'Final Fantasy XVI': 'Final Fantasy XVI presenta una aventura épica con combates intensos, un diseño visual impresionante y una narrativa de grandes consecuencias. En un mundo lleno de magia, conflicto y leyendas, la historia se convierte en una experiencia grandiosa para los amantes del RPG.',
        'Starfield': 'Starfield te lleva a explorar el espacio con un enfoque de ciencia ficción abierto y profundo. Descubre planetas, construye tu historia, gestiona tu equipo y vive una aventura de exploración que combina creatividad, misterio y la sensación de estar al borde de lo desconocido.',
        'Mortal Kombat 1': 'Mortal Kombat 1 vuelve con una mezcla brutal de acción, estrategia y espectáculo. Cada pelea exige timing, combos y precisión, ofreciendo una experiencia visceral para los fans del combate cuerpo a cuerpo y para quienes disfrutan de duelos intensos y explosivos.',
        'Diablo IV': 'Diablo IV combina acción intensa, personalización y una aventura oscura llena de desafíos. Explora mazmorras, mejora tu personaje, toma decisiones decisivas y lucha contra hordas de criaturas para conseguir premios, fama y sobrevivir en un mundo terrible y fascinante.',
        'Grand Theft Auto VI': 'Grand Theft Auto VI promete una nueva era de libertad criminal en un entorno enorme, vibrante y lleno de posibilidades. Con música, paisajes variados y una narrativa que mezcla acción, estilo y caos, la experiencia se presenta como una aventura abierta de impacto global.',
        'Silent Hill 2 Remake': 'Silent Hill 2 Remake transforma el terror psicológico en una obra inquietante y envolvente. La tensión, la oscuridad y la historia que se va revelando crean una experiencia claustrofóbica y emocional, ideal para quienes buscan miedo, misterio y una atmósfera inolvidable.'
      };
      return descripciones[titulo] || 'Siente la emoción de entrar en un mundo lleno de acción, exploración y decisiones que importan. Este juego combina historia, tiempo de juego intenso, una presentación visual cuidada y mecánicas que hacen que cada partida sea distinta, memorable y adictiva.';
    }

    function obtenerListaJuego(titulo) {
      var listas = {
        'Cyberpunk 2077': ['Mundo abierto de estilo futurista', 'Historia con decisiones importantes', 'Combate, personalización y persecuciones', 'Night City lleno de secretos y conflictos'],
        'Elden Ring': ['Exploración libre por un mundo gigantesco', 'Combate desafiante y táctico', 'Extraños enemigos y jefes legendarios', 'Narrativa y entorno ricos en misterio'],
        'GTA V': ['Larga variedad de misiones', 'Mundo abierto con libertad total', 'Acción, conducción y caos urbano', 'Personajes con historias memorables'],
        'Minecraft': ['Construcción total y creatividad', 'Supervivencia con recursos limitados', 'Exploración de biomas y cuevas', 'Modo creativo y cooperativo'],
        'Red Dead Redemption 2': ['Paisajes realistas y cinematográficos', 'Historia profunda y envolvente', 'Cacería, rutas y supervivencia', 'Experiencia inmersiva del salvaje oeste'],
        'God of War Ragnarök': ['Combates intensos y fluidos', 'Narrativa emocional y épica', 'Exploración de reinos mitológicos', 'Jefes legendarios y cinematografía de alto nivel'],
        'Hogwarts Legacy': ['Explora Hogwarts y sus secretos', 'Aprende magia y hechizos', 'Mundo abierto con historia original', 'Tensión, aventura y descubrimiento'],
        'The Last of Us Part I': ['Historia profunda y emocional', 'Tensión constante y supervivencia', 'Exploración de entornos inmersivos', 'Aventura narrativa con gran impacto'],
        'Resident Evil 4 Remake': ['Terror intenso y supervivencia', 'Combates estratégicos y explosivos', 'Mecánicas de gestión de recursos', 'Atmosfera claustrofóbica y cinematográfica'],
        'Call of Duty: MW III': ['Acción intensa y rápida', 'Modo multijugador competitivo', 'Mapas dinámicos y campanas', 'Experiencia de disparos moderna'],
        'Zelda: Tears of the Kingdom': ['Mundo gigantesco para explorar', 'Puzles y creatividad', 'Nuevas herramientas y posibilidades', 'Aventura magistral de acción y descubrimiento'],
        'EA SPORTS FC 24': ['Jugabilidad realista y competitiva', 'Equipos reales y modalidades variadas', 'Control total del juego', 'Perfecto para amantes del fútbol'],
        "Marvel's Spider-Man 2": ['Movilidad vertical y combatientes', 'Ciudad llena de detalles y misiones', 'Historia de superhéroes intensa', 'Sencillo de disfrutar y muy vistoso'],
        'Super Mario Wonder': ['Niveles coloridos y creativos', 'Mecánicas sencillas y divertidas', 'Ideal para toda la familia', 'Experiencia clásica con toque moderno'],
        'Final Fantasy XVI': ['RPG épico con gran producción', 'Combates dinámicos y espectaculares', 'Historia con peso emocional', 'Mundo fantástico con gran identidad'],
        'Starfield': ['Exploración espacial gigantesca', 'Planetas, recursos y enigmas', 'Historia y creación de identidad', 'Futuro, ciencia ficción y adventure'],
        'Mortal Kombat 1': ['Combates brutales y competitivos', 'Técnicas, combos y estrategia', 'Personajes icónicos del universo', 'Modo de partida intenso y emocionante'],
        'Diablo IV': ['Mundo oscuro y lleno de peligros', 'Personalización de personajes', 'Mazmorras y desafíos constantes', 'Acción infernal con gran poder'],
        'Grand Theft Auto VI': ['Mundo abierto con inmensa libertad', 'Estilo de vida criminal y aventura', 'Eventos, tráfico y ciudades vibrantes', 'Experiencia moderna de alto impacto'],
        'Silent Hill 2 Remake': ['Terror psicológico atmosférico', 'Historia intensa y desconcertante', 'Exploración claustrofóbica', 'Misterio y supervivencia en cada paso']
      };
      return listas[titulo] || ['Mecánicas destacadas', 'Jugabilidad intensa', 'Historia envolvente', 'Experiencia visual premium'];
    }

    function abrirDetalleJuego(tarjeta) {
      var titulo = tarjeta.querySelector('.titulo-juego').textContent.trim();
      var precioTexto = tarjeta.querySelector('.precio strong') ? tarjeta.querySelector('.precio strong').textContent : 'S/ 0.00';
      var precio = Number(precioTexto.replace(/[^\d.]/g, '')); 
      var imagen = tarjeta.querySelector('.imagen-juego').src;
      var plataforma = tarjeta.querySelector('.plataforma').textContent.trim();

      detalleTitulo.textContent = titulo;
      detallePlataforma.textContent = plataforma;
      detalleResumen.textContent = obtenerDescripcionJuego(titulo);
      detalleLista.innerHTML = obtenerListaJuego(titulo).map(function(item) {
        return '<li>' + item + '</li>';
      }).join('');
      detalleImagen.src = imagen;
      detalleImagen.alt = titulo;
      detallePrecio.textContent = 'S/ ' + precio.toFixed(2);
      botonDetalleComprar.onclick = function() {
        agregarJuego(titulo, precio);
        cerrarDetalleJuego();
      };

      modalDetalleJuego.classList.add('activo');
      modalDetalleJuego.setAttribute('aria-hidden', 'false');
    }

    document.querySelectorAll('.boton-imagen').forEach(function(boton) {
      boton.addEventListener('click', function() {
        abrirDetalleJuego(boton.closest('.tarjeta-juego'));
      });
    });

    cerrarDetalleBoton.addEventListener('click', cerrarDetalleJuego);
    modalDetalleJuego.addEventListener('click', function(event) {
      if (event.target === modalDetalleJuego) {
        cerrarDetalleJuego();
      }
    });
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modalDetalleJuego.classList.contains('activo')) {
        cerrarDetalleJuego();
      }
    });

    function renderCarrito() {
      var listaCarrito = document.getElementById('lista-carrito');
      total = carrito.reduce(function(acumulado, item) {
        return acumulado + item.precio * item.cantidad;
      }, 0);

      var totalArticulos = carrito.reduce(function(acc, item) { return acc + item.cantidad; }, 0);
      document.getElementById('contador-carrito').textContent = totalArticulos;

      if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="carrito-vacio">Aún no has agregado juegos.</p>';
        document.getElementById('total-precio').textContent = '0.00';
        return;
      }

      listaCarrito.innerHTML = carrito.map(function(item) {
        return '<div class="item-carrito"><span><strong>' + item.nombre + '</strong> x' + item.cantidad + '</span><span>S/ ' + (item.precio * item.cantidad).toFixed(2) + '</span></div>';
      }).join('');
      document.getElementById('total-precio').textContent = total.toFixed(2);
    }

    function actualizarCarrito(nombre, precio) {
      var item = carrito.find(function(juego) { return juego.nombre === nombre; });
      if (item) {
        item.cantidad += 1;
      } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
      }
      renderCarrito();
    }

    function vaciarCarrito() {
      carrito = [];
      renderCarrito();
    }

    function agregarJuego(nombre, precio) {
      actualizarCarrito(nombre, Math.round(precio * 0.9 * 100) / 100);
    }

    function realizarCompra() {
      if (carrito.length === 0) {
        window.alert('Tu bolsa está vacía. Agrega un juego antes de continuar.');
        return;
      }
      var detalle = carrito.map(function(item) {
        return item.nombre + ' x' + item.cantidad + ' — S/ ' + (item.precio * item.cantidad).toFixed(2);
      }).join('\n');

      window.alert('¡Gracias por tu compra en Pixel Store!\n\n' + detalle + '\n\nTotal: S/ ' + total.toFixed(2));
      vaciarCarrito();
    }

    var tarjetasJuego = Array.from(document.querySelectorAll('.tarjeta-juego'));
    var filtrosLaterales = Array.from(document.querySelectorAll('[data-filtro]'));
    var categoriaActiva = 'todos';
    var normalizarTexto = function(texto) {
      return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };

    function actualizarCatalogo() {
      var consulta = normalizarTexto(document.getElementById('busqueda-juegos').value.trim());
      var filtrosGenero = filtrosLaterales.filter(function(filtro) {
        return filtro.checked && filtro.dataset.filtro === 'genero';
      }).map(function(filtro) { return filtro.value; });
      var filtrosPlataforma = filtrosLaterales.filter(function(filtro) {
        return filtro.checked && filtro.dataset.filtro === 'plataforma';
      }).map(function(filtro) { return filtro.value; });
      var orden = document.getElementById('orden-juegos').value;

      tarjetasJuego.forEach(function(tarjeta, indice) {
        var categorias = tarjeta.dataset.categoria.split(' ');
        var textoBusqueda = normalizarTexto(tarjeta.dataset.busqueda);
        var plataformas = categorias.filter(function(categoria) {
          return ['pc', 'ps5', 'xbox', 'switch'].includes(categoria);
        });
        var coincideCategoria = categoriaActiva === 'todos' || categorias.includes(categoriaActiva);
        var coincideBusqueda = !consulta || textoBusqueda.includes(consulta);
        var coincideGenero = !filtrosGenero.length || filtrosGenero.some(function(genero) {
          return categorias.includes(genero);
        });
        var coincidePlataforma = !filtrosPlataforma.length || filtrosPlataforma.some(function(plataforma) {
          return plataformas.includes(plataforma);
        });

        tarjeta.dataset.ordenOriginal = indice;
        tarjeta.style.display = coincideCategoria && coincideBusqueda && coincideGenero && coincidePlataforma ? 'flex' : 'none';
      });

      var visibles = tarjetasJuego.filter(function(tarjeta) {
        return tarjeta.style.display !== 'none';
      });
      visibles.sort(function(a, b) {
        if (orden === 'destacados') {
          return Number(a.dataset.ordenOriginal) - Number(b.dataset.ordenOriginal);
        }
        var precioA = Number(a.querySelector('.precio strong').textContent.replace(/[^\d.]/g, ''));
        var precioB = Number(b.querySelector('.precio strong').textContent.replace(/[^\d.]/g, ''));
        return orden === 'menor-precio' ? precioA - precioB : precioB - precioA;
      }).forEach(function(tarjeta) {
        document.getElementById('catalogo-juegos').appendChild(tarjeta);
      });

      document.getElementById('cantidad-resultados').textContent =
        'Mostrando ' + visibles.length + ' de ' + tarjetasJuego.length + ' juegos';
      document.getElementById('sin-resultados').hidden = visibles.length > 0;
    }

    document.querySelectorAll('.cat-link').forEach(function(boton) {
      boton.addEventListener('click', function() {
        document.querySelectorAll('.cat-link').forEach(function(item) { item.classList.remove('activo'); });
        boton.classList.add('activo');
        categoriaActiva = boton.dataset.filtro;
        actualizarCatalogo();
      });
    });

    document.getElementById('busqueda-juegos').addEventListener('input', actualizarCatalogo);
    document.getElementById('orden-juegos').addEventListener('change', actualizarCatalogo);
    filtrosLaterales.forEach(function(filtro) {
      filtro.addEventListener('change', actualizarCatalogo);
    });

    renderCarrito();
    actualizarCatalogo();
