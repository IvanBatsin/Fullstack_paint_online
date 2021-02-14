import { Action } from "redux";
import { Brush } from "../tools/Brush";
import { Circle } from "../tools/Circle";
import { Eraser } from "../tools/Eraser";
import { Rect } from "../tools/Rect";

export type ToolTypes = Brush | Rect | Circle | Eraser| null;

export enum PaintActionTypes {
  SET_TOOL = 'SET_TOOL',
  SET_CANVAS = 'SET_CANVAS',
  SET_STROKE_COLOR = 'SET_STROKE_COLOR',
  SET_LINE_WIDTH = 'SET_LINE_WIDTH',
  SET_FILL_COLOR = 'SET_FILL_COLOR',
  PUT_UNDO = 'PUT_UNDO',
  PUT_REDO = 'PUT_REDO',
  REDO = 'REDO',
  UNDO = 'UNDO',
  SET_USERNAME = 'SET_USERNAME',
  SET_SESSION = 'SET_SESSION',
  USER_EXIT = 'USER_EXIT'
}

export interface ISetTool extends Action<PaintActionTypes> {
  type: PaintActionTypes.SET_TOOL,
  payload: ToolTypes
}
export interface ISetCanvas extends Action<PaintActionTypes> {
  type: PaintActionTypes.SET_CANVAS,
  payload: HTMLCanvasElement | null
}
export interface ISetStrokeColor extends Action<PaintActionTypes> {
  type: PaintActionTypes.SET_STROKE_COLOR,
  payload: string
}
export interface ISetFillColor extends Action<PaintActionTypes> {
  type: PaintActionTypes.SET_FILL_COLOR,
  payload: string
}
export interface ISetLineWidth extends Action<PaintActionTypes> {
  type: PaintActionTypes.SET_LINE_WIDTH,
  payload: number
}
export interface IPutRedo extends Action<PaintActionTypes> {
  type: PaintActionTypes.PUT_REDO,
  payload: string
}
export interface IPutUndo extends Action<PaintActionTypes> {
  type: PaintActionTypes.PUT_UNDO,
  payload: string
}
export interface IUndo extends Action<PaintActionTypes> {
  type: PaintActionTypes.UNDO,
}
export interface IRedo extends Action<PaintActionTypes> {
  type: PaintActionTypes.REDO
}
export interface ISetUserName extends Action<PaintActionTypes> {
  type: PaintActionTypes.SET_USERNAME,
  payload: string
}
export interface ISetSession extends Action<PaintActionTypes> {
  type: PaintActionTypes.SET_SESSION,
  payload: string
}
export interface IUserExit extends Action<PaintActionTypes> {
  type: PaintActionTypes.USER_EXIT
}


export const setTool = (payload: ToolTypes): ISetTool => ({
  type: PaintActionTypes.SET_TOOL,
  payload
});
export const setCanvas = (payload: HTMLCanvasElement | null): ISetCanvas => ({
  type: PaintActionTypes.SET_CANVAS,
  payload
});
export const setFillColor = (payload: string): ISetFillColor => ({
  type: PaintActionTypes.SET_FILL_COLOR,
  payload
});
export const setStrokeColor = (payload: string): ISetStrokeColor => ({
  type: PaintActionTypes.SET_STROKE_COLOR,
  payload
});
export const setLineWidth = (payload: number): ISetLineWidth => ({
  type: PaintActionTypes.SET_LINE_WIDTH,
  payload
});
export const putRedo = (payload: string): IPutRedo => ({
  type: PaintActionTypes.PUT_REDO,
  payload
});
export const putUndo = (payload: string): IPutUndo => ({
  type: PaintActionTypes.PUT_UNDO,
  payload
});
export const undo = (): IUndo => ({
  type: PaintActionTypes.UNDO
});
export const redo = (): IRedo => ({
  type: PaintActionTypes.REDO
});
export const setUserName = (payload: string): ISetUserName => ({
  type: PaintActionTypes.SET_USERNAME,
  payload
});
export const setSession = (payload: string): ISetSession => ({
  type: PaintActionTypes.SET_SESSION,
  payload
});
export const userExit = (): IUserExit => ({
  type: PaintActionTypes.USER_EXIT
});

 
export type PaintActions = ISetTool | ISetCanvas | ISetFillColor | ISetStrokeColor | ISetLineWidth | IPutRedo | IPutUndo | IUndo | IRedo | ISetUserName | ISetSession | IUserExit;