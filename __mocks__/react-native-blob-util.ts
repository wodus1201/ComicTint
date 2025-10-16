const fs = {
  dirs: { DocumentDir: '/tmp' },
  isDir: async (_p: string) => true,
  mkdir: async (_p: string) => {},
  cp: async (_src: string, _dst: string) => {},
  readStream: async (_p: string, _enc: string) => {
    let handlers: Record<string, Function> = {};
    return {
      open: () => {},
      onData: (cb: any) => {
        handlers.data = cb;
      },
      onEnd: (cb: any) => {
        handlers.end = cb;
        setTimeout(() => cb(), 0);
      },
      onError: (_cb: any) => {},
    };
  },
  writeFile: async (_p: string, _data: string, _enc: string) => {},
  stat: async (_p: string) => ({ size: 1 }),
  exists: async (_p: string) => true,
  unlink: async (_p: string) => {},
};

const mock = { fs };
export default mock;
