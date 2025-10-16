import React from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  value: string;
  onChangeText: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function RenameModal({ visible, value, onChangeText, onCancel, onConfirm }: Props) {
  if (!visible) return null;
  return (
    <TouchableWithoutFeedback onPress={onCancel}>
      <View style={styles.fullOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.renameContainer}>
            <Text style={styles.renameTitle}>이름 변경</Text>
            <TextInput
              style={styles.renameInput}
              value={value}
              onChangeText={onChangeText}
              placeholder="새 이름"
              autoFocus
            />
            <View style={styles.renameActions}>
              <TouchableOpacity style={styles.renameButton} onPress={onCancel}>
                <Text style={styles.renameButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.renameButtonPrimary} onPress={onConfirm}>
                <Text style={styles.renameButtonPrimaryText}>저장</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  fullOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  renameContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '80%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  renameTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  renameInput: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 16,
  },
  renameActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  renameButton: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    marginRight: 8,
  },
  renameButtonText: {
    fontSize: 16,
    color: '#333',
  },
  renameButtonPrimary: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    backgroundColor: 'skyblue',
    borderRadius: 12,
  },
  renameButtonPrimaryText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});


