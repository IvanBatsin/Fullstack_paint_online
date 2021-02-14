import { Socket } from "socket.io-client";
import { Tool } from "./Tool";
import { SocketDrawObj } from '../interface/socket';

export class Brush extends Tool {
  protected mouseDown!: boolean;
  constructor(canvas: HTMLCanvasElement, socket: Socket, session: string){
    super(canvas, socket, session);
    this.listen();
  }
  
  listen(): void{
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  static drawBrush(ctx: CanvasRenderingContext2D, x: number, y: number, color: string | CanvasGradient | CanvasPattern, lineWidth: number): void {
    const currentColor = ctx.strokeStyle;
    const currentLineWidth = ctx.lineWidth;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx?.lineTo(x, y);
    ctx?.stroke();

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentLineWidth;
  }

  mouseUpHandler(): void {
    this.mouseDown = false;
    const msg: SocketDrawObj = {
      method: 'draw',
      session: this.session,
      figure: {
        type: 'finish',
        x: 0,
        y: 0
      }
    };

    this.socket.emit('draw', msg);
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
          type: "brush",
          x: event.pageX - event?.target.offsetLeft,
          y: event.pageY - event?.target.offsetTop,
          strokeColor: this.ctx!.fillStyle,
          lineWidth: this.ctx!.lineWidth
        }
      }
      this.socket.emit('draw', msg);
    }
  }
}