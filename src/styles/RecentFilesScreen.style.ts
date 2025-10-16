import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    backgroundColor: 'skyblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  item: {
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    flex: 1,
    marginRight: 10,
    fontSize: 20,
    fontWeight: '500',
  },
  timeText: {
    fontWeight: '400',
    fontSize: 14,
    color: '#666',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 100,
  },
  buttonText: {
    fontWeight: '600',
    color: 'white',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'skyblue',
  },
});
