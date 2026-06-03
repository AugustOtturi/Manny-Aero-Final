// ============================================================
// Manny Aero — Mail Form Test Script
// Usage:  node test-mail.mjs [base-url]
// Default URL: http://localhost:4321
// Example:     node test-mail.mjs https://mannyaero.engeniodigital.tech
// ============================================================

const BASE = process.argv[2] ?? 'http://localhost:4321';
const ENDPOINT = `${BASE}/mail.php`;

// ── Helpers ──────────────────────────────────────────────────

async function post(label, payload) {
  process.stdout.write(`  ${label}... `);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.ok) {
      console.log(`✅  ${json.message ?? 'ok'}`);
    } else {
      console.log(`❌  ${json.error ?? 'unknown error'} (HTTP ${res.status})`);
    }
    return json;
  } catch (err) {
    console.log(`💥  Network error: ${err.message}`);
    return null;
  }
}

function sep(title) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ${title}`);
  console.log('─'.repeat(60));
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Test cases ───────────────────────────────────────────────

async function run() {
  console.log(`\n🛫  Manny Aero Mail Tests → ${ENDPOINT}\n`);

  // ─────────────────────────────────────────────────────────
  // BLOQUE 1 — Validaciones (van primero, antes de agotar el rate limit)
  // ─────────────────────────────────────────────────────────

  sep('VALIDACIÓN — Falta nombre (espera error 400)');
  await post('Sin firstName', {
    type: 'contact',
    website: '',
    firstName: '',
    lastName: 'Smith',
    email: 'test@test.com',
    phone: '', company: '', service: '', notes: '', flights: [],
  });

  sep('VALIDACIÓN — Email inválido (espera error 400)');
  await post('Email malo', {
    type: 'contact',
    website: '',
    firstName: 'John',
    lastName: 'Doe',
    email: 'esto-no-es-un-email',
    phone: '', company: '', service: '', notes: '', flights: [],
  });

  sep('VALIDACIÓN — Honeypot activado (silencioso, no manda correo)');
  await post('Bot spam', {
    type: 'contact',
    website: 'http://spam.com',   // honeypot relleno → bot
    firstName: 'Bot',
    lastName: 'Spammer',
    email: 'spam@spam.com',
    phone: '', company: '', service: '', notes: '', flights: [],
  });

  sep('VALIDACIÓN — Tipo desconocido (espera error 400)');
  await post('Tipo inválido', {
    type: 'suscripcion',
    email: 'test@test.com',
  });

  sep('EMAIL GATE — Email inválido (espera error 400)');
  await post('Gate: email malo', {
    type: 'gate',
    email: 'nope',
    fileName: 'Algún documento',
  });

  // ─────────────────────────────────────────────────────────
  // BLOQUE 2 — Formularios reales (usan el rate limit)
  // ─────────────────────────────────────────────────────────

  sep('CONTACTO — Mínimo: solo nombre + email');
  await post('Solo nombre y email', {
    type: 'contact',
    website: '',
    firstName: 'Sofia',
    lastName: 'Reyes',
    email: 'sofia.reyes@minimalist.io',
    phone: '',
    company: '',
    service: '',
    notes: '',
    flights: [],
  });

  sep('CONTACTO — Con teléfono, empresa y servicio, sin vuelos');
  await post('Sin vuelos, con servicio', {
    type: 'contact',
    website: '',
    firstName: 'Carlos',
    lastName: 'Mendez',
    email: 'cmendez@charter.mx',
    phone: '+52 55 1234 5678',
    company: 'AeroCharter MX',
    service: 'Landing / Overflight Permit',
    notes: 'Necesitamos permiso para sobrevuelo de espacio aéreo mexicano.',
    flights: [],
  });

  sep('CONTACTO — 1 vuelo completo');
  await post('Un vuelo completo', {
    type: 'contact',
    website: '',
    firstName: 'James',
    lastName: 'Holloway',
    email: 'j.holloway@testoperator.com',
    phone: '+1 212 555 0101',
    company: 'Holloway Aviation LLC',
    service: 'Ground Handling',
    notes: 'Por favor confirmar disponibilidad de hangar.',
    flights: [
      {
        'PAX': '6',
        'CREW': '2',
        'AIRCRAFT TYPE': 'Gulfstream G650',
        'TAIL NUMBER': 'N123GX',
        'ARRIVAL DATE': '2026-07-15',
        'ARRIVAL TIME': '14:30Z',
        'DEPARTURE DATE': '2026-07-17',
        'DEPARTURE TIME': '09:00Z',
        'AIRPORT': 'MMTO/TLC',
      },
    ],
  });

  sep('CONTACTO — Solo notas, sin vuelos, sin teléfono');
  await post('Solo notas', {
    type: 'contact',
    website: '',
    firstName: 'Petra',
    lastName: 'Vogt',
    email: 'p.vogt@eurobiz.de',
    phone: '',
    company: '',
    service: 'VIP Ground Transportation',
    notes: 'Necesitamos transporte VIP desde MMTO hasta Ciudad de México. Preferiblemente con chofer que hable alemán.',
    flights: [],
  });

  sep('CONTACTO — 2 vuelos, todos los campos');
  await post('Dos vuelos completos', {
    type: 'contact',
    website: '',
    firstName: 'Robert',
    lastName: 'Chen',
    email: 'rchen@pacificjet.com',
    phone: '+1 310 555 0099',
    company: 'Pacific Jet Partners',
    service: 'Ground Handling',
    notes: 'Tour de dos tramos. Coordinación en ambas escalas.',
    flights: [
      {
        'PAX': '4',
        'CREW': '3',
        'AIRCRAFT TYPE': 'Dassault Falcon 8X',
        'TAIL NUMBER': 'N888PJ',
        'ARRIVAL DATE': '2026-09-10',
        'ARRIVAL TIME': '11:00Z',
        'DEPARTURE DATE': '2026-09-11',
        'DEPARTURE TIME': '08:30Z',
        'AIRPORT': 'MMTJ/TIJ',
      },
      {
        'PAX': '4',
        'CREW': '3',
        'AIRCRAFT TYPE': 'Dassault Falcon 8X',
        'TAIL NUMBER': 'N888PJ',
        'ARRIVAL DATE': '2026-09-11',
        'ARRIVAL TIME': '10:00Z',
        'DEPARTURE DATE': '2026-09-12',
        'DEPARTURE TIME': '14:00Z',
        'AIRPORT': 'MMTO/TLC',
      },
    ],
  });

  sep('CONTACTO — 4 vuelos, tiempos en formato libre (sin Z)');
  await post('Cuatro vuelos formato libre', {
    type: 'contact',
    website: '',
    firstName: 'Marco',
    lastName: 'Villanueva',
    email: 'augustotturi99@gmail.com',
    phone: '+52 33 9876 5432',
    company: 'Villanueva Air Group',
    service: 'Ground Handling',
    notes: 'Tour ejecutivo de 4 tramos por México. Necesitamos coordinación completa en cada escala: handling, combustible y transporte VIP.',
    flights: [
      {
        'PAX': '8',
        'CREW': '3',
        'AIRCRAFT TYPE': 'Bombardier Global 6500',
        'TAIL NUMBER': 'XA-VMG',
        'ARRIVAL DATE': '2026-10-05',
        'ARRIVAL TIME': '10:30 AM local',
        'DEPARTURE DATE': '2026-10-05',
        'DEPARTURE TIME': '6:00 PM',
        'AIRPORT': 'MMTO/TLC',
      },
      {
        'PAX': '8',
        'CREW': '3',
        'AIRCRAFT TYPE': 'Bombardier Global 6500',
        'TAIL NUMBER': 'XA-VMG',
        'ARRIVAL DATE': '2026-10-06',
        'ARRIVAL TIME': '09:00',
        'DEPARTURE DATE': '2026-10-07',
        'DEPARTURE TIME': '14:00 hrs',
        'AIRPORT': 'MMUN/CUN',
      },
      {
        'PAX': '8',
        'CREW': '3',
        'AIRCRAFT TYPE': 'Bombardier Global 6500',
        'TAIL NUMBER': 'XA-VMG',
        'ARRIVAL DATE': '2026-10-07',
        'ARRIVAL TIME': '16:30',
        'DEPARTURE DATE': '2026-10-08',
        'DEPARTURE TIME': '11:00 AM',
        'AIRPORT': 'MMGL/GDL',
      },
      {
        'PAX': '8',
        'CREW': '3',
        'AIRCRAFT TYPE': 'Bombardier Global 6500',
        'TAIL NUMBER': 'XA-VMG',
        'ARRIVAL DATE': '2026-10-09',
        'ARRIVAL TIME': '08:45',
        'DEPARTURE DATE': '2026-10-09',
        'DEPARTURE TIME': '7:30 PM local',
        'AIRPORT': 'MMMX/MEX',
      },
    ],
  });

  // ─────────────────────────────────────────────────────────
  // BLOQUE 3 — Email gate (lead capture)
  // ─────────────────────────────────────────────────────────

  sep('EMAIL GATE — Descarga de documento de permiso');
  await post('Gate: lead válido', {
    type: 'gate',
    email: 'augustotturi99@gmail.com',
    fileName: 'FAR Part 91 — Guía de Permisos México.pdf',
  });

  console.log('\n✅  Todas las pruebas terminaron.\n');
  console.log('📬  Revisa augustotturi99@gmail.com — deberían haber llegado:');
  console.log('    • 5 correos de contacto (mínimo, con servicio, 1 vuelo, solo notas, 2 vuelos, 4 vuelos formato libre)');
  console.log('    • 1 correo de email gate (lead de descarga)');
  console.log('    • El bot (honeypot) NO debe haber generado correo\n');
}

run().catch(console.error);
