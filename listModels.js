require("dotenv").config({ path: ".env.local" });

(async () => {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error("GEMINI_API_KEY missing (check .env.local)");
      process.exit(1);
    }

    // node 18+ has global fetch; fallback to node-fetch dynamic import if needed
    const fetchFn = globalThis.fetch || (await import("node-fetch")).default;

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const r = await fetchFn(url);
    const j = await r.json();

    if (!r.ok) {
      console.error("ListModels failed:", r.status, j);
      process.exit(1);
    }

    (j.models || []).forEach(m => {
      console.log(m.name, "->", (m.supportedGenerationMethods || []).join(", ") || "(no methods listed)");
    });
  } catch (err) {
    console.error("Error listing models:", err);
    process.exit(1);
  }
})();
