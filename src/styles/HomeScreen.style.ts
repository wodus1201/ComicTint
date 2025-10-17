import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    margin: 0,
    color: 'white',
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  startButton: {
    marginBottom: 10,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
});
