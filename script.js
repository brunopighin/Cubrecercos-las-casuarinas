/**
 * CUBRECERCOS LAS CASUARINAS – script.js
 * - Menú hamburguesa (mobile)
 * - Scroll suave y cierre de menú al hacer clic
 * - Header con sombra al hacer scroll
 * - Animaciones reveal al hacer scroll (IntersectionObserver)
 * - Formulario de presupuesto → genera mensaje y abre WhatsApp
 */

/* ============================================================
   1. MENÚ HAMBURGUESA
   ============================================================ */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ============================================================
   2. HEADER SOMBRA AL SCROLL
   ============================================================ */
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ============================================================
   3. ANIMACIONES REVEAL AL HACER SCROLL
   ============================================================ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger pequeño para elementos en grilla
        const delay = (i % 4) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach(el => revealObserver.observe(el));

/* ============================================================
   4. FORMULARIO → MENSAJE WHATSAPP
   ============================================================ */
const form       = document.getElementById('form-presupuesto');
const formError  = document.getElementById('form-error');

// Número de WhatsApp (sin +, sin espacios)
const WA_NUMBER = '542323654029';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  formError.textContent = '';

  // --- Obtener valores ---
  const nombre     = document.getElementById('nombre').value.trim();
  const telefono   = document.getElementById('telefono').value.trim();
  const localidad  = document.getElementById('localidad').value.trim();
  const metros     = document.getElementById('metros').value.trim();
  const alto       = document.getElementById('alto').value.trim();
  const color      = document.getElementById('color').value.trim() || 'No especificado';
  const mensaje    = document.getElementById('mensaje').value.trim();

  const colocacionEl = form.querySelector('input[name="colocacion"]:checked');
  const botonesEl    = form.querySelector('input[name="botones"]:checked');

  // --- Validación básica ---
  if (!nombre) {
    formError.textContent = 'Por favor, ingresá tu nombre.';
    document.getElementById('nombre').focus();
    return;
  }

  if (!telefono) {
    formError.textContent = 'Por favor, ingresá tu teléfono.';
    document.getElementById('telefono').focus();
    return;
  }

  if (!localidad) {
    formError.textContent = 'Por favor, ingresá tu localidad.';
    document.getElementById('localidad').focus();
    return;
  }

  if (!metros || isNaN(metros) || Number(metros) <= 0) {
    formError.textContent = 'Ingresá los metros aproximados a cubrir.';
    document.getElementById('metros').focus();
    return;
  }

  if (!alto || isNaN(alto) || Number(alto) <= 0) {
    formError.textContent = 'Ingresá el alto del cerco en centímetros.';
    document.getElementById('alto').focus();
    return;
  }

  if (!colocacionEl) {
    formError.textContent = 'Indicá si necesitás colocación (Sí / No).';
    return;
  }

  if (!botonesEl) {
    formError.textContent = 'Indicá si necesitás botones (Sí / No).';
    return;
  }

  const colocacion = colocacionEl.value;
  const botones    = botonesEl.value;

  // --- Armar el mensaje para WhatsApp ---
  const lineas = [
    '🌿 *SOLICITUD DE PRESUPUESTO – Cubrecercos Las Casuarinas*',
    '',
    `👤 *Nombre:* ${nombre}`,
    `📱 *Teléfono:* ${telefono}`,
    `📍 *Localidad:* ${localidad}`,
    '',
    `📏 *Metros a cubrir:* ${metros} m`,
    `📐 *Alto del cerco:* ${alto} cm`,
    `🎨 *Color deseado:* ${color}`,
    `🔧 *¿Incluye colocación?:* ${colocacion}`,
    `🔘 *¿Necesita botones?:* ${botones}`,
  ];

  if (mensaje) {
    lineas.push('');
    lineas.push(`💬 *Mensaje adicional:* ${mensaje}`);
  }

  lineas.push('');
  lineas.push('¡Muchas gracias! Espero su respuesta.');

  const textoFinal = lineas.join('\n');

  // Codificar y abrir WhatsApp
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(textoFinal)}`;
  window.open(url, '_blank', 'noopener,noreferrer');

  // Feedback visual al usuario
  const btnSubmit = form.querySelector('.btn-submit');
  const textoOriginal = btnSubmit.innerHTML;
  btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> ¡Listo! Abriendo WhatsApp...';
  btnSubmit.style.background = '#16a34a';

  // Restaurar el botón después de 3 segundos
  setTimeout(() => {
    btnSubmit.innerHTML = textoOriginal;
    btnSubmit.style.background = '';
  }, 3000);
});

/* ============================================================
   5. SCROLL SUAVE AL HACER CLIC EN LINKS DE ANCLAJE
      (para browsers que no lo soportan nativamente)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY - 75;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});
