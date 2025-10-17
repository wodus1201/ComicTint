import { useState, useCallback } from 'react';
import CustomAlert, { AlertButton, AlertOptions } from '../components/CustomAlert';

export function useCustomAlert() {
  const [alertState, setAlertState] = useState<{
    visible: boolean;
    title?: string;
    message?: string;
    buttons?: AlertButton[];
  }>({
    visible: false,
  });

  const showAlert = useCallback((options: AlertOptions) => {
    setAlertState({
      visible: true,
      title: options.title,
      message: options.message,
      buttons: options.buttons || [{ text: '확인' }],
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, visible: false }));
  }, []);

  const AlertComponent = (
    <CustomAlert
      visible={alertState.visible}
      title={alertState.title}
      message={alertState.message}
      buttons={alertState.buttons}
      onClose={hideAlert}
    />
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
}
