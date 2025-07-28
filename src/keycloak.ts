import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "rejoyn-eu",
  clientId: "public-client",
});


export default keycloak;
