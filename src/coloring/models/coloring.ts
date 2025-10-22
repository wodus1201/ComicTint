export interface Point {
  x: number;
  y: number;
  pressure?: number;
  timestamp: number;
}

export interface BrushSettings {
  type: 'pen' | 'brush' | 'eraser' | 'bucket';
  size: number;
  opacity: number;
  color: string;
  hardness: number;
}

export interface Stroke {
  id: string;
  points: Point[];
  brush: BrushSettings;
  createdAt: number;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  strokes: Stroke[];
  createdAt: number;
  modifiedAt: number;
}

export interface ColoringAction {
  type: 'draw_stroke' | 'add_layer' | 'delete_layer' | 'move_layer' | 'change_brush';
  timestamp: number;
  data: any;
}

export interface ColoringProject {
  id: string;
  pdfId: string;
  pageNumber: number;
  createdAt: number;
  lastModified: number;
  version: string;

  canvas: {
    width: number;
    height: number;
    scale: number;
    offset: { x: number; y: number };
  };

  layers: Layer[];

  history?: {
    past: ColoringAction[];
    present: ColoringAction | null;
    future: ColoringAction[];
    maxHistorySize: number;
  };

  metadata: {
    title: string;
    description?: string;
    tags: string[];
    thumbnail?: string;
  };
}

export interface ColoringProjectIndex {
  id: string;
  pdfId: string;
  pageNumber: number;
  title: string;
  thumbnail?: string;
  createdAt: number;
  lastModified: number;
}

export type BrushType = 'pen' | 'brush' | 'eraser' | 'bucket';

export interface CanvasState {
  width: number;
  height: number;
  scale: number;
  offset: { x: number; y: number };
  isDrawing: boolean;
}

export interface LayerState {
  items: Layer[];
  activeLayerId: string;
  nextLayerId: number;
}

export interface HistoryState {
  past: ColoringAction[];
  present: ColoringAction | null;
  future: ColoringAction[];
  maxHistorySize: number;
}

export interface ProjectState {
  id: string;
  pdfId: string;
  pageNumber: number;
  createdAt: number;
  lastModified: number;
  isDirty: boolean;
}
