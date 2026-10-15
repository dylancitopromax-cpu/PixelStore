(() => {
  const USERS_KEY = 'pixelStoreUsuarios';
  const SESSION_KEY = 'pixelStoreSesion';
  const HASH_ITERATIONS = 210000;
  const loginForm = document.getElementById('formulario-login');
  const registerForm = document.getElementById('formulario-registro');
  const profilePanel = document.getElementById('perfil-guardado');
  const statusMessage = document.getElementById('mensaje-acceso');
  const tabs = {
    login: document.getElementById('pestana-login'),
    register: document.getElementById('pestana-registro')
  };

  function setMessage(message, isError) {
    statusMessage.textContent = message;
    statusMessage.classList.toggle('error', Boolean(isError));
    statusMessage.hidden = !message;
  }

  function readUsers() {
    const savedUsers = localStorage.getItem(USERS_KEY);
    if (savedUsers === null) return [];

    const users = JSON.parse(savedUsers);
    if (!Array.isArray(users) || users.some((user) =>
      !user || typeof user.correo !== 'string' ||
      typeof user.passwordHash !== 'string' ||
      typeof user.passwordSalt !== 'string'
    )) {
      throw new Error('Los datos guardados de las cuentas tienen un formato inválido.');
    }
    return users;
  }

  function bytesToBase64(bytes) {
    let binary = '';
    bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
    return btoa(binary);
  }

  function base64ToBytes(value) {
    return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
  }

  async function hashPassword(password, salt, iterations) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error('Tu navegador no permite proteger la contraseña. Abre la página con Live Server o en un navegador actualizado.');
    }
    const key = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const hash = await window.crypto.subtle.deriveBits({
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    }, key, 256);
    return new Uint8Array(hash);
  }

  async function createPasswordRecord(password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const hash = await hashPassword(password, salt, HASH_ITERATIONS);
    return {
      passwordSalt: bytesToBase64(salt),
      passwordHash: bytesToBase64(hash),
      passwordIterations: HASH_ITERATIONS
    };
  }

  async function verifyPassword(password, user) {
    const salt = base64ToBytes(user.passwordSalt);
    const iterations = Number(user.passwordIterations);
    if (!Number.isInteger(iterations) || iterations < 1) {
      throw new Error('La configuración de seguridad de esta cuenta no es válida.');
    }
    const hash = await hashPassword(password, salt, iterations);
    return bytesToBase64(hash) === user.passwordHash;
  }

  function showMode(mode) {
    const isProfile = mode === 'profile';
    loginForm.hidden = mode !== 'login';
    registerForm.hidden = mode !== 'register';
    profilePanel.hidden = !isProfile;
    document.querySelector('.pestanas').hidden = isProfile;
    statusMessage.hidden = true;
    statusMessage.textContent = '';

    if (!isProfile) {
      const selectedTab = mode === 'login' ? tabs.login : tabs.register;
      Object.values(tabs).forEach((tab) => {
        const selected = tab === selectedTab;
        tab.classList.toggle('activa', selected);
        tab.setAttribute('aria-selected', String(selected));
      });
    }
  }

  function appendProfileField(list, label, value) {
    const item = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    item.className = 'dato-perfil';
    term.textContent = label;
    description.textContent = value;
    item.append(term, description);
    list.appendChild(item);
  }

  function showProfile(user) {
    showMode('profile');
    document.getElementById('saludo-perfil').textContent = `¡Bienvenido/a, ${user.nombre}!`;
    const initials = `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase();
    document.querySelector('.avatar-perfil').textContent = initials;
    const details = document.getElementById('datos-perfil');
    details.replaceChildren();
    [
      ['Nombre', `${user.nombre} ${user.apellido}`],
      ['Correo electrónico', user.correo],
      ['DNI / Documento', user.dni],
      ['Teléfono', user.telefono],
      ['País / Región', user.pais],
      ['Plataforma preferida', user.plataforma],
      ['Tipo de cuenta', user.tipoCuenta],
      ['Membresía', user.suscripcion]
    ].forEach(([label, value]) => appendProfileField(details, label, value));
  }

  function showAccountError(error) {
    console.error('No se pudo completar la operación de cuenta de Pixel Store.', error);
    setMessage(`No se pudo completar la operación: ${error.message}`, true);
  }

  Object.entries(tabs).forEach(([mode, tab]) => {
    tab.addEventListener('click', () => showMode(mode));
  });
  document.querySelectorAll('[data-mostrar]').forEach((button) => {
    button.addEventListener('click', () => showMode(button.dataset.mostrar));
  });

  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('', false);
    if (!registerForm.reportValidity()) return;

    const data = new FormData(registerForm);
    const user = {
      nombre: data.get('nombre').trim(),
      apellido: data.get('apellido').trim(),
      dni: data.get('dni').trim(),
      telefono: data.get('telefono').trim(),
      correo: data.get('correo').trim().toLowerCase(),
      pais: data.get('pais'),
      plataforma: data.get('plataforma'),
      tipoCuenta: data.get('tipoCuenta'),
      suscripcion: data.get('suscripcion')
    };

    try {
      const users = readUsers();
      if (users.some((savedUser) => savedUser.correo === user.correo)) {
        setMessage('Ese correo ya está registrado. Inicia sesión con esa cuenta.', true);
        return;
      }

      const passwordRecord = await createPasswordRecord(data.get('password'));
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, { ...user, ...passwordRecord }]));
      registerForm.reset();
      document.getElementById('login-correo').value = user.correo;
      showMode('login');
      setMessage('Cuenta creada correctamente. Inicia sesión para ver tu perfil guardado.', false);
    } catch (error) {
      showAccountError(error);
    }
  });

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('', false);
    if (!loginForm.reportValidity()) return;

    const correo = document.getElementById('login-correo').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;

    try {
      const users = readUsers();
      const user = users.find((savedUser) => savedUser.correo === correo);
      if (!user || !(await verifyPassword(password, user))) {
        setMessage('Correo o contraseña incorrectos.', true);
        return;
      }
      localStorage.setItem(SESSION_KEY, user.correo);
      loginForm.reset();
      showProfile(user);
    } catch (error) {
      showAccountError(error);
    }
  });

  document.getElementById('boton-cerrar-sesion').addEventListener('click', () => {
    try {
      localStorage.removeItem(SESSION_KEY);
      showMode('login');
      setMessage('Has cerrado sesión.', false);
    } catch (error) {
      showAccountError(error);
    }
  });

  try {
    const sessionEmail = localStorage.getItem(SESSION_KEY);
    if (sessionEmail) {
      const user = readUsers().find((savedUser) => savedUser.correo === sessionEmail);
      if (user) {
        showProfile(user);
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  } catch (error) {
    showAccountError(error);
  }
})();
