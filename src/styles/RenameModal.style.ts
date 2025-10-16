import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
    width: '80%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 12,
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
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 12,
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
    fontWeight: '600',
    color: 'white',
  },
});
