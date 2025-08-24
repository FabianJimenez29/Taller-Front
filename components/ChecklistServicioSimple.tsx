import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProcesoPaso } from '../constants/ServiciosProcesos';

interface SimpleChecklistProps {
  procesos: ProcesoPaso[];
  onToggleStep: (id: string, completed: boolean) => void;
  completedSteps: string[];
}

const ChecklistServicio = ({ procesos, onToggleStep, completedSteps }: SimpleChecklistProps) => {
  return (
    <View style={styles.container}>
      {procesos.map(paso => {
        const isCompleted = paso.completado || completedSteps.includes(paso.id);
        
        return (
          <TouchableOpacity 
            key={paso.id}
            style={styles.checklistItem} 
            onPress={() => onToggleStep(paso.id, !isCompleted)}
          >
            <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
              {isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={[styles.checklistText, isCompleted && styles.checklistTextCompleted]}>
              {paso.descripcion}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#76B414',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#76B414',
  },
  checklistText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  checklistTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  }
});

export default ChecklistServicio;
