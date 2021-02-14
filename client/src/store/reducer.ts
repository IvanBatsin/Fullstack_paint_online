import { darwImage } from "../utils/drawImage"
import { PaintActions, PaintActionTypes, ToolTypes } from "./actions"

export interface PaintState {
  tool: ToolTypes,
  canvas: HTMLCanvasElement | null,
  undoList: string[],
  redoList: string[],
  username: string | undefined,
  session: string | undefined
}

const initilaState: PaintState = {
  tool: null,
  canvas: null,
  redoList: [],
  undoList: [],
  username: undefined,
  session: undefined
}

export const paintReducer = (state = initilaState, action: PaintActions): PaintState => {
  switch(action.type) {
    case PaintActionTypes.SET_USERNAME: {
      return {...state, username: action.payload}
    }

    case PaintActionTypes.USER_EXIT: {
      return {...initilaState}
    }

    case PaintActionTypes.SET_SESSION: {
      return {...state, session: action.payload}
    }

    case PaintActionTypes.SET_CANVAS: {
      return {...state, canvas: action.payload};
    }

    case PaintActionTypes.SET_TOOL: {
      return {...state, tool: action.payload};
    }

    case PaintActionTypes.SET_FILL_COLOR: {
      const tool = state.tool;
      tool!.fillColor = action.payload;
      return {...state, tool}; 
    }

    case PaintActionTypes.SET_LINE_WIDTH: {
      const tool = state.tool;
      tool!.lineWidth = action.payload;
      return {...state, tool};
    }

    case PaintActionTypes.SET_STROKE_COLOR: {
      const tool = state.tool;
      tool!.strokeColor = action.payload;
      return {...state, tool};
    }

    case PaintActionTypes.PUT_REDO: {
      return {...state, redoList: [...state.redoList, action.payload]};
    }

    case PaintActionTypes.PUT_UNDO: {
      return {...state, undoList: [...state.undoList, action.payload]};
    }

    case PaintActionTypes.UNDO: {
      const ctx = state.canvas?.getContext('2d');
      if (state.undoList.length) {
        const dataUrl = state.undoList[state.undoList.length - 1] as string;
        const undoList = state.undoList.slice(0, -1);
        const redoList = [...state.redoList, state.canvas!.toDataURL()];
        const image = new Image();
        image.src = dataUrl as string;
        image.onload = () => {
          darwImage(ctx!, image, state.canvas!.width, state.canvas!.height);
        }
        return {...state, undoList, redoList};
      } 
      
      ctx?.clearRect(0, 0, state.canvas!.width, state.canvas!.height);
      return state;
    }

    case PaintActionTypes.REDO: {
      const ctx = state.canvas?.getContext('2d');
      if (state.redoList.length) {
        const dataUrl = state.redoList[state.redoList.length - 1] as string;
        const undoList = [...state.undoList, state.canvas!.toDataURL()];
        const redoList = state.redoList.slice(0, -1);
        const image = new Image();
        image.src = dataUrl;
        image.onload = () => {
          darwImage(ctx!, image, state.canvas!.width, state.canvas!.height);
        }
        return {...state, redoList, undoList};
      }

      return state;
    }

    default: return state;
  }
}