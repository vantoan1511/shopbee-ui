import {KeycloakService} from 'keycloak-angular';
import {environment} from '../environments/environment';

export const initializeKeycloak = (keycloak: KeycloakService) => async () =>
    keycloak.init({
        config: {
            url: environment.keycloak.authority,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId,
        },
        loadUserProfileAtStartUp: true,
        initOptions: {
            onLoad: 'login-required',
            // flow: 'standard',
            enableLogging: true,
            checkLoginIframe: true,
            silentCheckSsoRedirectUri:
                `${window.location.origin}/silent-check-sso.html`,
        },
        enableBearerInterceptor: true,
        bearerPrefix: 'Bearer',

    });
