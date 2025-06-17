import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Types
export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export interface Toast extends Required<Omit<ToastProps, 'duration'>> {
  duration: number;
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
  removeToast: (id: string) => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

// Toast Actions
type ToastAction = 
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string };

// Toast Context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast Reducer
const toastReducer = (state: Toast[], action: ToastAction): Toast[] => {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.payload];
    case 'REMOVE_TOAST':
      return state.filter(toast => toast.id !== action.payload);
    default:
      return state;
  }
};

// Toast Provider
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const toast = ({ title = '', description = '', variant = 'default', duration = 5000 }: ToastProps) => {
    const id = Date.now() + Math.random().toString();
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      duration
    };

    dispatch({
      type: 'ADD_TOAST',
      payload: newToast
    });

    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE_TOAST', payload: id });
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// useToast Hook
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Component Props
interface ToastComponentProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

// Toast Component
const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onRemove }) => {
  const getIcon = (): JSX.Element | null => {
    switch (toast.variant) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getVariantStyles = (): string => {
    switch (toast.variant) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-white border-gray-200 text-gray-900';
    }
  };

  return (
    <div className={`
      relative flex w-full max-w-sm items-center space-x-2 overflow-hidden rounded-md border p-4 shadow-lg
      transition-all duration-300 ease-in-out animate-in slide-in-from-right-full
      ${getVariantStyles()}
    `}>
      {getIcon()}
      <div className="flex-1 space-y-1">
        {toast.title && (
          <div className="text-sm font-semibold">
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90">
            {toast.description}
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2"
        aria-label="Close toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Toast Container Props
interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

// Toast Container
const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};