import React from 'react';

export function createContext<ContextValueProps>(
  componentName: string,
  defaultContextValue?: ContextValueProps,
  options?: {
    error: string;
  },
) {
  const Context = React.createContext<ContextValueProps | undefined>(undefined);

  Context.displayName = componentName + 'Provider';

  function Provider(props: ContextValueProps & { children: React.ReactNode }) {
    const { children, ...contextValue } = props;
    const value = React.useMemo(
      () => contextValue,
      Object.values(contextValue),
    ) as ContextValueProps;

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContextHook(): ContextValueProps {
    const contextValue = React.useContext(Context);
    if (contextValue) return contextValue;
    if (defaultContextValue !== undefined) return defaultContextValue;

    throw new Error(
      options?.error ||
        `use${componentName} must be used within ${componentName}Provider`,
    );
  }

  return [Provider, useContextHook] as const;
}
