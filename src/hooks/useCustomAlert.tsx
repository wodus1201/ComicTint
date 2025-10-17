import { useState, useCallback, useMemo } from 'react';
import CustomAlert, { AlertButton, AlertOptions } from '../components/CustomAlert';

export function useCustomAlert(hookId?: string) {
  const [alertState, setAlertState] = useState<{
    visible: boolean;
    title?: string;
    message?: string;
    buttons?: AlertButton[];
  }>({
    visible: false,
  });

  const showAlert = useCallback(
    (options: AlertOptions) => {
      setAlertState({
        visible: true,
        title: options.title,
        message: options.message,
        buttons: options.buttons || [{ text: '확인' }],
      });
    },
    [hookId],
  );

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, visible: false }));
  }, [hookId]);

  const AlertComponent = useMemo(
    () => (
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onClose={hideAlert}
        hookId={hookId}
      />
    ),
    [
      alertState.visible,
      alertState.title,
      alertState.message,
      alertState.buttons,
      hideAlert,
      hookId,
    ],
  );

  return {
    showAlert,
    hideAlert,
    AlertComponent,
  };
}
