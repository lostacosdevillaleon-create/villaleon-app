// Funciones para interactuar con Supabase

// Registrar nuevo cliente
async function registerClient(name, email) {
    try {
        console.log('📝 Intentando registrar cliente:', { name, email });
        
        const { data, error } = await supabase
            .from('clients')
            .insert([
                { 
                    name: name, 
                    email: email, 
                    points: 0,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('❌ Error de Supabase:', error);
            
            if (error.code === '23505') { // Email ya existe
                return { 
                    success: false, 
                    message: 'Este email ya está registrado' 
                };
            }
            
            if (error.code === '42501') { // Error de permisos
                return { 
                    success: false, 
                    message: 'Error de permisos. Contacta al administrador.' 
                };
            }
            
            throw error;
        }

        console.log('✅ Cliente registrado exitosamente:', data[0]);
        return { 
            success: true, 
            message: '¡Registro exitoso! Bienvenido a VillaLeon', 
            client: data[0] 
        };
    } catch (error) {
        console.error('💥 Error crítico registrando cliente:', error);
        return { 
            success: false, 
            message: 'Error en el registro: ' + error.message 
        };
    }
}

// Obtener información del cliente por email
async function getClientByEmail(email) {
    try {
        console.log('🔍 Buscando cliente con email:', email);
        
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // No encontrado
                return { success: false, message: 'Cliente no encontrado' };
            }
            console.error('❌ Error buscando cliente:', error);
            throw error;
        }

        console.log('✅ Cliente encontrado:', data);
        return { 
            success: true, 
            client: data 
        };
    } catch (error) {
        console.error('💥 Error crítico buscando cliente:', error);
        return { 
            success: false, 
            message: 'Error buscando cliente: ' + error.message 
        };
    }
}

// Actualizar puntos del cliente en la base de datos
async function updateClientPointsInDB(clientId, newPoints) {
    try {
        console.log('🔄 Actualizando puntos:', { clientId, newPoints });
        
        const { data, error } = await supabase
            .from('clients')
            .update({ points: newPoints })
            .eq('id', clientId)
            .select();

        if (error) throw error;

        return { 
            success: true, 
            client: data[0] 
        };
    } catch (error) {
        console.error('❌ Error actualizando puntos:', error);
        return { 
            success: false, 
            message: 'Error actualizando puntos: ' + error.message 
        };
    }
}

// Obtener todos los clientes (para admin)
async function getAllClients() {
    try {
        console.log('📊 Obteniendo todos los clientes...');
        
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        console.log('✅ Clientes obtenidos:', data.length);
        return { 
            success: true, 
            clients: data 
        };
    } catch (error) {
        console.error('❌ Error obteniendo clientes:', error);
        return { 
            success: false, 
            message: 'Error cargando clientes: ' + error.message 
        };
    }
}

// Eliminar cliente de la base de datos
async function deleteClientFromDB(clientId) {
    try {
        console.log('🗑️ Eliminando cliente:', clientId);
        
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', clientId);

        if (error) throw error;

        return { 
            success: true, 
            message: 'Cliente eliminado correctamente' 
        };
    } catch (error) {
        console.error('❌ Error eliminando cliente:', error);
        return { 
            success: false, 
            message: 'Error eliminando cliente: ' + error.message 
        };
    }
}

// Cargar configuración de premios
async function cargarConfiguracionPremios() {
    try {
        const { data, error } = await supabase
            .from('premios_config')
            .select('config')
            .single();

        if (!error && data) {
            return data.config;
        } else {
            // Configuración por defecto
            return [
                {
                    id: 1,
                    nombre: "Taco Gratis",
                    icono: "🌮",
                    puntosRequeridos: 50,
                    descripcion: "Canjea un taco de tu elección"
                },
                {
                    id: 2,
                    nombre: "Bebida Gratis", 
                    icono: "🥤",
                    puntosRequeridos: 100,
                    descripcion: "Refresco o agua de sabor"
                },
                {
                    id: 3,
                    nombre: "Comida Completa",
                    icono: "🍽️",
                    puntosRequeridos: 200,
                    descripcion: "Platillo completo + bebida"
                },
                {
                    id: 4,
                    nombre: "Comida para 4",
                    icono: "🏆",
                    puntosRequeridos: 500,
                    descripcion: "Comida completa para 4 personas",
                    premium: true
                }
            ];
        }
    } catch (error) {
        console.error('Error cargando configuración:', error);
        return [];
    }
}

// Guardar configuración de premios