
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { logger, LogCategory } from '../utils/logger';

interface FeatureFlags {
  showUserActivityPanel: boolean;
  showAdminDashboard: boolean;
  showUserSelector: boolean;
}

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  updateFlag: (key: keyof FeatureFlags, value: boolean) => void;
  isAdmin: boolean;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

const DEFAULT_FLAGS: FeatureFlags = {
  showUserActivityPanel: false,
  showAdminDashboard: false,
  showUserSelector: false,
};

interface FeatureFlagsProviderProps {
  children: ReactNode;
  isAdmin: boolean;
}

export const FeatureFlagsProvider = ({ children, isAdmin }: FeatureFlagsProviderProps) => {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FLAGS);

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
    } else {
      // Non-admin users always have flags disabled
      setFlags(DEFAULT_FLAGS);
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

  return (
    <FeatureFlagsContext.Provider value={{ flags, updateFlag, isAdmin }}>
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
