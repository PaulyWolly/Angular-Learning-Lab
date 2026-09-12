/** Demo JWT only — unsigned, not a secret, never send this to a real API as auth. */
const DEMO_HEADER = { alg: 'HS256', typ: 'JWT' };
const DEMO_PAYLOAD = {
  sub: 'lab-user-1',
  name: 'Ada Lovelace',
  role: 'demo',
  iat: 1710000000,
};

function toBase64Url(value: object): string {
  return btoa(JSON.stringify(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64Url(part: string): unknown {
  const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4)) % 4);
  return JSON.parse(atob(padded));
}

/** `header.payload.signature` — signature is an obvious placeholder. */
export const DEMO_JWT = `${toBase64Url(DEMO_HEADER)}.${toBase64Url(DEMO_PAYLOAD)}.not-a-real-signature`;

export const DEMO_AUTH_HEADER = `Bearer ${DEMO_JWT}`;

export interface DemoJwtParts {
  header: string;
  payload: string;
  signature: string;
  headerJson: string;
  payloadJson: string;
}

export function splitDemoJwt(token: string): DemoJwtParts | null {
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) {
    return null;
  }
  return {
    header,
    payload,
    signature,
    headerJson: JSON.stringify(fromBase64Url(header), null, 2),
    payloadJson: JSON.stringify(fromBase64Url(payload), null, 2),
  };
}

export function jwtFromAuthorization(authorization: string | null): DemoJwtParts | null {
  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }
  return splitDemoJwt(authorization.slice('Bearer '.length));
}
