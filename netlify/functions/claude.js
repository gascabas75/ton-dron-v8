// netlify/functions/claude.js - Proxy para Claude
export default async (req) => {
  if (req.method!== 'POST') {
    return new Response('Usa POST', { status: 405 });
  }

  const { frameData } = await req.json();

  const prompt = `Sos colorista DJI Air 3S. Frame REAL: R${frameData.r} G${frameData.g} B${frameData.b} Luma ${frameData.luma} Temp ${frameData.temp} Cielo ${frameData.cielo}% Roca ${frameData.roca}% Paisaje serrano. Elegí 2 LUTs de [Dune Gold, Anatolia Stone, Patagonia Cold, Golden Hour 70mm, Arri Alexa LogC, Teal & Orange Cine, Kodak Portra 400, Norr]. Respondé SOLO JSON: {"luts":[{"nombre":"...","confianza":87,"razon":"...","params":{"brightness":1.08,"contrast":1.08,"saturate":1.45,"hueRotate":-12,"sepia":0.25}},{"nombre":"...","confianza":73,"razon":"...","params":{}}]}`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await res.json();
  const text = data.content?.[0]?.text || '{"luts":[]}';

  return new Response(text, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
