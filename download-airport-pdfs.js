/**
 * download-airport-pdfs.js
 * Descarga los 72 PDFs de aeropuertos desde el WordPress viejo (manny.aero)
 * y los guarda en public/files/airports/.
 *
 * Uso: node download-airport-pdfs.js
 * Requiere Node 18+ (built-in https, fs — sin dependencias externas).
 */

const https = require("https");
const http  = require("http");
const fs    = require("fs");
const path  = require("path");

const OUT_DIR = path.join(__dirname, "public", "files", "airports");

// 72 URLs únicas — todas las que referencia airports.ts.
// Para filenames repetidos entre 2025/06 y 2024/02 usamos la versión más nueva.
const URLS = [
  "https://manny.aero/wp-content/uploads/2025/06/MMAA-ACA.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMAS-AGS.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCP-CPE.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMTG-TGZ.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMBT-HUX.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMMX-MEX.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMSL-CSL.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMUN-CUN.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMVA-VSA.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCY-CYW10.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCM-CTM.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCT-CZA.pdf",
  "https://manny.aero/wp-content/uploads/2025/10/CHIHUAHUA-MMCU-CUU2025.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCE-CME.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCS-CJS.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMIA-CLQ.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCZ-CZM.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCB-CVJ.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCL-CUL.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMDO-DGO.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMJA-JAL.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMSM-NLU.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMTL-TQO.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMTM-TAM.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMTC-TRC.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMVR-VER.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMMZ-MZT.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMMA-MAM.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMLP-LAP.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMTJ-TIJ.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMMM-MLM.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMZC-ZCL.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMPN-UPN.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMRX-REX.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMML-MXL.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMGM-GYM.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCV-CVM10.pdf",
  "https://manny.aero/wp-content/uploads/2024/02/MMCV-CVM.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMIO-SLW.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMLO-BJX10.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMLO-BJX.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMGR-GUB.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMHO-HMO.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMZH-ZIH.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMHC-TCN.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMLC-LZC.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMTO-TLC-GENERAL-AV.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMLT-LTO.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMPE-PPE.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMMD-MID.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMMT-MTTT.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMAN-NTR.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMNG-NOG.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMCN-CEN.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMPQ-PQM.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMPG-PDS.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMZO-ZLO.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMSP-SLP.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMPB-PBC.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMPS-PXM.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMQT-QRO.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMNL-NLD.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMSD-SJD-3.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMPA-PAZ.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMTP-TAP.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMEP-TPQ.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMLM-LMM.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMMV-LOV.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMES-ESE.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMOX-OAX.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMPR-PVR.pdf",
  "https://manny.aero/wp-content/uploads/2025/06/MMGL-GDL.pdf",
];

// ─── helpers ────────────────────────────────────────────────────────────────

function filename(url) {
  return url.split("/").pop();
}

/** GET con soporte para hasta 5 redirects. Devuelve la response final. */
function get(url, redirectsLeft = 5) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; Manny-PDF-Downloader/1.0)" } }, (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          if (redirectsLeft === 0) return reject(new Error("Too many redirects: " + url));
          res.resume(); // consume para liberar memoria
          resolve(get(res.headers.location, redirectsLeft - 1));
        } else {
          resolve(res);
        }
      })
      .on("error", reject);
  });
}

/** Descarga url → destPath. Resuelve {ok, skipped, error}. */
async function download(url, destPath) {
  if (fs.existsSync(destPath)) {
    return { ok: false, skipped: true };
  }

  const res = await get(url);

  if (res.statusCode !== 200) {
    return { ok: false, skipped: false, error: `HTTP ${res.statusCode}` };
  }

  return new Promise((resolve) => {
    const tmp = destPath + ".tmp";
    const file = fs.createWriteStream(tmp);
    res.pipe(file);
    file.on("finish", () => {
      file.close(() => {
        fs.renameSync(tmp, destPath);
        resolve({ ok: true, skipped: false });
      });
    });
    file.on("error", (err) => {
      fs.unlink(tmp, () => {});
      resolve({ ok: false, skipped: false, error: err.message });
    });
  });
}

// ─── main ───────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const total   = URLS.length;
  let ok        = 0;
  let skipped   = 0;
  const failed  = [];

  console.log(`\nDescargando ${total} PDFs → ${OUT_DIR}\n`);

  for (let i = 0; i < URLS.length; i++) {
    const url  = URLS[i];
    const name = filename(url);
    const dest = path.join(OUT_DIR, name);
    const tag  = `[${String(i + 1).padStart(2, "0")}/${total}]`;

    process.stdout.write(`${tag} ${name} … `);

    try {
      const result = await download(url, dest);
      if (result.skipped) {
        console.log("ya existe, omitido");
        skipped++;
      } else if (result.ok) {
        const kb = Math.round(fs.statSync(dest).size / 1024);
        console.log(`OK (${kb} KB)`);
        ok++;
      } else {
        console.log(`ERROR: ${result.error}`);
        failed.push({ name, url, error: result.error });
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      failed.push({ name, url, error: err.message });
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`Descargados:  ${ok}`);
  console.log(`Ya existían:  ${skipped}`);
  console.log(`Fallidos:     ${failed.length}`);

  if (failed.length > 0) {
    console.log("\nArchivos con error:");
    failed.forEach(({ name, url, error }) => {
      console.log(`  • ${name}\n    ${url}\n    → ${error}`);
    });
    console.log(
      "\nReintentar manualmente los fallidos o descargarlos desde el WordPress viejo."
    );
  } else {
    console.log("\nTodo OK — airports.ts ya apunta a /files/airports/ en el repo.");
  }
}

main().catch((err) => {
  console.error("Error fatal:", err);
  process.exit(1);
});
