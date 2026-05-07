/* CONTRACT: Delt Storyblok Management API-klient (fetch, rate limit, skriveforsinkelse) for Node-scripts. */

const WRITE_DELAY_MS = 300;
const MAX_429_RETRIES = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryDelayMsFromAttempt(attempt) {
  return 1000 * Math.pow(2, attempt - 1);
}

function retryAfterToMs(value) {
  if (!value) return null;
  const asNumber = Number(value);
  if (Number.isFinite(asNumber) && asNumber > 0) return Math.ceil(asNumber * 1000);
  const parsedDate = Date.parse(value);
  if (Number.isFinite(parsedDate)) {
    const delta = parsedDate - Date.now();
    return delta > 0 ? delta : null;
  }
  return null;
}

/**
 * @param {{ spaceId: string; token: string; baseUrl?: string }} opts
 */
export function createStoryblokManagementClient(opts) {
  const { spaceId, token, baseUrl = "https://mapi.storyblok.com/v1" } = opts;
  const apiBase = `${baseUrl}/spaces/${spaceId}`;

  /**
   * @param {string} path
   * @param {{ method?: string; body?: unknown }} [options]
   */
  async function sb(path, options = {}) {
    const { method = "GET", body } = options;
    const isWrite = method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
    let attempt = 0;

    while (true) {
      const res = await fetch(`${apiBase}${path}`, {
        method,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.status === 429 && attempt < MAX_429_RETRIES) {
        attempt += 1;
        const retryAfterHeader = res.headers.get("retry-after");
        const retryAfterMs = retryAfterToMs(retryAfterHeader);
        const waitMs = retryAfterMs ?? retryDelayMsFromAttempt(attempt);
        await sleep(waitMs);
        continue;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${method} ${path} failed (${res.status}): ${text}`);
      }

      if (isWrite) {
        await sleep(WRITE_DELAY_MS);
      }

      if (res.status === 204) return null;
      return await res.json();
    }
  }

  return { sb, apiBase };
}
