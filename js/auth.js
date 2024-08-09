import { Persona } from './persona.js';

export class Auth {
    static iniciarSesion(username, password) {
        const user = Persona.iniciarSesion(username, password);
        if (user) {
            localStorage.setItem('session', JSON.stringify(user));
            return user;
        }
        return null;
    }

    static cerrarSesion() {
        localStorage.removeItem('session');
    }

    static obtenerUsuarioActual() {
        return JSON.parse(localStorage.getItem('session'));
    }
}
