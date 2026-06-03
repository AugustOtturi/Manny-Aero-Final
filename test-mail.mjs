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
  console.log(`\n${'─'.repeat(55)}`);
  console.log(`  ${title}`);
  console.log('─'.repeat(55));
}

// ── Test cases ───────────────────────────────────────────────

async function run() {
  console.log(`\n🛫  Manny Aero Mail Tests → ${ENDPOINT}\n`);

  // ── CONTACT FORM ─────────────────────────────────────────

  sep('CONTACT — Full submission (all fields + 2 flights)');
  await post('Full form', {
    type: 'contact',
    firstName: 'James',
    lastName: 'Holloway',
    email: 'james.holloway@testoperator.com',
    phone: '+1 212 555 0101',
    company: 'Holloway Aviation LLC',
    service: 'Ground Handling',
    aircraft: 'Gulfstream G650',
    notes: 'Please ensure fuel uplift is ready on arrival. Crew of 3, 6 passengers.\nVIP handling required.',
    flights: [
      {
        'Origin': 'KTEB — Teterboro',
        'Destination': 'MMTO — Toluca',
        'Date': '2026-07-15',
        'ETA': '14:30 local',
        'Registration': 'N123GX',
      },
      {
        'Origin': 'MMTO — Toluca',
        'Destination': 'MMUN — Cancún',
        'Date': '2026-07-17',
        'ETD': '09:00 local',
        'Registration': 'N123GX',
      },
    ],
    website: '', // honeypot — empty = human
  });

  sep('CONTACT — Minimal (name + email only, no optional fields)');
  await post('Minimal form', {
    type: 'contact',
    firstName: 'Sofia',
    lastName: 'Reyes',
    email: 'sofia.reyes@minimalist.io',
    phone: '',
    company: '',
    service: '',
    aircraft: '',
    notes: '',
    flights: [],
    website: '',
  });

  sep('CONTACT — One flight, no notes, no aircraft');
  await post('One flight / no notes', {
    type: 'contact',
    firstName: 'Carlos',
    lastName: 'Mendez',
    email: 'cmendez@charter.mx',
    phone: '+52 55 1234 5678',
    company: 'AeroCharter MX',
    service: 'Landing / Overflight Permit',
    aircraft: '',
    notes: '',
    flights: [
      {
        'Origin': 'KLAX — Los Angeles',
        'Destination': 'MMMX — Mexico City',
        'Date': '2026-08-01',
        'ETA': '18:00 local',
      },
    ],
    website: '',
  });

  sep('CONTACT — Only notes, no flights, no phone/company');
  await post('Notes only, no flights', {
    type: 'contact',
    firstName: 'Petra',
    lastName: 'Vogt',
    email: 'p.vogt@eurobiz.de',
    phone: '',
    company: '',
    service: 'VIP Ground Transportation',
    aircraft: 'Bombardier Global 7500',
    notes: 'We need a fully equipped VIP van and driver from MMTO to Mexico City. German-speaking preferred.',
    flights: [],
    website: '',
  });

  sep('CONTACT — 3 flights, all fields populated');
  await post('3 flights full', {
    type: 'contact',
    firstName: 'Robert',
    lastName: 'Chen',
    email: 'rchen@pacificjet.com',
    phone: '+1 310 555 0099',
    company: 'Pacific Jet Partners',
    service: 'Ground Handling',
    aircraft: 'Dassault Falcon 8X',
    notes: 'Multi-leg tour. Need ground coordination at all three stops.',
    flights: [
      { 'Leg': '1', 'Origin': 'KSFO', 'Destination': 'MMTJ — Tijuana', 'Date': '2026-09-10', 'ETA': '11:00' },
      { 'Leg': '2', 'Origin': 'MMTJ', 'Destination': 'MMGL — Guadalajara', 'Date': '2026-09-11', 'ETD': '08:30' },
      { 'Leg': '3', 'Origin': 'MMGL', 'Destination': 'MMTO — Toluca', 'Date': '2026-09-12', 'ETD': '14:00' },
    ],
    website: '',
  });

  // ── VALIDATION ERRORS ─────────────────────────────────────

  sep('VALIDATION — Missing first name (expect 400 error)');
  await post('No first name', {
    type: 'contact',
    firstName: '',
    lastName: 'Smith',
    email: 'test@test.com',
    website: '',
  });

  sep('VALIDATION — Invalid email (expect 400 error)');
  await post('Bad email', {
    type: 'contact',
    firstName: 'John',
    lastName: 'Doe',
    email: 'not-an-email',
    website: '',
  });

  sep('VALIDATION — Honeypot triggered (expect silent ok, no email sent)');
  await post('Bot submission', {
    type: 'contact',
    firstName: 'Bot',
    lastName: 'Spammer',
    email: 'spam@spam.com',
    website: 'http://spam.com', // honeypot filled → should be silently discarded
  });

  // ── EMAIL GATE ────────────────────────────────────────────

  sep('EMAIL GATE — Permit download lead capture');
  await post('Gate: valid email', {
    type: 'gate',
    email: 'augustotturi99@gmail.com',
    fileName: 'FAR Part 91 — Mexico Permit Guide.pdf',
  });

  sep('EMAIL GATE — Invalid email (expect 400 error)');
  await post('Gate: bad email', {
    type: 'gate',
    email: 'nope',
    fileName: 'Some document',
  });

  sep('UNKNOWN TYPE — expect 400 error');
  await post('Unknown type', {
    type: 'newsletter',
    email: 'test@test.com',
  });

  console.log('\n✅  All tests finished.\n');
}

run().catch(console.error);
