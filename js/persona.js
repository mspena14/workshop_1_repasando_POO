export class Persona {
    constructor(nombre, username, password) {
        this.nombre = nombre;
        this.username = username;
        this.password = password;
        this.role = '';
    }

    static crearUsuario(nombre, username, password, role) {
        if (localStorage.getItem(username)) {
            throw new Error('Usuario ya existe');
        }
        if (role === 'admin') {
            return new Administrador(nombre, username, password);
        } else {
            return new UsuarioRegular(nombre, username, password);
        }
    }

    registrarse() {
        localStorage.setItem(this.username, JSON.stringify(this));
    }

    static iniciarSesion(username, password) {
        const user = JSON.parse(localStorage.getItem(username));
        if (user && user.password === password) {
            return user.role === 'admin' ? new Administrador(user.nombre, user.username, user.password) : new UsuarioRegular(user.nombre, user.username, user.password);
        }
        return null;
    }
}

export class UsuarioRegular extends Persona {
    constructor(nombre, username, password) {
        super(nombre, username, password);
        this.role = 'user';
    }

    crearReserva(reserva) {
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reserva.role = "user"
        reservas.push({ ...reserva, usuario: this.username });
        localStorage.setItem('reservas', JSON.stringify(reservas));
    }
}

export class Administrador extends Persona {
    constructor(nombre, username, password) {
        super(nombre, username, password);
        this.role = 'admin';
    }

    crearReserva(reserva) {
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reserva.role = "admin"
        reservas.push({ ...reserva, usuario: this.username });
        localStorage.setItem('reservas', JSON.stringify(reservas));
    }

    eliminarReserva(id) {
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas = reservas.filter(reserva => reserva.id !== id);
        localStorage.setItem('reservas', JSON.stringify(reservas));
    }

    actualizarReserva(id, nuevaReserva) {
        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
        reservas = reservas.map(reserva => reserva.id === id ? { ...reserva, ...nuevaReserva } : reserva);
        localStorage.setItem('reservas', JSON.stringify(reservas));
    }
}
