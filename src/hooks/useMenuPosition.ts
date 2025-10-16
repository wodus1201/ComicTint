import { useState, useRef } from 'react';
import { Dimensions } from 'react-native';

type PdfItem = { id: string; name: string; uri?: string };

export function useMenuPosition() {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const [menuLeft, setMenuLeft] = useState(0);
  const [selectedItem, setSelectedItem] = useState<PdfItem | null>(null);
  const moreBtnRefs = useRef<Record<string, any>>({});

  const handleMorePress = (item: PdfItem, editMode: boolean) => {
    if (editMode) return;

    const ref = moreBtnRefs.current[item.id];
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const MENU_WIDTH = 200;
    const MENU_HEIGHT = 110;

    if (!ref || !ref.measureInWindow) {
      setSelectedItem(item);
      setMenuTop(Math.max(8, screenHeight / 2 - MENU_HEIGHT / 2));
      setMenuLeft(
        Math.min(Math.max(screenWidth / 2 - MENU_WIDTH / 2, 8), screenWidth - MENU_WIDTH - 8),
      );
      setMenuVisible(true);
      return;
    }

    ref.measureInWindow((x: number, y: number, width: number, height: number) => {
      const buttonRight = x + width;
      const buttonBottom = y + height;
      const buttonTop = y;
      const V_OFFSET = 25;

      const spaceBelow = screenHeight - buttonBottom;
      const showAbove = spaceBelow < MENU_HEIGHT;
      const top = showAbove
        ? Math.max(8, buttonTop - MENU_HEIGHT - V_OFFSET)
        : buttonBottom + V_OFFSET;

      let left = buttonRight - MENU_WIDTH;
      left = Math.min(Math.max(left, 8), screenWidth - MENU_WIDTH - 8);

      setSelectedItem(item);
      setMenuTop(top);
      setMenuLeft(left);
      setMenuVisible(true);
    });
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedItem(null);
  };

  const setRef = (itemId: string, ref: any) => {
    if (ref) {
      moreBtnRefs.current[itemId] = ref;
    } else {
      delete moreBtnRefs.current[itemId];
    }
  };

  return {
    menuVisible,
    menuTop,
    menuLeft,
    selectedItem,
    handleMorePress,
    closeMenu,
    setRef,
  };
}
