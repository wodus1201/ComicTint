import { useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/PdfListScreen.styles';

type Props = {
  title: string;
  onOpenSortMenu: (measure: { x: number; y: number; width: number; height: number }) => void;
};

export default function SortHeader({ title, onOpenSortMenu }: Props) {
  const btnRef = useRef<any>(null);
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        accessibilityLabel='정렬 옵션'
        accessibilityHint='정렬 메뉴 열기'
        testID='open-sort-menu'
        ref={btnRef}
        onPress={() => {
          if (btnRef.current && btnRef.current.measureInWindow) {
            btnRef.current.measureInWindow(
              (x: number, y: number, width: number, height: number) => {
                onOpenSortMenu({ x, y, width, height });
              },
            );
          } else {
            onOpenSortMenu({ x: 0, y: 0, width: 0, height: 0 });
          }
        }}
        style={styles.sortButtonContainer}
      >
        <Text style={styles.sortButtonText}>정렬</Text>
      </TouchableOpacity>
    </View>
  );
}
