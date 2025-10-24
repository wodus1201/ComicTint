export interface PdfParams {
  uri: string;
  id?: string;
  name?: string;
}

export interface ColoringParams {
  pdfUri: string;
  pdfId: string;
  pageNumber: number;
}

export type RootStackParamList = {
  Home: undefined;
  PdfList: undefined;
  PdfViewer: PdfParams;
  RecentFiles: undefined;
  Coloring: ColoringParams;
};
