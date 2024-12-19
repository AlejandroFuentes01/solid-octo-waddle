export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-6">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h3 className="text-lg font-bold">Asistencia Tickets</h3>
                    <p className="text-sm opacity-75">Sistema de Gestión de Telemática</p>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-sm">
                        © {new Date().getFullYear()} H. Ayuntamiento de Comala.
                        <span className="hidden md:inline"> Todos los derechos reservados.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}