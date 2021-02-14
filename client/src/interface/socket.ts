export type ToolsType = 'brush' | 'circle' | 'eraser' | 'rect' | 'finish';
export type SocketMethods = 'connection' | 'draw' | 'exit';
export enum SocketActions {
  JOIN = 'join',
  JOINED = 'joined',
  DRAW = 'draw',
  DO = 'do',
  CLEAR = 'clear',
  EXIT = 'exit',
  IMAGE_UPLOAD = 'image_upload'
}

export interface User {
  username: string,
  session: string,
}

export interface SocketDrawObj {
  method: SocketMethods,
  session: string,
  figure: {
    type: ToolsType,
    x: number,
    y: number,
    fill?: string | CanvasGradient | CanvasPattern,
    strokeColor?: string | CanvasGradient | CanvasPattern,
    lineWidth?: number,
    radius?: number,
    height?: number,
    width?: number
  }
}