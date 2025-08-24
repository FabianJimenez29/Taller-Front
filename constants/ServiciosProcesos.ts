// Definición de interfaces para el checklist de servicios
export interface ProcesoPaso {
  id: string;
  descripcion: string;
  requiereAutorizacion?: boolean;
  autorizacionRecibida?: boolean;
  completado?: boolean;
  observaciones?: string;
}

export interface ProcesoServicio {
  id: string;
  nombre: string;
  pasos: ProcesoPaso[];
}

// Definición de todos los procesos de servicios disponibles
export const serviciosProcesos: ProcesoServicio[] = [
  {
    id: "alineado",
    nombre: "Alineado de Dirección",
    pasos: [
      {
        id: "alineado-p1",
        descripcion: "Inspeccionar desgaste de las llantas de forma individual y verificar si presentan cortes, desgastes irregulares o deformaciones",
        completado: false
      },
      {
        id: "alineado-p2",
        descripcion: "Si alguna llanta está dañada preguntar al cliente si desea reemplazar la llanta dañada",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "alineado-p3",
        descripcion: "Si el cliente acepta comprar y reemplazar la llanta, proceder a retirar la llanta dañada, instalar la nueva, verificar presión y balanceo antes de continuar con el alineado",
        completado: false
      },
      {
        id: "alineado-p4",
        descripcion: "Colocar el vehículo en la máquina de alineado asegurándose de que todas las ruedas estén correctamente fijadas",
        completado: false
      },
      {
        id: "alineado-p5",
        descripcion: "Verificar suspensión y sistema de dirección inspeccionando bujes, amortiguadores y terminales",
        completado: false
      },
      {
        id: "alineado-p6",
        descripcion: "Si se detectan piezas dañadas notificar al cliente y esperar su autorización antes de continuar",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "alineado-p7",
        descripcion: "Ajustar los ángulos de alineación incluyendo convergencia, caída y avance según especificaciones del fabricante",
        completado: false
      },
      {
        id: "alineado-p8",
        descripcion: "Verificar que el volante quede recto al conducir en línea recta",
        completado: false
      },
      {
        id: "alineado-p9",
        descripcion: "Realizar prueba de manejo para confirmar correcta alineación",
        completado: false
      },
      {
        id: "alineado-p10",
        descripcion: "Registrar todos los resultados, observaciones y cualquier autorización del cliente",
        completado: false
      }
    ]
  },
  {
    id: "balanceo",
    nombre: "Balanceo y/o Rotación de Llantas",
    pasos: [
      {
        id: "balanceo-p1",
        descripcion: "Retirar todas las llantas del vehículo de manera segura",
        completado: false
      },
      {
        id: "balanceo-p2",
        descripcion: "Colocar cada llanta en la máquina balanceadora asegurándose de que esté correctamente fijada",
        completado: false
      },
      {
        id: "balanceo-p3",
        descripcion: "Si alguna llanta presenta daños preguntar al cliente si desea reemplazar la llanta antes de balancear",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "balanceo-p4",
        descripcion: "Si el cliente acepta reemplazo, retirar la llanta dañada, instalar la nueva y verificar balanceo",
        completado: false
      },
      {
        id: "balanceo-p5",
        descripcion: "Instalar contrapesos necesarios según indique la máquina balanceadora",
        completado: false
      },
      {
        id: "balanceo-p6",
        descripcion: "Realizar la rotación de llantas siguiendo el patrón recomendado por el fabricante",
        completado: false
      },
      {
        id: "balanceo-p7",
        descripcion: "Verificar y ajustar la presión de aire de cada llanta según especificación",
        completado: false
      },
      {
        id: "balanceo-p8",
        descripcion: "Montar nuevamente todas las llantas en el vehículo",
        completado: false
      },
      {
        id: "balanceo-p9",
        descripcion: "Realizar prueba de manejo para confirmar balanceo adecuado",
        completado: false
      },
      {
        id: "balanceo-p10",
        descripcion: "Registrar todos los resultados, observaciones y autorizaciones del cliente",
        completado: false
      }
    ]
  },
  {
    id: "revision_rtv",
    nombre: "Revisión Pre-RTV",
    pasos: [
      {
        id: "rtv-p1",
        descripcion: "Revisar todas las luces del vehículo: delanteras, traseras, intermitentes y de freno",
        completado: false
      },
      {
        id: "rtv-p2",
        descripcion: "Si alguna luz falla preguntar al cliente si desea reemplazar la luz antes de la RTV",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "rtv-p3",
        descripcion: "Si el cliente acepta reemplazo, cambiar la luz y verificar funcionamiento",
        completado: false
      },
      {
        id: "rtv-p4",
        descripcion: "Revisar frenos incluyendo pastillas, discos y nivel de líquido",
        completado: false
      },
      {
        id: "rtv-p5",
        descripcion: "Si los frenos no cumplen especificaciones notificar al cliente y esperar autorización para reparación",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "rtv-p6",
        descripcion: "Verificar emisiones y funcionamiento general del motor",
        completado: false
      },
      {
        id: "rtv-p7",
        descripcion: "Revisar estado y presión de todas las llantas",
        completado: false
      },
      {
        id: "rtv-p8",
        descripcion: "Revisar cinturones de seguridad, parabrisas y bocina",
        completado: false
      },
      {
        id: "rtv-p9",
        descripcion: "Simular condiciones de la RTV realizando pruebas de frenado, luces y emisiones",
        completado: false
      },
      {
        id: "rtv-p10",
        descripcion: "Registrar hallazgos, recomendaciones y autorizaciones del cliente",
        completado: false
      }
    ]
  },
  {
    id: "suspension",
    nombre: "Revisión de Sistema de Suspensión",
    pasos: [
      {
        id: "suspension-p1",
        descripcion: "Inspeccionar todos los amortiguadores y resortes del vehículo",
        completado: false
      },
      {
        id: "suspension-p2",
        descripcion: "Si se detectan fugas o daños preguntar al cliente si desea reparar o reemplazar piezas",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "suspension-p3",
        descripcion: "Si el cliente acepta realizar la reparación o reemplazo, proceder y verificar funcionamiento",
        completado: false
      },
      {
        id: "suspension-p4",
        descripcion: "Revisar bujes, articulaciones y componentes de la suspensión",
        completado: false
      },
      {
        id: "suspension-p5",
        descripcion: "Si se detecta desgaste recomendar reemplazo y esperar autorización del cliente",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "suspension-p6",
        descripcion: "Revisar ruidos anormales al mover el vehículo",
        completado: false
      },
      {
        id: "suspension-p7",
        descripcion: "Probar rebote, estabilidad y manejo del vehículo",
        completado: false
      },
      {
        id: "suspension-p8",
        descripcion: "Ajustar piezas o reemplazar según autorización del cliente",
        completado: false
      },
      {
        id: "suspension-p9",
        descripcion: "Registrar hallazgos, acciones realizadas y autorizaciones",
        completado: false
      }
    ]
  },
  {
    id: "direccion",
    nombre: "Revisión de Sistema de Dirección",
    pasos: [
      {
        id: "direccion-p1",
        descripcion: "Revisar terminales, cremallera, bomba de dirección y todos los componentes del sistema",
        completado: false
      },
      {
        id: "direccion-p2",
        descripcion: "Si se detecta juego excesivo notificar al cliente y esperar autorización para reparación",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "direccion-p3",
        descripcion: "Verificar fugas en sistema hidráulico",
        completado: false
      },
      {
        id: "direccion-p4",
        descripcion: "Si se detectan fugas preguntar al cliente si desea reparación inmediata",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "direccion-p5",
        descripcion: "Si acepta reparar, proceder y verificar funcionamiento",
        completado: false
      },
      {
        id: "direccion-p6",
        descripcion: "Probar dirección en movimiento en diferentes condiciones de manejo",
        completado: false
      },
      {
        id: "direccion-p7",
        descripcion: "Ajustar o reemplazar piezas según autorización del cliente",
        completado: false
      },
      {
        id: "direccion-p8",
        descripcion: "Registrar observaciones, hallazgos y acciones realizadas",
        completado: false
      }
    ]
  },
  {
    id: "mantenimiento",
    nombre: "Revisión y Mantenimiento Periódico por Kilometraje",
    pasos: [
      {
        id: "mantenimiento-p1",
        descripcion: "Consultar el manual del fabricante para los intervalos de mantenimiento recomendados",
        completado: false
      },
      {
        id: "mantenimiento-p2",
        descripcion: "Revisar aceite de motor y transmisión",
        completado: false
      },
      {
        id: "mantenimiento-p3",
        descripcion: "Revisar filtros de aire, aceite y combustible",
        completado: false
      },
      {
        id: "mantenimiento-p4",
        descripcion: "Revisar frenos: pastillas, discos y líquido",
        completado: false
      },
      {
        id: "mantenimiento-p5",
        descripcion: "Revisar correas, cadena de motor y sistema de distribución",
        completado: false
      },
      {
        id: "mantenimiento-p6",
        descripcion: "Revisar luces, sistema eléctrico, batería y fusibles",
        completado: false
      },
      {
        id: "mantenimiento-p7",
        descripcion: "Cambiar piezas o líquidos según kilometraje o desgaste detectado",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "mantenimiento-p8",
        descripcion: "Registrar hallazgos, acciones realizadas y autorizaciones del cliente",
        completado: false
      }
    ]
  },
  {
    id: "llantas",
    nombre: "Compra e Instalación de Llantas",
    pasos: [
      {
        id: "llantas-p1",
        descripcion: "Medir llantas actuales y verificar especificaciones",
        completado: false
      },
      {
        id: "llantas-p2",
        descripcion: "Preguntar al cliente marca, tipo y medida de llanta deseada",
        completado: false
      },
      {
        id: "llantas-p3",
        descripcion: "Retirar llantas viejas y colocar nuevas",
        completado: false
      },
      {
        id: "llantas-p4",
        descripcion: "Realizar balanceo de cada llanta",
        completado: false
      },
      {
        id: "llantas-p5",
        descripcion: "Verificar presión de aire y válvulas",
        completado: false
      },
      {
        id: "llantas-p6",
        descripcion: "Registrar instalación, observaciones y autorizaciones del cliente",
        completado: false
      }
    ]
  },
  {
    id: "reparaciones_mayores",
    nombre: "Reparaciones Mayores Indicar en Observaciones",
    pasos: [
      {
        id: "reparaciones-p1",
        descripcion: "Realizar diagnóstico con scanner y revisión visual completa del vehículo",
        completado: false
      },
      {
        id: "reparaciones-p2",
        descripcion: "Identificar piezas o sistemas dañados",
        completado: false
      },
      {
        id: "reparaciones-p3",
        descripcion: "Informar al cliente y presentar presupuesto detallado",
        completado: false
      },
      {
        id: "reparaciones-p4",
        descripcion: "Esperar autorización del cliente antes de iniciar la reparación",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "reparaciones-p5",
        descripcion: "Realizar reparación o reemplazo según autorización",
        completado: false
      },
      {
        id: "reparaciones-p6",
        descripcion: "Probar funcionamiento del vehículo después de la reparación",
        completado: false
      },
      {
        id: "reparaciones-p7",
        descripcion: "Registrar observaciones, resultados y autorizaciones del cliente",
        completado: false
      }
    ]
  },
  {
    id: "aceite_transmision",
    nombre: "Cambio de Aceite de Transmisión Manual o Automática",
    pasos: [
      {
        id: "aceite-trans-p1",
        descripcion: "Elevar vehículo y localizar tapón de drenaje de transmisión",
        completado: false
      },
      {
        id: "aceite-trans-p2",
        descripcion: "Drenar aceite antiguo completamente",
        completado: false
      },
      {
        id: "aceite-trans-p3",
        descripcion: "Reemplazar filtro si aplica",
        completado: false
      },
      {
        id: "aceite-trans-p4",
        descripcion: "Llenar con aceite recomendado por el fabricante",
        completado: false
      },
      {
        id: "aceite-trans-p5",
        descripcion: "Probar transmisión en diferentes velocidades y verificar niveles",
        completado: false
      },
      {
        id: "aceite-trans-p6",
        descripcion: "Registrar cambio, observaciones y autorizaciones del cliente",
        completado: false
      }
    ]
  },
  {
    id: "aceite_motor",
    nombre: "Cambio de Aceite de Motor",
    pasos: [
      {
        id: "aceite-motor-p1",
        descripcion: "Calentar motor levemente para facilitar drenado",
        completado: false
      },
      {
        id: "aceite-motor-p2",
        descripcion: "Retirar tapón de drenaje y drenar aceite viejo",
        completado: false
      },
      {
        id: "aceite-motor-p3",
        descripcion: "Reemplazar filtro de aceite",
        completado: false
      },
      {
        id: "aceite-motor-p4",
        descripcion: "Llenar motor con aceite nuevo según especificaciones",
        completado: false
      },
      {
        id: "aceite-motor-p5",
        descripcion: "Verificar nivel de aceite y probar motor",
        completado: false
      },
      {
        id: "aceite-motor-p6",
        descripcion: "Registrar cambio, observaciones y autorizaciones del cliente",
        completado: false
      }
    ]
  },
  {
    id: "direccion_hidraulica",
    nombre: "Cambio de Fluido de Dirección Hidráulica",
    pasos: [
      {
        id: "hidraulica-p1",
        descripcion: "Localizar depósito de dirección hidráulica",
        completado: false
      },
      {
        id: "hidraulica-p2",
        descripcion: "Drenar líquido viejo completamente",
        completado: false
      },
      {
        id: "hidraulica-p3",
        descripcion: "Limpiar depósito y revisar mangueras",
        completado: false
      },
      {
        id: "hidraulica-p4",
        descripcion: "Llenar con líquido nuevo adecuado",
        completado: false
      },
      {
        id: "hidraulica-p5",
        descripcion: "Purgar sistema girando volante varias veces",
        completado: false
      },
      {
        id: "hidraulica-p6",
        descripcion: "Verificar nivel final y registrar cambio y observaciones",
        completado: false
      }
    ]
  },
  {
    id: "inyectores",
    nombre: "Limpieza de Inyectores",
    pasos: [
      {
        id: "inyectores-p1",
        descripcion: "Conectar equipo de limpieza con líquido especial para inyectores",
        completado: false
      },
      {
        id: "inyectores-p2",
        descripcion: "Encender motor y realizar limpieza según procedimiento del equipo",
        completado: false
      },
      {
        id: "inyectores-p3",
        descripcion: "Verificar emisiones y funcionamiento del motor después de limpieza",
        completado: false
      },
      {
        id: "inyectores-p4",
        descripcion: "Registrar procedimiento, resultados y observaciones",
        completado: false
      }
    ]
  },
  {
    id: "coolant",
    nombre: "Cambio de Coolant",
    pasos: [
      {
        id: "coolant-p1",
        descripcion: "Drenar refrigerante viejo completamente",
        completado: false
      },
      {
        id: "coolant-p2",
        descripcion: "Enjuagar sistema si es necesario para eliminar residuos",
        completado: false
      },
      {
        id: "coolant-p3",
        descripcion: "Llenar con coolant nuevo adecuado al vehículo",
        completado: false
      },
      {
        id: "coolant-p4",
        descripcion: "Purgar aire del sistema de refrigeración",
        completado: false
      },
      {
        id: "coolant-p5",
        descripcion: "Verificar nivel final y registrar acción, resultados y observaciones",
        completado: false
      }
    ]
  },
  {
    id: "liquido_frenos",
    nombre: "Cambio de Líquido de Frenos",
    pasos: [
      {
        id: "frenos-liq-p1",
        descripcion: "Abrir purgadores de cada freno",
        completado: false
      },
      {
        id: "frenos-liq-p2",
        descripcion: "Drenar líquido viejo y eliminar aire del sistema",
        completado: false
      },
      {
        id: "frenos-liq-p3",
        descripcion: "Llenar con líquido nuevo recomendado por fabricante",
        completado: false
      },
      {
        id: "frenos-liq-p4",
        descripcion: "Purgar sistema para eliminar burbujas de aire",
        completado: false
      },
      {
        id: "frenos-liq-p5",
        descripcion: "Probar frenos y registrar resultados y observaciones",
        completado: false
      }
    ]
  },
  {
    id: "bateria",
    nombre: "Revisión y/o Cambio de Batería",
    pasos: [
      {
        id: "bateria-p1",
        descripcion: "Revisar carga de batería con multímetro",
        completado: false
      },
      {
        id: "bateria-p2",
        descripcion: "Si batería no carga preguntar al cliente si desea reemplazarla",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "bateria-p3",
        descripcion: "Si acepta retirar batería vieja e instalar nueva",
        completado: false
      },
      {
        id: "bateria-p4",
        descripcion: "Revisar bornes y limpiar si necesario",
        completado: false
      },
      {
        id: "bateria-p5",
        descripcion: "Probar encendido del vehículo",
        completado: false
      },
      {
        id: "bateria-p6",
        descripcion: "Registrar resultados y acciones realizadas",
        completado: false
      }
    ]
  },
  {
    id: "frenos_ajuste",
    nombre: "Revisión Ajuste y Limpieza de Frenos",
    pasos: [
      {
        id: "frenos-ajuste-p1",
        descripcion: "Desmontar ruedas y revisar desgaste de pastillas y discos",
        completado: false
      },
      {
        id: "frenos-ajuste-p2",
        descripcion: "Limpiar polvo y residuos acumulados en frenos",
        completado: false
      },
      {
        id: "frenos-ajuste-p3",
        descripcion: "Ajustar frenos de tambor si aplica",
        completado: false
      },
      {
        id: "frenos-ajuste-p4",
        descripcion: "Registrar hallazgos, acciones realizadas y autorizaciones",
        completado: false
      }
    ]
  },
  {
    id: "scanner",
    nombre: "Diagnóstico Scanner",
    pasos: [
      {
        id: "scanner-p1",
        descripcion: "Conectar scanner OBD-II al puerto del vehículo",
        completado: false
      },
      {
        id: "scanner-p2",
        descripcion: "Leer códigos de error y registrar cada código",
        completado: false
      },
      {
        id: "scanner-p3",
        descripcion: "Verificar sensores y módulos reportados por scanner",
        completado: false
      },
      {
        id: "scanner-p4",
        descripcion: "Interpretar resultados y notificar al cliente",
        completado: false
      },
      {
        id: "scanner-p5",
        descripcion: "Registrar diagnóstico, acciones recomendadas y autorizaciones",
        completado: false
      }
    ]
  },
  {
    id: "frenos_revision",
    nombre: "Revisión de Frenos",
    pasos: [
      {
        id: "frenos-rev-p1",
        descripcion: "Revisar nivel de líquido de frenos",
        completado: false
      },
      {
        id: "frenos-rev-p2",
        descripcion: "Inspeccionar pastillas, discos y tambores",
        completado: false
      },
      {
        id: "frenos-rev-p3",
        descripcion: "Probar pedal de freno y distancia de frenado",
        completado: false
      },
      {
        id: "frenos-rev-p4",
        descripcion: "Si hay desgaste preguntar al cliente si desea reemplazo",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "frenos-rev-p5",
        descripcion: "Registrar hallazgos, acciones realizadas y autorizaciones",
        completado: false
      }
    ]
  },
  {
    id: "super_evaluacion",
    nombre: "Super Evaluación 28 pts",
    pasos: [
      {
        id: "super-p1",
        descripcion: "Revisar motor incluyendo nivel de aceite, funcionamiento y correas",
        completado: false
      },
      {
        id: "super-p2",
        descripcion: "Revisar aceite de transmisión, nivel y estado",
        completado: false
      },
      {
        id: "super-p3",
        descripcion: "Revisar sistema de refrigeración, coolant, nivel y fugas",
        completado: false
      },
      {
        id: "super-p4",
        descripcion: "Revisar sistema de admisión y filtro de aire",
        completado: false
      },
      {
        id: "super-p5",
        descripcion: "Revisar sistema de escape, fugas y daños",
        completado: false
      },
      {
        id: "super-p6",
        descripcion: "Revisar frenos, pastillas delanteras y traseras",
        completado: false
      },
      {
        id: "super-p7",
        descripcion: "Revisar discos delanteros y traseros",
        completado: false
      },
      {
        id: "super-p8",
        descripcion: "Revisar líquido de frenos y pedal",
        completado: false
      },
      {
        id: "super-p9",
        descripcion: "Revisar freno de mano",
        completado: false
      },
      {
        id: "super-p10",
        descripcion: "Revisar suspensión, amortiguadores delanteros y traseros",
        completado: false
      },
      {
        id: "super-p11",
        descripcion: "Revisar resortes y bujes",
        completado: false
      },
      {
        id: "super-p12",
        descripcion: "Revisar terminales de dirección y bomba de dirección",
        completado: false
      },
      {
        id: "super-p13",
        descripcion: "Revisar juego o holgura del volante",
        completado: false
      },
      {
        id: "super-p14",
        descripcion: "Revisar presión de aire y dibujo de llantas",
        completado: false
      },
      {
        id: "super-p15",
        descripcion: "Revisar balanceo y estado general de ruedas y llantas",
        completado: false
      },
      {
        id: "super-p16",
        descripcion: "Revisar luces delanteras, traseras e intermitentes",
        completado: false
      },
      {
        id: "super-p17",
        descripcion: "Revisar bocina",
        completado: false
      },
      {
        id: "super-p18",
        descripcion: "Revisar batería y bornes",
        completado: false
      },
      {
        id: "super-p19",
        descripcion: "Revisar fusibles y tablero de instrumentos",
        completado: false
      },
      {
        id: "super-p20",
        descripcion: "Revisar cinturones de seguridad y anclajes",
        completado: false
      },
      {
        id: "super-p21",
        descripcion: "Si se detecta falla en algún punto preguntar al cliente si desea reparación inmediata",
        requiereAutorizacion: true,
        completado: false
      },
      {
        id: "super-p22",
        descripcion: "Registrar hallazgos y prioridad de reparación",
        completado: false
      },
      {
        id: "super-p23",
        descripcion: "Entregar reporte completo al cliente y registrar observaciones",
        completado: false
      }
    ]
  }
];

// Función para obtener los procesos de un servicio específico
export const getProcesosServicio = (servicioId: string): ProcesoServicio | undefined => {
  return serviciosProcesos.find(servicio => servicio.id === servicioId);
};

// Función para mapear entre el ID del servicio en "Servicios.ts" y el ID en "ServiciosProcesos.ts"
export const mapServicioIdToProcesosId = (servicioId: string): string => {
  const mapeo: {[key: string]: string} = {
    "alineado": "alineado",
    "balanceo": "balanceo",
    "pre_rtv": "revision_rtv",
    "suspension": "suspension",
    "direccion": "direccion",
    "mantenimiento": "mantenimiento",
    "llantas": "llantas",
    "reparaciones_mayores": "reparaciones_mayores",
    "aceite_transmision": "aceite_transmision",
    "aceite_motor": "aceite_motor",
    "direccion_hidraulica": "direccion_hidraulica",
    "inyectores": "inyectores",
    "coolant": "coolant",
    "liquido_frenos": "liquido_frenos",
    "bateria": "bateria",
    "frenos_ajuste": "frenos_ajuste",
    "scanner": "scanner",
    "frenos_revision": "frenos_revision",
    "super_evaluacion": "super_evaluacion"
  };
  
  return mapeo[servicioId] || servicioId;
};
