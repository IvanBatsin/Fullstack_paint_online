import { Socket } from "socket.io-client";

export class Tool {
  public canvas;
  public ctx;
  public socket;
  public session;
  constructor(canvas: HTMLCanvasElement, socket: Socket, session: string) {
    this.socket = socket;
    this.session = session;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.destroyEvents();
  }

  public set fillColor(color: string) {
    this.ctx!.fillStyle = color;
  }
  public set strokeColor(color: string) {
    this.ctx!.strokeStyle = color;
  }
  public set lineWidth(width: number) {
    this.ctx!.lineWidth = width;
  }

  destroyEvents(): void {
    this.canvas.onmouseup = null;
    this.canvas.onmousedown = null;
    this.canvas.onmousemove = null;
  }
}