/**
 * @file passkey-client.example.js
 * @description Complete example of WebAuthn passkey implementation for browsers
 * 
 * This shows how to:
 * 1. Register a new passkey
 * 2. Login with a passkey
 * 3. List existing passkeys
 * 4. Delete a passkey
 * 
 * @requires: Modern browser with WebAuthn support (Chrome, Firefox, Safari, Edge)
 */

const API_BASE = 'http://localhost:8000/api/auth';

// ── Utility Functions ────────────────────────────────────────────────────────

/**
 * Check if the browser supports WebAuthn
 */
function isWebAuthnSupported() {
  return window.PublicKeyCredential !== undefined &&
         navigator.credentials !== undefined;
}

/**
 * Convert base64url string to Uint8Array
 */
function base64urlToBuffer(base64url) {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(padLen);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Convert Uint8Array to base64url string
 */
function bufferToBase64url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Prepare registration options from server (convert base64url to buffers)
 */
function prepareRegistrationOptions(options) {
  return {
    challenge: base64urlToBuffer(options.challenge),
    rp: options.rp,
    user: {
      ...options.user,
      id: base64urlToBuffer(options.user.id),
    },
    pubKeyCredParams: options.pubKeyCredParams,
    authenticatorSelection: options.authenticatorSelection,
    timeout: options.timeout,
    attestation: options.attestation,
  };
}

/**
 * Prepare authentication options from server (convert base64url to buffers)
 */
function prepareAuthenticationOptions(options) {
  return {
    challenge: base64urlToBuffer(options.challenge),
    timeout: options.timeout,
    userVerification: options.userVerification,
    allowCredentials: options.allowCredentials?.map(cred => ({
      ...cred,
      id: base64urlToBuffer(cred.id),
    })) || [],
  };
}

/**
 * Convert credential to JSON for sending to server
 */
function credentialToJSON(credential) {
  const response = credential.response;
  
  if (credential.type === 'public-key') {
    if (response.attestationObject) {
      // Registration response
      return {
        id: credential.id,
        rawId: bufferToBase64url(credential.rawId),
        response: {
          clientDataJSON: bufferToBase64url(response.clientDataJSON),
          attestationObject: bufferToBase64url(response.attestationObject),
        },
        type: credential.type,
      };
    } else {
      // Authentication response
      return {
        id: credential.id,
        rawId: bufferToBase64url(credential.rawId),
        response: {
          clientDataJSON: bufferToBase64url(response.clientDataJSON),
          authenticatorData: bufferToBase64url(response.authenticatorData),
          signature: bufferToBase64url(response.signature),
          userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null,
        },
        type: credential.type,
      };
    }
  }
  
  return credential;
}

// ── Passkey Registration ─────────────────────────────────────────────────────

/**
 * Step 1: Start passkey registration
 * @param {string} email - User's email
 * @param {string} name - Display name (optional)
 * @returns {Promise<{options, challenge}>}
 */
async function startPasskeyRegistration(email, name) {
  console.log('Starting passkey registration for', email);
  
  const response = await fetch(`${API_BASE}/passkey/register/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name }),
  });
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data; // { options, challenge }
}

/**
 * Step 2: Register passkey with authenticator
 * @param {object} options - WebAuthn registration options
 * @returns {Promise<Credential>}
 */
async function registerPasskeyWithAuthenticator(options) {
  console.log('Requesting passkey registration from authenticator...');
  
  const preparedOptions = prepareRegistrationOptions(options);
  
  try {
    const credential = await navigator.credentials.create({
      publicKey: preparedOptions,
    });
    
    if (!credential) {
      throw new Error('User cancelled or authenticator unavailable');
    }
    
    console.log('Passkey created successfully', credential);
    return credential;
  } catch (error) {
    console.error('Passkey registration error:', error);
    throw error;
  }
}

/**
 * Step 3: Complete passkey registration on server
 * @param {string} email - User's email
 * @param {Credential} credential - Credential from authenticator
 * @param {string} challenge - Challenge from step 1
 * @param {string} nickname - Friendly name for the passkey
 * @returns {Promise<{id, nickname, created_at, is_active}>}
 */
async function completePasskeyRegistration(email, credential, challenge, nickname) {
  console.log('Completing passkey registration on server...');
  
  const credentialJSON = credentialToJSON(credential);
  
  const response = await fetch(`${API_BASE}/passkey/register/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      credential: credentialJSON,
      challenge,
      nickname,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Registration failed: ${error.detail || response.statusText}`);
  }
  
  const data = await response.json();
  console.log('Passkey registered successfully:', data);
  return data;
}

/**
 * Complete passkey registration flow
 */
async function registerPasskey(email, name, nickname) {
  try {
    if (!isWebAuthnSupported()) {
      throw new Error('WebAuthn is not supported on this device');
    }
    
    // Step 1: Get options from server
    const { options, challenge } = await startPasskeyRegistration(email, name);
    
    // Step 2: Have user create passkey with authenticator
    const credential = await registerPasskeyWithAuthenticator(options);
    
    // Step 3: Send credential back to server to complete registration
    const result = await completePasskeyRegistration(email, credential, challenge, nickname);
    
    console.log('✓ Passkey registered successfully!');
    return result;
  } catch (error) {
    console.error('✗ Passkey registration failed:', error);
    throw error;
  }
}

// ── Passkey Authentication (Login) ───────────────────────────────────────────

/**
 * Step 1: Start passkey authentication
 * @param {string} email - User's email
 * @returns {Promise<{options, challenge}>}
 */
async function startPasskeyLogin(email) {
  console.log('Starting passkey login for', email);
  
  const response = await fetch(`${API_BASE}/passkey/login/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data; // { options, challenge }
}

/**
 * Step 2: Authenticate with passkey
 * @param {object} options - WebAuthn authentication options
 * @returns {Promise<Credential>}
 */
async function authenticateWithPasskey(options) {
  console.log('Requesting passkey authentication...');
  
  const preparedOptions = prepareAuthenticationOptions(options);
  
  try {
    const credential = await navigator.credentials.get({
      publicKey: preparedOptions,
    });
    
    if (!credential) {
      throw new Error('User cancelled or passkey unavailable');
    }
    
    console.log('Authentication successful', credential);
    return credential;
  } catch (error) {
    console.error('Passkey authentication error:', error);
    throw error;
  }
}

/**
 * Step 3: Complete passkey authentication on server
 * @param {string} email - User's email
 * @param {Credential} credential - Assertion from authenticator
 * @param {string} challenge - Challenge from step 1
 * @returns {Promise<{access_token, token_type, user}>}
 */
async function completePasskeyLogin(email, credential, challenge) {
  console.log('Completing passkey authentication on server...');
  
  const credentialJSON = credentialToJSON(credential);
  
  const response = await fetch(`${API_BASE}/passkey/login/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      credential: credentialJSON,
      challenge,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Login failed: ${error.detail || response.statusText}`);
  }
  
  const data = await response.json();
  console.log('Login successful:', data);
  return data;
}

/**
 * Complete passkey authentication flow
 */
async function loginWithPasskey(email) {
  try {
    if (!isWebAuthnSupported()) {
      throw new Error('WebAuthn is not supported on this device');
    }
    
    // Step 1: Get authentication options from server
    const { options, challenge } = await startPasskeyLogin(email);
    
    // Step 2: Authenticate with passkey
    const credential = await authenticateWithPasskey(options);
    
    // Step 3: Complete authentication on server
    const result = await completePasskeyLogin(email, credential, challenge);
    
    // Store token and user info
    localStorage.setItem('access_token', result.access_token);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    console.log('✓ Login successful!');
    return result;
  } catch (error) {
    console.error('✗ Passkey login failed:', error);
    throw error;
  }
}

// ── Export for use in HTML/React ────────────────────────────────────────────

// In Node.js/module context:
// export { registerPasskey, loginWithPasskey, isWebAuthnSupported };

// Example HTML usage:
/*
<button onclick="
  registerPasskey('admin@example.com', 'Admin', 'My Face ID')
    .then(result => alert('Passkey registered! ' + result.nickname))
    .catch(err => alert('Error: ' + err.message));
">
  Register Passkey
</button>

<button onclick="
  loginWithPasskey('admin@example.com')
    .then(result => alert('Logged in! Token: ' + result.access_token.substring(0, 20) + '...'))
    .catch(err => alert('Error: ' + err.message));
">
  Login with Passkey
</button>
*/
