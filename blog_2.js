const enlaces = document.querySelectorAll('[data-seccion]');
const secciones = document.querySelectorAll('.seccion');
const presentacion = document.querySelector('.hero');
const avisoVirus = document.getElementById('aviso-virus');
const tituloAviso = document.getElementById('titulo-aviso');
const textoAviso = document.getElementById('texto-aviso');
const continuarAviso = document.getElementById('continuar-aviso');
const formularioRegistro = document.getElementById('formulario-registro-blog');
const formularioLogin = document.getElementById('formulario-login-blog');
const carrusel = document.querySelector('.carrusel-pista');
const botonAnterior = document.querySelector('.flecha-carrusel.anterior');
const botonSiguiente = document.querySelector('.flecha-carrusel.siguiente');
const cantidadImagenes = carrusel.children.length;
const dialogoDetalle = document.getElementById('dialogo-detalle');
const imagenDetalle = document.getElementById('imagen-detalle');
const tituloDetalle = document.getElementById('titulo-detalle');
const descripcionDetalle = document.getElementById('descripcion-detalle');
const botonCerrarDetalle = document.querySelector('.cerrar-detalle');
let elementoDisparadorDetalle = null;
let imagenActual = 0;

const mensajesAviso = [
  {
    titulo: '¡Esta página tiene 1000 virus!',
    texto: 'Tranquilo, es una broma. No hay ningún virus muejejeje xddd'
  },
  {
    titulo: 'Revisando tu computadora...',
    texto: 'Resultado: encontramos muchas ganas de ver este portafolio.'
  },
  {
    titulo: '¡Todo listo!',
    texto: 'No hay virus. Ahora sí, disfruta la página.'
  }
];
let mensajeActual = 0;

avisoVirus.showModal();

document.querySelectorAll('.proyecto-card, .meta-card, .juego-card').forEach(function (tarjeta) {
  tarjeta.addEventListener('click', function (evento) {
    if (tarjeta.matches('details')) {
      evento.preventDefault();
    }

    elementoDisparadorDetalle = tarjeta.matches('details')
      ? tarjeta.querySelector('summary')
      : tarjeta;
    const imagen = tarjeta.querySelector('img');
    const titulo = tarjeta.querySelector('.tarjeta-texto strong, .juego-body h3');
    const descripcion = tarjeta.querySelector('.tarjeta-descripcion, .juego-razon, .proyecto-card > p, .meta-card > p');

    if (!imagen || !titulo || !descripcion) {
      throw new Error('No se pudo cargar la imagen o descripción de esta tarjeta.');
    }

    imagenDetalle.src = imagen.currentSrc || imagen.src;
    imagenDetalle.alt = imagen.alt;
    tituloDetalle.textContent = titulo.textContent.trim();
    descripcionDetalle.textContent = descripcion.textContent.trim();
    dialogoDetalle.showModal();
  });

  tarjeta.addEventListener('keydown', function (evento) {
    if (!tarjeta.matches('.juego-card') || (evento.key !== 'Enter' && evento.key !== ' ')) {
      return;
    }

    evento.preventDefault();
    tarjeta.click();
  });
});

botonCerrarDetalle.addEventListener('click', function () {
  dialogoDetalle.close();
});

dialogoDetalle.addEventListener('close', function () {
  if (elementoDisparadorDetalle && elementoDisparadorDetalle.isConnected) {
    elementoDisparadorDetalle.focus();
  }
});

carrusel.setAttribute('aria-live', 'off');
function mostrarImagen(indice) {
  imagenActual = (indice + cantidadImagenes) % cantidadImagenes;
  carrusel.style.transform = 'translateX(-' + imagenActual * 100 + '%)';
}

botonAnterior.addEventListener('click', function () {
  mostrarImagen(imagenActual - 1);
});

botonSiguiente.addEventListener('click', function () {
  mostrarImagen(imagenActual + 1);
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(function () {
    if (document.hidden) {
      return;
    }

    mostrarImagen(imagenActual + 1);
  }, 3500);
}

continuarAviso.addEventListener('click', function () {
  mensajeActual++;

  if (mensajeActual < mensajesAviso.length) {
    tituloAviso.textContent = mensajesAviso[mensajeActual].titulo;
    textoAviso.textContent = mensajesAviso[mensajeActual].texto;
  } else {
    avisoVirus.close();
  }
});

formularioRegistro.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const nombre = document.getElementById('registro-nombre');
  const correo = document.getElementById('registro-correo');
  const password = document.getElementById('registro-password');
  const mensaje = document.getElementById('mensaje-registro');
  let valido = true;

  document.getElementById('error-registro-nombre').textContent = '';
  document.getElementById('error-registro-correo').textContent = '';
  document.getElementById('error-registro-password').textContent = '';
  mensaje.textContent = '';

  if (!nombre.checkValidity()) {
    document.getElementById('error-registro-nombre').textContent = 'Escribe al menos 3 letras.';
    valido = false;
  }
  if (!correo.checkValidity()) {
    document.getElementById('error-registro-correo').textContent = 'Escribe un correo válido.';
    valido = false;
  }
  if (!password.checkValidity()) {
    document.getElementById('error-registro-password').textContent = 'Usa al menos 6 caracteres.';
    valido = false;
  }

  if (valido) {
    const usuarios = JSON.parse(localStorage.getItem('usuariosBlog')) || [];
    let existe = false;

    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].correo === correo.value.trim().toLowerCase()) {
        existe = true;
      }
    }

    if (existe) {
      mensaje.textContent = 'Ese correo ya está registrado.';
    } else {
      usuarios.push({
        nombre: nombre.value.trim(),
        correo: correo.value.trim().toLowerCase(),
        password: password.value
      });
      localStorage.setItem('usuariosBlog', JSON.stringify(usuarios));
      mensaje.textContent = 'Cuenta creada. Ya puedes iniciar sesión.';
      formularioRegistro.reset();
    }
  }
});

formularioLogin.addEventListener('submit', function (evento) {
  evento.preventDefault();

  const correo = document.getElementById('login-correo').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  const mensaje = document.getElementById('mensaje-login');
  const usuarios = JSON.parse(localStorage.getItem('usuariosBlog')) || [];
  let nombre = '';

  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].correo === correo && usuarios[i].password === password) {
      nombre = usuarios[i].nombre;
    }
  }

  if (nombre === '') {
    mensaje.textContent = 'Correo o contraseña incorrectos.';
  } else {
    mensaje.textContent = '¡Bienvenido/a, ' + nombre + '!';
    formularioLogin.reset();
  }
});

function mostrarSeccion(id) {
  presentacion.hidden = id !== 'sobre-mi';

  secciones.forEach(function (seccion) {
    seccion.hidden = seccion.id !== id;
  });

  enlaces.forEach(function (enlace) {
    if (enlace.dataset.seccion === id) {
      enlace.setAttribute('aria-current', 'page');
    } else {
      enlace.removeAttribute('aria-current');
    }
  });
}

enlaces.forEach(function (enlace) {
  enlace.addEventListener('click', function (evento) {
    evento.preventDefault();
    mostrarSeccion(enlace.dataset.seccion);
    history.replaceState(null, '', '#' + enlace.dataset.seccion);
  });
});

if (Array.from(secciones).some(function (seccion) {
  return seccion.id === location.hash.slice(1);
})) {
  mostrarSeccion(location.hash.slice(1));
} else {
  mostrarSeccion('cuenta');
}
