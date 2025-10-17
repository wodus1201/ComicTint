import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  fullOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  renameContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  renameTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    marginLeft: 3,
  },
  renameInput: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 12,
  },
  renameActions: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  renameButton: {
    marginRight: 8,
  },
  renameButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
});
