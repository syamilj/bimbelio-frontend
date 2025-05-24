'use client';

import {
  BlocknoteEditorType,
  schema,
} from '@/components/workspace/editor/provider';
import { useCreateBlockNote } from '@blocknote/react';
import { createContext, useContext } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function Provider({ children }: Props) {
  const editor = useCreateBlockNote({
    schema,
  });
  const Context = {
    editor,
  };

  return (
    <ProviderContext.Provider value={Context}>
      {children}
    </ProviderContext.Provider>
  );
}

const ProviderContext = createContext<undefined | ProviderType>(undefined);

export const useProvider = () => {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useProvider must be used within an ProviderContext');
  }
  return context;
};

type ProviderType = {
  editor: BlocknoteEditorType;
};
