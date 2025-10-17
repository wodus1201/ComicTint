import React from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native';
import { styles } from '../styles/CustomAlert.style';

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertOptions {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
}

type Props = {
  visible: boolean;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  onClose: () => void;
  hookId?: string;
};

export default function CustomAlert({
  visible,
  title,
  message,
  buttons = [],
  onClose,
  hookId,
}: Props) {
  const { width, height } = Dimensions.get('screen');

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  const handleOverlayPress = () => {
    const cancelButton = buttons.find(btn => btn.style === 'cancel');
    if (cancelButton && cancelButton.onPress) {
      cancelButton.onPress();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <StatusBar backgroundColor='rgba(0, 0, 0, 0.5)' barStyle='light-content' translucent />
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={[styles.overlay, { width, height }]}>
          <TouchableWithoutFeedback>
            <View style={styles.alertContainer}>
              {title && <Text style={styles.title}>{title}</Text>}
              {message && <Text style={styles.message}>{message}</Text>}

              <View style={styles.buttonContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity key={index} onPress={() => handleButtonPress(button)}>
                    <Text
                      style={[
                        styles.buttonText,
                        button.style === 'destructive' && { color: 'orangered' },
                      ]}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
