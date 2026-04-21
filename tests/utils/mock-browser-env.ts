type CookieStore = Map<string, string>;

const cookieStore: CookieStore = new Map();

function parseCookieAssignment(raw: string) {
  const [pair, ...attributes] = raw.split(";").map((part) => part.trim());
  const separator = pair.indexOf("=");
  if (separator < 0) {
    return null;
  }

  const name = pair.slice(0, separator);
  const value = pair.slice(separator + 1);
  const maxAgeAttr = attributes.find((attr) => attr.toLowerCase().startsWith("max-age="));
  const maxAge = maxAgeAttr ? Number(maxAgeAttr.slice("max-age=".length)) : null;

  return { name, value, maxAge };
}

class MockDocument {
  get cookie() {
    return [...cookieStore.entries()]
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  }

  set cookie(raw: string) {
    const parsed = parseCookieAssignment(raw);
    if (!parsed) {
      return;
    }

    if ((parsed.maxAge ?? 1) <= 0 || parsed.value === "") {
      cookieStore.delete(parsed.name);
      return;
    }

    cookieStore.set(parsed.name, parsed.value);
  }
}

function installBrowserGlobals() {
  const globalRecord = globalThis as Record<string, unknown>;

  if (!("Document" in globalRecord)) {
    globalRecord.Document = MockDocument;
  }

  if (!("document" in globalRecord) || !(globalRecord.document instanceof MockDocument)) {
    globalRecord.document = new MockDocument();
  }

  if (!("window" in globalRecord)) {
    globalRecord.window = globalThis;
  }

  if (!("location" in globalRecord)) {
    globalRecord.location = { protocol: "http:" };
  }
}

export function setupMockBrowserEnv() {
  installBrowserGlobals();
  cookieStore.clear();
}
