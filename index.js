const axios = require("axios");
const { getInputsObject } = require("./src/utils");

const getClientSecret = async (inputObject) => {
  const { keycloakUrl, realm, clientId, username, password } = inputObject;

  // Get access token
  const tokenResponse = await axios.post(
    `${keycloakUrl}/realms/${realm}/protocol/openid-connect/token`,
    {
      grant_type: "password",
      client_id: clientId,
      username: username,
      password: password,
    }
  );

  const accessToken = tokenResponse.data.access_token;

  // Get client secret
  const clientResponse = await axios.get(
    `${keycloakUrl}/admin/realms/${realm}/clients/${clientId}/client-secret`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return clientResponse.data.value;
};

(async () => {
  const clientSecret = await getClientSecret(getInputsObject);
  console.log(clientSecret);
})();
