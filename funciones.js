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
async function guardarConfiguracionPremios(premiosConfig) {
    try {
        const { error } = await supabase
            .from('premios_config')
            .upsert({ 
                id: 1, 
                config: premiosConfig,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error guardando configuración:', error);
        return false;
    }
}

// Resetear puntos de cliente a 0 (FUNCIÓN MANTENIDA PERO NO USADA EN LA INTERFAZ)
async function resetearPuntosCliente(clientId) {
    try {
        console.log('🔄 Reseteando puntos del cliente:', clientId);
        
        const { data, error } = await supabase
            .from('clients')
            .update({ points: 0 })
            .eq('id', clientId)
            .select();

        if (error) throw error;

        return { 
            success: true, 
            message: 'Puntos reseteados a 0 correctamente',
            client: data[0]
        };
    } catch (error) {
        console.error('❌ Error reseteando puntos:', error);
        return { 
            success: false, 
            message: 'Error reseteando puntos: ' + error.message 
        };
    }
}

// =============================================
// NUEVAS FUNCIONES PARA MÉTRICAS Y COBROS
// =============================================

// Registrar cobro de premio (MODIFICADA PARA PUNTOS RESTANTES)
async function registrarCobroPremio(clienteId, clienteNombre, premioId, premioNombre, puntosCanjeados, puntosRestantesCliente) {
    try {
        console.log('💰 Registrando cobro de premio:', {
            clienteId, clienteNombre, premioId, premioNombre, puntosCanjeados, puntosRestantesCliente
        });
        
        const { error } = await supabase
            .from('cobros_premios')
            .insert([
                {
                    cliente_id: clienteId,
                    cliente_nombre: clienteNombre,
                    premio_id: premioId,
                    premio_nombre: premioNombre,
                    puntos_canjeados: puntosCanjeados,
                    puntos_totales_cliente: puntosRestantesCliente, // Ahora representa los puntos RESTANTES después del canje
                    fecha_cobro: new Date().toISOString()
                }
            ]);

        if (error) throw error;

        console.log('✅ Cobro registrado exitosamente');
        return true;
    } catch (error) {
        console.error('❌ Error registrando cobro:', error);
        return false;
    }
}

// Obtener métricas del sistema (FUNCIÓN QUE FALTABA)
async function obtenerMetricas() {
    try {
        console.log('📈 Obteniendo métricas del sistema...');
        
        // Obtener todos los cobros de premios
        const { data: cobrosData, error: cobrosError } = await supabase
            .from('cobros_premios')
            .select('*')
            .order('fecha_cobro', { ascending: false });

        if (cobrosError) throw cobrosError;

        // Obtener estadísticas de clientes
        const { data: clientsData, error: clientsError } = await supabase
            .from('clients')
            .select('id, points');

        if (clientsError) throw clientsError;

        return {
            cobrosPremios: cobrosData || [],
            totalClientes: clientsData?.length || 0,
            totalPremiosCanjeados: cobrosData?.length || 0,
            puntosTotalesSistema: clientsData?.reduce((sum, client) => sum + (client.points || 0), 0) || 0
        };
    } catch (error) {
        console.error('❌ Error obteniendo métricas:', error);
        return {
            cobrosPremios: [],
            totalClientes: 0,
            totalPremiosCanjeados: 0,
            puntosTotalesSistema: 0
        };
    }
}

// Obtener historial de cobros por cliente
async function obtenerHistorialCliente(clienteId) {
    try {
        const { data, error } = await supabase
            .from('cobros_premios')
            .select('*')
            .eq('cliente_id', clienteId)
            .order('fecha_cobro', { ascending: false });

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error('❌ Error obteniendo historial:', error);
        return [];
    }
}

// Obtener estadísticas de premios más canjeados
async function obtenerEstadisticasPremios() {
    try {
        const { data, error } = await supabase
            .from('cobros_premios')
            .select('premio_nombre');

        if (error) throw error;

        // Contar frecuencia de cada premio
        const premiosCount = {};
        data?.forEach(cobro => {
            premiosCount[cobro.premio_nombre] = (premiosCount[cobro.premio_nombre] || 0) + 1;
        });

        return premiosCount;
    } catch (error) {
        console.error('❌ Error obteniendo estadísticas:', error);
        return {};
    }
}

// =============================================
// NUEVAS FUNCIONES PARA EXPORTACIÓN DE DATOS
// =============================================

// Obtener todos los cobros de premios (sin límite)
async function obtenerTodosLosCobros() {
    try {
        console.log('📋 Obteniendo todos los cobros de premios...');
        
        const { data, error } = await supabase
            .from('cobros_premios')
            .select('*')
            .order('fecha_cobro', { ascending: false });

        if (error) throw error;

        console.log(`✅ ${data.length} cobros obtenidos`);
        return data || [];
    } catch (error) {
        console.error('❌ Error obteniendo cobros:', error);
        return [];
    }
}

// Exportar datos a CSV
function exportarACSV(datos, nombreArchivo = 'historial_canjes.csv') {
    if (datos.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Encabezados CSV
    const headers = ['Fecha', 'Cliente', 'Email', 'Premio', 'Puntos Canjeados', 'Puntos Restantes del Cliente'];
    
    // Convertir datos a filas CSV
    const filasCSV = datos.map(cobro => [
        new Date(cobro.fecha_cobro).toLocaleDateString('es-ES'),
        cobro.cliente_nombre,
        obtenerEmailCliente(cobro.cliente_id),
        cobro.premio_nombre,
        cobro.puntos_canjeados.toString(),
        cobro.puntos_totales_cliente.toString()
    ]);

    // Combinar encabezados y filas
    const contenidoCSV = [headers, ...filasCSV]
        .map(fila => fila.map(campo => `"${campo}"`).join(','))
        .join('\n');

    // Crear y descargar archivo
    const blob = new Blob(['\uFEFF' + contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`📥 CSV exportado: ${datos.length} registros`);
}

// Función auxiliar para obtener email del cliente
async function obtenerEmailCliente(clienteId) {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('email')
            .eq('id', clienteId)
            .single();

        if (error || !data) return 'N/A';
        return data.email;
    } catch (error) {
        return 'N/A';
    }
}

// Exportar datos a Excel (usando formato CSV con extensión .xls para simplicidad)
function exportarAExcel(datos, nombreArchivo = 'historial_canjes.xls') {
    if (datos.length === 0) {
        alert('No hay datos para exportar');
        return;
    }

    // Crear contenido HTML para Excel
    let contenidoHTML = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <title>Historial de Canjes - VillaLeon</title>
            <!--[if gte mso 9]>
            <xml>
                <x:ExcelWorkbook>
                    <x:ExcelWorksheets>
                        <x:ExcelWorksheet>
                            <x:Name>Historial Canjes</x:Name>
                            <x:WorksheetOptions>
                                <x:DisplayGridlines/>
                            </x:WorksheetOptions>
                        </x:ExcelWorksheet>
                    </x:ExcelWorksheets>
                </x:ExcelWorkbook>
            </xml>
            <![endif]-->
        </head>
        <body>
            <table border="1">
                <tr style="background-color: #D32F2F; color: white; font-weight: bold;">
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Premio</th>
                    <th>Puntos Canjeados</th>
                    <th>Puntos Restantes del Cliente</th>
                    <th>ID Transacción</th>
                </tr>
    `;

    // Agregar filas de datos
    datos.forEach(cobro => {
        contenidoHTML += `
            <tr>
                <td>${new Date(cobro.fecha_cobro).toLocaleString('es-ES')}</td>
                <td>${cobro.cliente_nombre}</td>
                <td>${cobro.premio_nombre}</td>
                <td>${cobro.puntos_canjeados}</td>
                <td>${cobro.puntos_totales_cliente}</td>
                <td>${cobro.id}</td>
            </tr>
        `;
    });

    contenidoHTML += `
            </table>
        </body>
        </html>
    `;

    // Crear y descargar archivo
    const blob = new Blob(['\uFEFF' + contenidoHTML], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', nombreArchivo);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`📥 Excel exportado: ${datos.length} registros`);
}

// Generar reporte estadístico
async function generarReporteEstadistico() {
    try {
        console.log('📈 Generando reporte estadístico...');
        
        const todosLosCobros = await obtenerTodosLosCobros();
        const todosLosClientes = await getAllClients();
        
        if (todosLosCobros.length === 0) {
            alert('No hay datos suficientes para generar el reporte');
            return;
        }

        // Estadísticas
        const totalCanjes = todosLosCobros.length;
        const totalClientes = todosLosClientes.clients.length;
        const clientesActivos = todosLosClientes.clients.filter(c => c.points > 0).length;
        
        // Premios más populares
        const premiosCount = {};
        todosLosCobros.forEach(cobro => {
            premiosCount[cobro.premio_nombre] = (premiosCount[cobro.premio_nombre] || 0) + 1;
        });
        
        // Canjes por mes
        const canjesPorMes = {};
        todosLosCobros.forEach(cobro => {
            const mes = new Date(cobro.fecha_cobro).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
            canjesPorMes[mes] = (canjesPorMes[mes] || 0) + 1;
        });

        // Crear contenido del reporte
        let contenidoReporte = `REPORTE ESTADÍSTICO - VILLALEON\n`;
        contenidoReporte += `Generado: ${new Date().toLocaleString('es-ES')}\n\n`;
        contenidoReporte += `ESTADÍSTICAS GENERALES:\n`;
        contenidoReporte += `Total de canjes: ${totalCanjes}\n`;
        contenidoReporte += `Total de clientes: ${totalClientes}\n`;
        contenidoReporte += `Clientes activos (con puntos): ${clientesActivos}\n\n`;
        
        contenidoReporte += `PREMIOS MÁS POPULARES:\n`;
        Object.entries(premiosCount)
            .sort((a, b) => b[1] - a[1])
            .forEach(([premio, count], index) => {
                contenidoReporte += `${index + 1}. ${premio}: ${count} canjes\n`;
            });
        
        contenidoReporte += `\nCANJES POR MES:\n`;
        Object.entries(canjesPorMes)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]))
            .forEach(([mes, count]) => {
                contenidoReporte += `${mes}: ${count} canjes\n`;
            });

        // Descargar reporte
        const blob = new Blob(['\uFEFF' + contenidoReporte], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `reporte_estadistico_${new Date().toISOString().split('T')[0]}.txt`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log('✅ Reporte estadístico generado');
        
    } catch (error) {
        console.error('❌ Error generando reporte:', error);
        alert('Error generando reporte: ' + error.message);
    }
}

// =============================================
// FUNCIONES PARA FILTRADO POR FECHA
// =============================================

// Obtener cobros por rango de fechas
async function obtenerCobrosPorFecha(fechaInicio, fechaFin) {
    try {
        console.log('📅 Obteniendo cobros por fecha:', { fechaInicio, fechaFin });
        
        // Ajustar fechas para incluir todo el día
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999); // Hasta el final del día

        const { data, error } = await supabase
            .from('cobros_premios')
            .select('*')
            .gte('fecha_cobro', inicio.toISOString())
            .lte('fecha_cobro', fin.toISOString())
            .order('fecha_cobro', { ascending: false });

        if (error) throw error;

        console.log(`✅ ${data.length} cobros encontrados en el período`);
        return data || [];
    } catch (error) {
        console.error('❌ Error obteniendo cobros por fecha:', error);
        return [];
    }
}

// Obtener cobros del mes actual
async function obtenerCobrosMesActual() {
    const ahora = new Date();
    const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    const ultimoDiaMes = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
    
    return await obtenerCobrosPorFecha(primerDiaMes, ultimoDiaMes);
}

// Obtener cobros de los últimos 30 días
async function obtenerCobrosUltimos30Dias() {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    return await obtenerCobrosPorFecha(hace30Dias, hoy);
}

// Obtener cobros del último trimestre
async function obtenerCobrosUltimoTrimestre() {
    const hoy = new Date();
    const hace3Meses = new Date();
    hace3Meses.setMonth(hoy.getMonth() - 3);
    
    return await obtenerCobrosPorFecha(hace3Meses, hoy);
}

// Formatear fecha para nombres de archivo
function formatearFechaArchivo(fecha) {
    return fecha.toISOString().split('T')[0].replace(/-/g, '');
}
