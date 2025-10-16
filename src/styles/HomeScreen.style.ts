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
    fontSize: 40,
    fontWeight: 'bold',
    color: 'dimgray',
  },
  subtitle: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: '600',
    color: 'dimgray',
  },
  startButton: {
    marginBottom: 10,
    paddingHorizontal: 40,
    paddingVertical: 15,
    backgroundColor: 'skyblue',
    borderRadius: 30,
  },
  startButtonText: {
    fontWeight: '600',
    color: 'white',
  },
  themeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 15,
    backgroundColor: 'dimgray',
    borderRadius: 30,
  },
  themeButtonText: {
    fontWeight: '600',
    color: 'white',
  },
});
