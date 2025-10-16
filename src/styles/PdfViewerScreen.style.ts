import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  centerTap: {
    position: 'absolute',
    top: '35%',
    bottom: '35%',
    left: '25%',
    right: '25%',
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  pdf: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: {
    position: 'absolute',
    bottom: 10,
    left: 15,
    right: 15,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 6,
    backgroundColor: 'skyblue',
    borderRadius: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 46,
    backgroundColor: 'white',
  },
});
