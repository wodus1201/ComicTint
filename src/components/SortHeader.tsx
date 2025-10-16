import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/PdfListScreen.styles';

type Props = {
  title: string;
  onOpenSortMenu: () => void;
};

export default function SortHeader({ title, onOpenSortMenu }: Props) {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        accessibilityLabel='정렬 옵션'
        accessibilityHint='정렬 메뉴 열기'
        testID='open-sort-menu'
        onPress={onOpenSortMenu}
        style={styles.sortButtonContainer}
      >
        <Text style={styles.sortButtonText}>정렬</Text>
      </TouchableOpacity>
    </View>
  );
}
