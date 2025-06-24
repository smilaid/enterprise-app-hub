
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { logger, LogCategory } from '../utils/logger';

interface FeatureFlags {
  showUserActivityPanel: boolean;
  showAdminDashboard: boolean;
  showAdminViewToggle: boolean;
}

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  updateFlag: (key: keyof FeatureFlags, value: boolean) => void;
  isAdmin: boolean;
  isViewingAsUser: boolean;
  toggleAdminView: () => void;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

const DEFAULT_FLAGS: FeatureFlags = {
  showUserActivityPanel: false,
  showAdminDashboard: false,
  showAdminViewToggle: false,
};

interface FeatureFlagsProviderProps {
  children: ReactNode;
  isAdmin: boolean;
}

export const FeatureFlagsProvider = ({ children, isAdmin }: FeatureFlagsProviderProps) => {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [isViewingAsUser, setIsViewingAsUser] = useState(false);

  useEffect(() => {
    // Load flags from localStorage for admin users
    if (isAdmin) {
      const savedFlags = localStorage.getItem('adminFeatureFlags');
      if (savedFlags) {
        try {
          const parsedFlags = JSON.parse(savedFlags);
          setFlags({ ...DEFAULT_FLAGS, ...parsedFlags });
          logger.debug(LogCategory.SYSTEM, 'Feature flags loaded from localStorage', parsedFlags);
        } catch (error) {
          logger.error(LogCategory.SYSTEM, 'Failed to parse feature flags from localStorage', error);
        }
      }
      
      // Load admin view state
      const savedViewState = localStorage.getItem('adminViewAsUser');
      if (savedViewState === 'true') {
        setIsViewingAsUser(true);
      }
    } else {
      // Non-admin users always have flags disabled
      setFlags(DEFAULT_FLAGS);
      setIsViewingAsUser(false);
    }
  }, [isAdmin]);

  const updateFlag = (key: keyof FeatureFlags, value: boolean) => {
    if (!isAdmin) {
      logger.warn(LogCategory.AUTH, 'Non-admin user attempted to update feature flags');
      return;
    }

    const newFlags = { ...flags, [key]: value };
    setFlags(newFlags);
    localStorage.setItem('adminFeatureFlags', JSON.stringify(newFlags));
    
    logger.info(LogCategory.USER_ACTION, 'Feature flag updated', { key, value, userId: 'admin' });
  };

  const toggleAdminView = () => {
    if (!isAdmin) return;
    
    const newViewState = !isViewingAsUser;
    setIsViewingAsUser(newViewState);
    localStorage.setItem('adminViewAsUser', newViewState.toString());
    
    logger.info(LogCategory.USER_ACTION, 'Admin view toggled', { isViewingAsUser: newViewState });
  };

  return (
    <FeatureFlagsContext.Provider value={{ 
      flags, 
      updateFlag, 
      isAdmin, 
      isViewingAsUser, 
      toggleAdminView 
    }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};
