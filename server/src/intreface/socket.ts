export type SocketMethods = 'connection' | 'draw' | 'exit';
export type ToolsType = 'brush' | 'circle' | 'eraser' | 'rect' | 'finish';
export enum SocketActions {
  JOIN = 'join',
  JOINED = 'joined',
  DRAW = 'draw',
  DO = 'do',
  CLEAR = 'clear',
  EXIT = 'exit',
  IMAGE_UPLOAD = 'image_upload'
}

export interface UserRoomsMap {
  [socket_id: string]: string
}

export interface SocketRoom {
  [roomName: string]: UserSocketInfo[]
}

export interface UserSocketInfo {
  username: string,
  socketId: string
}

export interface User {
  username: string,
  session: string
}

export interface SocketDrawObj {
  method: SocketMethods,
  session: string,
  figure: {
    type: ToolsType,
    x: number,
    y: number,
    color?: string | CanvasGradient | CanvasPattern,
    lineWidth?: number,
    radius?: number,
    height?: number,
    width?: number
  }
}