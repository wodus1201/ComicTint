import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    paddingVertical: 20,
    paddingRight: 10,
    flex: 1,
  },
  itemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontWeight: '500',
    fontSize: 20,
  },
  pinIcon: {
    marginLeft: 8,
  },
  moreButton: {
    borderRadius: 20,
    padding: 5,
  },
  checkOuter: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'darkgray',
    borderWidth: 3,
    borderRadius: '100%',
  },
});
