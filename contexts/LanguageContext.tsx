import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'es' | 'en' | 'fr' | 'it';

type TranslationKeys =
  | 'language.select' | 'language.spanish' | 'language.english' | 'language.french' | 'language.italian'
  | 'button.ready' | 'button.back'
  | 'categories.title'
  | 'location.title' | 'location.maps' | 'location.waze' | 'location.call'
  | 'contact.title' | 'contact.callcenter' | 'contact.email'
  | 'contact.form.name' | 'contact.form.email' | 'contact.form.phone' | 'contact.form.province' | 'contact.form.comments' | 'contact.form.submit'
  | 'profile.title' | 'profile.edit' | 'profile.edit.link' | 'profile.logout'
  | 'profile.name' | 'profile.id' | 'profile.phone' | 'profile.email' | 'profile.province' | 'profile.canton' | 'profile.district';

type TranslationRecord = Record<TranslationKeys, string>;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeys) => string;
}

const translations: Record<Language, TranslationRecord> = {
  es: {
    'language.select': 'Seleccioná Una Opción',
    'language.spanish': 'Español',
    'language.english': 'Inglés',
    'language.french': 'Francés',
    'language.italian': 'Italiano',
    'button.ready': 'Listo',
    'button.back': 'Volver',

    'categories.title': 'Top Categorías',

    'location.title': 'Nuestras Sucursales',
    'location.maps': 'Maps',
    'location.waze': 'Waze',
    'location.call': 'Llamar',

    'contact.title': 'Contacto',
    'contact.callcenter': 'Call Center',
    'contact.email': 'Correo Electrónico',
    'contact.form.name': 'Nombre',
    'contact.form.email': 'Correo Electrónico',
    'contact.form.phone': 'Teléfono',
    'contact.form.province': 'Provincia',
    'contact.form.comments': 'Comentarios',
    'contact.form.submit': 'Enviar',

    'profile.title': 'Perfil',
    'profile.edit': 'Necesitás Modificar Tu Información?',
    'profile.edit.link': 'Hace Click Aquí',
    'profile.logout': 'Cerrar Sesión',
    'profile.name': 'Nombre',
    'profile.id': 'N° Cédula',
    'profile.phone': 'N° Teléfono',
    'profile.email': 'Correo Electrónico',
    'profile.province': 'Provincia',
    'profile.canton': 'Cantón',
    'profile.district': 'Distrito',
  },
  en: {
    'language.select': 'Select an Option',
    'language.spanish': 'Spanish',
    'language.english': 'English',
    'language.french': 'French',
    'language.italian': 'Italian',
    'button.ready': 'Ready',
    'button.back': 'Back',

    'categories.title': 'Top Categories',

    'location.title': 'Our Branches',
    'location.maps': 'Maps',
    'location.waze': 'Waze',
    'location.call': 'Call',

    'contact.title': 'Contact',
    'contact.callcenter': 'Call Center',
    'contact.email': 'Email',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Phone',
    'contact.form.province': 'Province',
    'contact.form.comments': 'Comments',
    'contact.form.submit': 'Submit',

    'profile.title': 'Profile',
    'profile.edit': 'Need to Modify Your Information?',
    'profile.edit.link': 'Click Here',
    'profile.logout': 'Logout',
    'profile.name': 'Name',
    'profile.id': 'ID Number',
    'profile.phone': 'Phone Number',
    'profile.email': 'Email',
    'profile.province': 'Province',
    'profile.canton': 'Canton',
    'profile.district': 'District',
  },
  fr: {
    'language.select': 'Sélectionnez une Option',
    'language.spanish': 'Espagnol',
    'language.english': 'Anglais',
    'language.french': 'Français',
    'language.italian': 'Italien',
    'button.ready': 'Prêt',
    'button.back': 'Retour',

    'categories.title': 'Meilleures Catégories',

    'location.title': 'Nos Succursales',
    'location.maps': 'Maps',
    'location.waze': 'Waze',
    'location.call': 'Appeler',

    'contact.title': 'Contact',
    'contact.callcenter': 'Centre d\'Appel',
    'contact.email': 'Email',
    'contact.form.name': 'Nom',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Téléphone',
    'contact.form.province': 'Province',
    'contact.form.comments': 'Commentaires',
    'contact.form.submit': 'Envoyer',

    'profile.title': 'Profil',
    'profile.edit': 'Besoin de Modifier Vos Informations?',
    'profile.edit.link': 'Cliquez Ici',
    'profile.logout': 'Déconnexion',
    'profile.name': 'Nom',
    'profile.id': 'Numéro d\'Identification',
    'profile.phone': 'Numéro de Téléphone',
    'profile.email': 'Email',
    'profile.province': 'Province',
    'profile.canton': 'Canton',
    'profile.district': 'District',
  },
  it: {
    'language.select': 'Seleziona un\'Opzione',
    'language.spanish': 'Spagnolo',
    'language.english': 'Inglese',
    'language.french': 'Francese',
    'language.italian': 'Italiano',
    'button.ready': 'Pronto',
    'button.back': 'Indietro',

    'categories.title': 'Categorie Principali',

    'location.title': 'Le Nostre Filiali',
    'location.maps': 'Maps',
    'location.waze': 'Waze',
    'location.call': 'Chiama',

    'contact.title': 'Contatto',
    'contact.callcenter': 'Call Center',
    'contact.email': 'Email',
    'contact.form.name': 'Nome',
    'contact.form.email': 'Email',
    'contact.form.phone': 'Telefono',
    'contact.form.province': 'Provincia',
    'contact.form.comments': 'Commenti',
    'contact.form.submit': 'Invia',

    'profile.title': 'Profilo',
    'profile.edit': 'Hai Bisogno di Modificare le Tue Informazioni?',
    'profile.edit.link': 'Clicca Qui',
    'profile.logout': 'Disconnetti',
    'profile.name': 'Nome',
    'profile.id': 'Numero di Identificazione',
    'profile.phone': 'Numero di Telefono',
    'profile.email': 'Email',
    'profile.province': 'Provincia',
    'profile.canton': 'Cantone',
    'profile.district': 'Distretto',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  const t = (key: TranslationKeys): string => {
    return translations[language][key];
  };

  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage && ['es', 'en', 'fr', 'it'].includes(savedLanguage)) {
          setLanguageState(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    loadSavedLanguage();
  }, []);

  const setLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem('userLanguage', newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};