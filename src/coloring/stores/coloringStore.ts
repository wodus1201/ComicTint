import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  BrushSettings,
  BrushType,
  CanvasState,
  LayerState,
  HistoryState,
  ProjectState,
  Layer,
  Stroke,
  Point,
  ColoringAction,
  ColoringProject,
} from '../models/coloring';

interface ColoringState {
  canvas: CanvasState;
  brush: BrushSettings;
  layers: LayerState;
  history: HistoryState;
  project: ProjectState;
  ui: {
    selectedTool: string;
    showLayerPanel: boolean;
    showColorPalette: boolean;
    showBrushSettings: boolean;
  };
}

interface ColoringActions {
  setCanvasSize: (width: number, height: number) => void;
  setCanvasScale: (scale: number) => void;
  setCanvasOffset: (offset: { x: number; y: number }) => void;
  setDrawingState: (isDrawing: boolean) => void;

  setBrushType: (type: BrushType) => void;
  setBrushSize: (size: number) => void;
  setBrushOpacity: (opacity: number) => void;
  setBrushColor: (color: string) => void;
  setBrushHardness: (hardness: number) => void;

  addLayer: (name?: string) => void;
  deleteLayer: (layerId: string) => void;
  selectLayer: (layerId: string) => void;
  renameLayer: (layerId: string, name: string) => void;
  toggleLayerVisibility: (layerId: string) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;

  startDrawing: (point: Point) => void;
  continueDrawing: (point: Point) => void;
  endDrawing: () => void;

  undo: () => void;
  redo: () => void;
  clearHistory: () => void;

  createProject: (pdfId: string, pageNumber: number) => void;
  loadProject: (projectData: ColoringProject) => void;
  saveProject: () => Promise<void>;
  markDirty: () => void;

  setSelectedTool: (tool: string) => void;
  toggleLayerPanel: () => void;
  toggleColorPalette: () => void;
  toggleBrushSettings: () => void;
}

export const useColoringStore = create<ColoringState & ColoringActions>()(
  immer((set, get) => ({
    canvas: {
      width: 0,
      height: 0,
      scale: 1,
      offset: { x: 0, y: 0 },
      isDrawing: false,
    },

    brush: {
      type: 'pen',
      size: 10,
      opacity: 1,
      color: '#000000',
      hardness: 0.5,
    },

    layers: {
      items: [],
      activeLayerId: '',
      nextLayerId: 1,
    },

    history: {
      past: [],
      present: null,
      future: [],
      maxHistorySize: 50,
    },

    project: {
      id: '',
      pdfId: '',
      pageNumber: 0,
      createdAt: 0,
      lastModified: 0,
      isDirty: false,
    },

    ui: {
      selectedTool: 'pen',
      showLayerPanel: false,
      showColorPalette: false,
      showBrushSettings: false,
    },

    setCanvasSize: (width, height) =>
      set(state => {
        state.canvas.width = width;
        state.canvas.height = height;
      }),

    setCanvasScale: scale =>
      set(state => {
        state.canvas.scale = scale;
      }),

    setCanvasOffset: offset =>
      set(state => {
        state.canvas.offset = offset;
      }),

    setDrawingState: isDrawing =>
      set(state => {
        state.canvas.isDrawing = isDrawing;
      }),

    setBrushType: type =>
      set(state => {
        state.brush.type = type;
      }),

    setBrushSize: size =>
      set(state => {
        state.brush.size = size;
      }),

    setBrushOpacity: opacity =>
      set(state => {
        state.brush.opacity = opacity;
      }),

    setBrushColor: color =>
      set(state => {
        state.brush.color = color;
      }),

    setBrushHardness: hardness =>
      set(state => {
        state.brush.hardness = hardness;
      }),

    addLayer: name =>
      set(state => {
        const newLayer: Layer = {
          id: `layer_${state.layers.nextLayerId}`,
          name: name || `Layer ${state.layers.nextLayerId}`,
          visible: true,
          opacity: 1,
          blendMode: 'normal',
          strokes: [],
          createdAt: Date.now(),
          modifiedAt: Date.now(),
        };

        state.layers.items.push(newLayer);
        state.layers.activeLayerId = newLayer.id;
        state.layers.nextLayerId++;

        const action: ColoringAction = {
          type: 'add_layer',
          timestamp: Date.now(),
          data: { layer: newLayer },
        };

        state.history.past.push(action);
        state.history.present = action;
        state.history.future = [];

        if (state.history.past.length > state.history.maxHistorySize) {
          state.history.past.shift();
        }
      }),

    deleteLayer: layerId =>
      set(state => {
        const layerIndex = state.layers.items.findIndex(layer => layer.id === layerId);
        if (layerIndex === -1) return;

        const deletedLayer = state.layers.items[layerIndex];
        state.layers.items.splice(layerIndex, 1);

        if (state.layers.activeLayerId === layerId) {
          state.layers.activeLayerId =
            state.layers.items.length > 0 ? state.layers.items[0].id : '';
        }

        const action: ColoringAction = {
          type: 'delete_layer',
          timestamp: Date.now(),
          data: { layer: deletedLayer, index: layerIndex },
        };

        state.history.past.push(action);
        state.history.present = action;
        state.history.future = [];
      }),

    selectLayer: layerId =>
      set(state => {
        state.layers.activeLayerId = layerId;
      }),

    renameLayer: (layerId, name) =>
      set(state => {
        const layer = state.layers.items.find(l => l.id === layerId);
        if (layer) {
          layer.name = name;
          layer.modifiedAt = Date.now();
        }
      }),

    toggleLayerVisibility: layerId =>
      set(state => {
        const layer = state.layers.items.find(l => l.id === layerId);
        if (layer) {
          layer.visible = !layer.visible;
          layer.modifiedAt = Date.now();
        }
      }),

    reorderLayers: (fromIndex, toIndex) =>
      set(state => {
        const layers = state.layers.items;
        const [movedLayer] = layers.splice(fromIndex, 1);
        layers.splice(toIndex, 0, movedLayer);
      }),

    startDrawing: point =>
      set(state => {
        state.canvas.isDrawing = true;

        const activeLayer = state.layers.items.find(l => l.id === state.layers.activeLayerId);
        if (activeLayer) {
          const stroke: Stroke = {
            id: `stroke_${Date.now()}`,
            points: [point],
            brush: { ...state.brush },
            createdAt: Date.now(),
          };

          activeLayer.strokes.push(stroke);
        }
      }),

    continueDrawing: point =>
      set(state => {
        if (!state.canvas.isDrawing) return;

        const activeLayer = state.layers.items.find(l => l.id === state.layers.activeLayerId);
        if (activeLayer && activeLayer.strokes.length > 0) {
          const lastStroke = activeLayer.strokes[activeLayer.strokes.length - 1];
          lastStroke.points.push(point);
        }
      }),

    endDrawing: () =>
      set(state => {
        state.canvas.isDrawing = false;

        const action: ColoringAction = {
          type: 'draw_stroke',
          timestamp: Date.now(),
          data: {
            layerId: state.layers.activeLayerId,
            stroke: state.layers.items
              .find(l => l.id === state.layers.activeLayerId)
              ?.strokes.slice(-1)[0],
          },
        };

        state.history.past.push(action);
        state.history.present = action;
        state.history.future = [];
      }),

    undo: () =>
      set(state => {
        if (state.history.past.length === 0) return;

        const lastAction = state.history.past.pop()!;
        state.history.future.unshift(state.history.present!);
        state.history.present = lastAction;
      }),

    redo: () =>
      set(state => {
        if (state.history.future.length === 0) return;

        const nextAction = state.history.future.shift()!;
        state.history.past.push(state.history.present!);
        state.history.present = nextAction;
      }),

    clearHistory: () =>
      set(state => {
        state.history.past = [];
        state.history.present = null;
        state.history.future = [];
      }),

    createProject: (pdfId, pageNumber) =>
      set(state => {
        state.project.id = `project_${Date.now()}`;
        state.project.pdfId = pdfId;
        state.project.pageNumber = pageNumber;
        state.project.createdAt = Date.now();
        state.project.lastModified = Date.now();
        state.project.isDirty = false;

        state.layers.items = [];
        state.layers.nextLayerId = 1;
        state.layers.activeLayerId = '';

        get().addLayer('Background');
      }),

    loadProject: projectData =>
      set(state => {
        state.project = {
          id: projectData.id,
          pdfId: projectData.pdfId,
          pageNumber: projectData.pageNumber,
          createdAt: projectData.createdAt,
          lastModified: projectData.lastModified,
          isDirty: false,
        };
        state.layers = {
          items: projectData.layers,
          activeLayerId: projectData.layers[0]?.id || '',
          nextLayerId: projectData.layers.length + 1,
        };
        if (projectData.history) {
          state.history = {
            ...projectData.history,
            maxHistorySize: projectData.history.maxHistorySize || 50,
          };
        }
      }),

    saveProject: async () => {
      set(state => {
        state.project.isDirty = false;
        state.project.lastModified = Date.now();
      });
    },

    markDirty: () =>
      set(state => {
        state.project.isDirty = true;
      }),

    setSelectedTool: tool =>
      set(state => {
        state.ui.selectedTool = tool;
      }),

    toggleLayerPanel: () =>
      set(state => {
        state.ui.showLayerPanel = !state.ui.showLayerPanel;
      }),

    toggleColorPalette: () =>
      set(state => {
        state.ui.showColorPalette = !state.ui.showColorPalette;
      }),

    toggleBrushSettings: () =>
      set(state => {
        state.ui.showBrushSettings = !state.ui.showBrushSettings;
      }),
  })),
);
