const mock = {
  types: { pdf: 'application/pdf' },
  pickSingle: jest.fn(async (_opts?: any) => ({
    uri: 'file:///mock/path/sample.pdf',
    name: 'sample.pdf',
    fileCopyUri: null,
    type: 'application/pdf',
    size: 1234,
  })),
  isCancel: (e: any) => e && e.name === 'AbortError',
};

export default mock;
export const types = mock.types;
