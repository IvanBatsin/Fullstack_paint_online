import { Socket } from "socket.io-client/build/socket";
import { SocketDrawObj } from "../interface/socket";
import { Brush } from "./Brush";

export class Eraser extends Brush {
  constructor(canvas: HTMLCanvasElement, socket: Socket, session: string){
    super(canvas, socket, session);
  }

  static drawEraser(ctx: CanvasRenderingContext2D, x: number, y: number, lineWidth: number): void {
    const currentLineWidth = ctx.lineWidth;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = 'white';
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.lineWidth = currentLineWidth;
  }

  mouseDownHandler(event: any): void {
    this.mouseDown = true;
    this.ctx?.beginPath();
    this.ctx?.moveTo(event.pageX - event.target!.offsetLeft, event.pageY - event?.target.offsetTop);
  }

  mouseMoveHandler(event: any): void {
    if (this.mouseDown) {
      const msg: SocketDrawObj = {
        method: 'draw',
        session: this.session,
        figure: {
          type: "eraser",
          x: event.pageX - event?.target.offsetLeft,
          y: event.pageY - event?.target.offsetTop,
          lineWidth: this.ctx!.lineWidth
        }
      }
      this.socket.emit('draw', msg);
    }
  }
}