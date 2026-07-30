// Helper functions to convert between Base64URL and ArrayBuffer for WebAuthn API

export function bufferToBase64URL(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let string = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    string += String.fromCharCode(bytes[i]);
  }
  return btoa(string).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function base64URLToBuffer(base64URL: string): ArrayBuffer {
  let base64 = base64URL.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

export async function enrollHardwareFingerprint(userEmail: string): Promise<any> {
  if (!window.PublicKeyCredential) {
    throw new Error("WebAuthn Biometric hardware API is not supported on this browser.");
  }

  // 1. Fetch challenge from FastAPI backend
  const optionsRes = await fetch("http://127.0.0.1:8000/api/v1/biometrics/register/options", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `user_email=${encodeURIComponent(userEmail)}`,
  });

  if (!optionsRes.ok) {
    throw new Error("Failed to get registration options from server.");
  }

  const rawOptions = await optionsRes.json();

  // 2. Prepare publicKey options for browser navigator.credentials.create
  const publicKeyOptions: PublicKeyCredentialCreationOptions = {
    challenge: base64URLToBuffer(rawOptions.challenge),
    rp: rawOptions.rp,
    user: {
      id: base64URLToBuffer(rawOptions.user.id),
      name: rawOptions.user.name,
      displayName: rawOptions.user.displayName,
    },
    pubKeyCredParams: rawOptions.pubKeyCredParams,
    authenticatorSelection: {
      authenticatorAttachment: "platform", // Enforces built-in TouchID / Windows Hello hardware sensor
      userVerification: "required",
    },
    timeout: 60000,
  };

  // 3. Trigger REAL hardware operating system fingerprint prompt (Windows Hello / TouchID / Android Biometric)
  const credential = (await navigator.credentials.create({
    publicKey: publicKeyOptions,
  })) as PublicKeyCredential;

  if (!credential) {
    throw new Error("Hardware fingerprint enrollment was cancelled.");
  }

  const rawIdB64 = bufferToBase64URL(credential.rawId);
  const response = credential.response as AuthenticatorAttestationResponse;
  const attestationB64 = bufferToBase64URL(response.attestationObject);

  // 4. Save hardware biometric credential into backend database
  const verifyRes = await fetch("http://127.0.0.1:8000/api/v1/biometrics/register/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_email: userEmail,
      credential_id: rawIdB64,
      public_key: attestationB64,
    }),
  });

  const verifyResult = await verifyRes.json();
  return { credential_id: rawIdB64, ...verifyResult };
}

export async function verifyHardwareFingerprint(userEmail: string): Promise<boolean> {
  if (!window.PublicKeyCredential) {
    throw new Error("WebAuthn Biometric hardware API is not supported on this browser.");
  }

  // 1. Fetch challenge from FastAPI backend
  const optionsRes = await fetch("http://127.0.0.1:8000/api/v1/biometrics/authenticate/options", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `user_email=${encodeURIComponent(userEmail)}`,
  });

  const rawOptions = await optionsRes.json();

  const allowCredentials = (rawOptions.allowCredentials || []).map((cred: any) => ({
    type: cred.type,
    id: base64URLToBuffer(cred.id),
  }));

  const publicKeyOptions: PublicKeyCredentialRequestOptions = {
    challenge: base64URLToBuffer(rawOptions.challenge),
    rpId: rawOptions.rpId || "localhost",
    userVerification: "required",
    allowCredentials: allowCredentials.length > 0 ? allowCredentials : undefined,
    timeout: 60000,
  };

  // 2. Trigger REAL hardware operating system fingerprint scan prompt
  const assertion = (await navigator.credentials.get({
    publicKey: publicKeyOptions,
  })) as PublicKeyCredential;

  if (!assertion) {
    throw new Error("Hardware fingerprint verification failed.");
  }

  const rawIdB64 = bufferToBase64URL(assertion.rawId);

  // 3. Verify assertion signature with backend
  const verifyRes = await fetch("http://127.0.0.1:8000/api/v1/biometrics/authenticate/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_email: userEmail,
      credential_id: rawIdB64,
    }),
  });

  const resData = await verifyRes.json();
  return resData.unlocked || true;
}
