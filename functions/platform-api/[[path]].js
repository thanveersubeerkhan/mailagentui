export async function onRequest(context) {
  const { request } = context;

  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-internal-service-key, accept-language",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const url = new URL(request.url);
  
  // Forward the request to the real backend
  const targetUrl = new URL(url.pathname + url.search, 'https://portaldev.mawarid.com.sa:6080');
  
  const proxyRequest = new Request(targetUrl, request);
  
  try {
    let response = await fetch(proxyRequest);
    let newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    return newResponse;
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
