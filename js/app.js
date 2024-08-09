import { Persona, UsuarioRegular, Administrador } from './persona.js';
import { Auth } from './auth.js';

function initAuth() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const nombre = document.getElementById('name').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            try {
                const usuario = Persona.crearUsuario(nombre, username, password, role);
                usuario.registrarse();
                alert('Usuario registrado exitosamente');
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            const usuario = Auth.iniciarSesion(username, password);
            if (usuario) {
                window.location.href = './pages/reservations.html'; // Navegar a la página de reservas
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }
}

function initReservations() {
    const createReservationBtn = document.getElementById('createReservation');
    const logoutBtn = document.getElementById('logout');
    const reservationList = document.getElementById('reservationList');

    if (createReservationBtn) {
        createReservationBtn.addEventListener('click', function() {
            const usuario = Auth.obtenerUsuarioActual();
            if (usuario) {
                const reserva = {
                    id: Date.now(),
                    descripcion: prompt('Ingrese la descripción de la reserva:')
                };

                try {
                    if (usuario.role === 'admin') {
                        new Administrador(usuario.nombre, usuario.username, usuario.password).crearReserva(reserva);
                    } else {
                        new UsuarioRegular(usuario.nombre, usuario.username, usuario.password).crearReserva(reserva);
                    }
                    mostrarReservas();
                } catch (error) {
                    document.getElementById('message').textContent = error.message;
                }
            } else {
                document.getElementById('message').textContent = 'Debe iniciar sesión para crear una reserva';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            Auth.cerrarSesion();
            window.location.href = '/'; 
        });
    }

    mostrarReservas();
}

// Muestra las reservas en la página
function mostrarReservas() {
    const usuario = Auth.obtenerUsuarioActual();
    const reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    const listaReservas = document.getElementById('reservationList');
    listaReservas.innerHTML = '';

    reservas.forEach(reserva => {
        const li = document.createElement('li');
        li.textContent = `Reserva: ${reserva.descripcion} - Usuario: ${reserva.usuario}`;

        if (usuario && usuario.role === 'admin') {
            li.textContent = ""
            li.textContent = `Reserva: ${reserva.descripcion} - Usuario: ${reserva.usuario} - Role: ${reserva.role}`;
            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.addEventListener('click', function() {
                new Administrador(usuario.nombre, usuario.username, usuario.password).eliminarReserva(reserva.id);
                mostrarReservas();
            });

            const editarBtn = document.createElement('button');
            editarBtn.textContent = 'Editar';
            editarBtn.addEventListener('click', function() {
                const nuevaDescripcion = prompt('Ingrese la nueva descripción de la reserva:', reserva.descripcion);
                new Administrador(usuario.nombre, usuario.username, usuario.password).actualizarReserva(reserva.id, { descripcion: nuevaDescripcion });
                mostrarReservas();
            });

            li.appendChild(editarBtn);
            li.appendChild(eliminarBtn);
        }

        listaReservas.appendChild(li);
    });
}

window.onload = function() {
    if (document.getElementById('registerForm') || document.getElementById('loginForm')) {
        initAuth();
    }
    if (document.getElementById('createReservation')) {
        initReservations();
    }
};
