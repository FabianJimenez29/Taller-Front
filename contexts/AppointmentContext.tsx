
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppointmentData {
  // Datos de scheduleRepair.tsx
  sucursal?: string;
  servicio?: string;
  fecha?: string;
  hora?: string;
  
  // Datos de scheduleRepairV2.tsx
  tipoPlaca?: string;
  numeroPlaca?: string;
  marca?: string;
  modelo?: string;
  problema?: string;
}

interface AppointmentContextType {
  appointmentData: AppointmentData;
  updateAppointmentData: (data: Partial<AppointmentData>) => void;
  clearAppointmentData: () => void;
  saveToStorage: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({});

  // Inicialización
  useEffect(() => {
    // Inicializar el estado
  }, []);

  const updateAppointmentData = (data: Partial<AppointmentData>) => {
    setAppointmentData(prev => {
      const updated = { ...prev, ...data };
      return updated;
    });
  };

  const clearAppointmentData = async () => {
    setAppointmentData({});
    try {
      await AsyncStorage.removeItem('appointmentData');
    } catch (error) {
      // Error al limpiar los datos
    }
  };

  const saveToStorage = async () => {
    try {
      await AsyncStorage.setItem('appointmentData', JSON.stringify(appointmentData));
    } catch (error) {
      // Error al guardar los datos
    }
  };

  const loadFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('appointmentData');
      if (stored) {
        const parsed = JSON.parse(stored);
        setAppointmentData(parsed);
      }
    } catch (error) {
      // Error al cargar los datos
    }
  };

  // Guardar automáticamente cuando cambien los datos
  useEffect(() => {
    if (Object.keys(appointmentData).length > 0) {
      saveToStorage();
    }
  }, [appointmentData]);

  // Cargar datos al iniciar la app
  useEffect(() => {
    loadFromStorage();
  }, []);

  const value: AppointmentContextType = {
    appointmentData,
    updateAppointmentData,
    clearAppointmentData,
    saveToStorage,
    loadFromStorage,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
