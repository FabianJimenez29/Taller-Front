// Función fetchCita correcta que resuelve el problema de mapeo de servicios
export const fetchCitaFixed = async (id: string, setCita: any, setNombreTecnico: any, 
  setProblemasAdicionales: any, setObservaciones: any, setPasosProceso: any, 
  setCompletedSteps: any, setLoading: any, router: any, BACKEND_URL: string | undefined,
  serviciosProcesos: any[], AsyncStorage: any) => {
  try {
    setLoading(true);
    
    // Cargar datos del usuario (posiblemente el técnico)
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setNombreTecnico(user.fullName || user.full_name || '');
      }
    } catch (error) {
      console.error('Error al cargar datos de usuario:', error);
    }
    
    // Cargar información de la cita
    const response = await fetch(`${BACKEND_URL}/quotes/${id}`);
    
    if (!response.ok) {
      throw new Error('No se pudo cargar la información de la cita');
    }
    
    const data = await response.json();
    const citaData = data.quote || data; // Adaptar según la respuesta del API
    console.log("Datos de la cita recibidos:", JSON.stringify(citaData, null, 2));
    setCita(citaData);
    
    // Si ya tiene técnico asignado, mostrarlo
    if (citaData.tecnico) {
      setNombreTecnico(citaData.tecnico);
    }

    // Si hay problemas adicionales, cargarlos
    if (citaData.problemas_adicionales) {
      setProblemasAdicionales(citaData.problemas_adicionales);
    }
    
    // Si hay observaciones, cargarlas
    if (citaData.observaciones) {
      setObservaciones(citaData.observaciones);
    }
    
    // Cargar pasos del servicio
    if (citaData.servicio) {
      console.log("Buscando servicio:", citaData.servicio);
      
      // Normalizar el nombre del servicio
      let servicioNombre = citaData.servicio.toLowerCase().replace(/[()]/g, '').trim();
      let servicioIdMapped = '';
      
      // Mapeo manual de nombres de servicio a IDs (mismo que en mapearServicioAId)
      const mapaServicios: {[key: string]: string} = {
        'alineado': 'alineado',
        'alineacion': 'alineado',
        'alineación': 'alineado',
        'balanceo': 'balanceo',
        'rotacion': 'balanceo',
        'rotación': 'balanceo',
        'rtv': 'revision_rtv',
        'pre-rtv': 'revision_rtv',
        'pre rtv': 'revision_rtv',
        'suspensión': 'suspension',
        'suspension': 'suspension',
        'dirección': 'direccion',
        'direccion': 'direccion',
        'mantenimiento': 'mantenimiento',
        'llantas': 'llantas',
        'neumaticos': 'llantas',
        'neumáticos': 'llantas',
        'reparacion': 'reparaciones_mayores',
        'reparación': 'reparaciones_mayores',
        'aceite motor': 'aceite_motor',
        'aceite': 'aceite_motor',
        'transmision': 'aceite_transmision',
        'transmisión': 'aceite_transmision',
        'hidraulico': 'direccion_hidraulica',
        'hidráulico': 'direccion_hidraulica',
        'inyeccion': 'inyectores',
        'inyección': 'inyectores',
        'refrigerante': 'coolant',
        'coolant': 'coolant',
        'frenos': 'frenos_revision',
        'bateria': 'bateria',
        'batería': 'bateria',
        'scanner': 'scanner',
        'diagnostico': 'scanner',
        'diagnóstico': 'scanner',
        'evaluacion': 'super_evaluacion',
        'evaluación': 'super_evaluacion',
        'super': 'super_evaluacion',
        'super evaluación': 'super_evaluacion',
        'super evaluacion': 'super_evaluacion'
      };
      
      // Buscar coincidencias parciales en el mapa de servicios
      for (const [clave, valor] of Object.entries(mapaServicios)) {
        if (servicioNombre.includes(clave)) {
          servicioIdMapped = valor;
          break;
        }
      }
      
      console.log("ID mapeado del servicio:", servicioIdMapped);
      
      let servicio = null;
      
      // Primero intentamos con el ID mapeado
      if (servicioIdMapped) {
        servicio = serviciosProcesos.find(s => s.id === servicioIdMapped);
      }
      
      // Si no lo encontramos, intentamos por método anterior
      if (!servicio) {
        servicio = serviciosProcesos.find(s => 
          s.id === servicioNombre ||
          s.id === citaData.servicio || 
          s.nombre.toLowerCase().replace(/\s+/g, ' ').includes(servicioNombre)
        );
      }
      
      if (servicio) {
        console.log("Servicio encontrado:", servicio.nombre);
        setPasosProceso(servicio.pasos);
        
        // Cargar pasos completados si existen
        if (citaData.checklist_data && citaData.checklist_data.pasos) {
          // Extraer los IDs de los pasos completados
          const pasosCompletados = citaData.checklist_data.pasos
            .filter((paso: any) => paso.completado)
            .map((paso: any) => paso.id);
          
          setCompletedSteps(pasosCompletados);
        }
      } else {
        console.log("No se encontró el servicio en serviciosProcesos");
      }
    }
  } catch (error) {
    console.error('Error al cargar la cita:', error);
    // Usamos error genérico sin Alert porque Alert requiere import de react-native
    console.error('Error: No se pudo cargar la información de la cita');
    router.back();
  } finally {
    setLoading(false);
  }
};
