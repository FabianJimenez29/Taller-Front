
export const fetchCitaFixed = async (id: string, setCita: any, setNombreTecnico: any, 
  setProblemasAdicionales: any, setObservaciones: any, setPasosProceso: any, 
  setCompletedSteps: any, setLoading: any, router: any, BACKEND_URL: string | undefined,
  serviciosProcesos: any[], AsyncStorage: any) => {
  try {
    setLoading(true);
    

    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setNombreTecnico(user.fullName || user.full_name || '');
      }
    } catch (error) {
      console.error('Error al cargar datos de usuario:', error);
    }
    

    const response = await fetch(`${BACKEND_URL}/quotes/${id}`);
    
    if (!response.ok) {
      throw new Error('No se pudo cargar la información de la cita');
    }
    
    const data = await response.json();
    const citaData = data.quote || data; 
    console.log("Datos de la cita recibidos:", JSON.stringify(citaData, null, 2));
    setCita(citaData);
    

    if (citaData.tecnico) {
      setNombreTecnico(citaData.tecnico);
    }


    if (citaData.problemas_adicionales) {
      setProblemasAdicionales(citaData.problemas_adicionales);
    }
    

    if (citaData.observaciones) {
      setObservaciones(citaData.observaciones);
    }
    

    if (citaData.servicio) {
      console.log("Buscando servicio:", citaData.servicio);
      

      let servicioNombre = citaData.servicio.toLowerCase().replace(/[()]/g, '').trim();
      let servicioIdMapped = '';
      

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
      

      for (const [clave, valor] of Object.entries(mapaServicios)) {
        if (servicioNombre.includes(clave)) {
          servicioIdMapped = valor;
          break;
        }
      }
      
      console.log("ID mapeado del servicio:", servicioIdMapped);
      
      let servicio = null;
      

      if (servicioIdMapped) {
        servicio = serviciosProcesos.find(s => s.id === servicioIdMapped);
      }
      

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
        

        if (citaData.checklist_data && citaData.checklist_data.pasos) {
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
    console.error('Error: No se pudo cargar la información de la cita');
    router.back();
  } finally {
    setLoading(false);
  }
};
