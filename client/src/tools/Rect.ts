import { Socket } from "socket.io-client/build/socket";
import { SocketDrawObj } from "../interface/socket";
import { darwImage } from "../utils/drawImage";
import { Tool } from "./Tool";

export class Rect extends Tool {
  private mouseDown!: boolean;
  private startX!: number;
  private startY!: number;
  private width!: number;
  private height!: number;
  private saved!: string;
  constructor(canvas: HTMLCanvasElement, socket: Socket, session: string){
    super(canvas, socket, session);
    this.listen();
  }
  
  listen(): void{
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
  }

  static drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fill: string | CanvasGradient | CanvasPattern, stroke: string | CanvasGradient | CanvasPattern, lineWidth: number): void {
    const currentLineWidth = ctx.lineWidth;
    const currentStrokeStyle = ctx.strokeStyle;
    const currentFillStyle = ctx.fillStyle;

    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx?.beginPath();
    ctx?.rect(x, y, width, height);
    ctx?.fill();
    ctx?.stroke();
    
    ctx.beginPath();

    ctx.fillStyle = currentFillStyle;
    ctx.strokeStyle = currentStrokeStyle;
    ctx.lineWidth = currentLineWidth;
  }

  draw (x: number, y: number, width: number, height: number): void {
    const image = new Image();
    image.src = this.saved;
    image.onload = () => {
      darwImage(this.ctx!, image, this.canvas.width, this.canvas.height);
      this.ctx?.beginPath();
      this.ctx?.rect(x, y, width, height);
      this.ctx!.fill();
      this.ctx?.stroke();
      this.ctx?.beginPath();
    }
  }

  mouseUpHandler(event: any): void {
    this.mouseDown = false;
    const msg: SocketDrawObj = {
      method: 'draw',
      session: this.session,
      figure: {
        type: 'rect',
        x: this.startX,
        y: this.startY,
        width: this.width,
        height: this.height,
        fill: this.ctx!.fillStyle,
        lineWidth: this.ctx!.lineWidth,
        strokeColor: this.ctx!.strokeStyle
      }
    };

    this.socket.emit('draw', msg);
  }

  mouseDownHandler(event: any): void {
    this.mouseDown = true;
    this.ctx?.beginPath();
    this.startX = event.pageX - event?.target.offsetLeft;
    this.startY = event.pageY - event?.target.offsetTop;
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(event: any): void {
    if (this.mouseDown) {
      let currentX = event.pageX - event?.target.offsetLeft;
      let currentY = event.pageY - event?.target.offsetTop;
      this.width = currentX - this.startX;
      this.height = currentY - this.startY;
      this.draw(this.startX, this.startY, this.width, this.height);
    }
  }
}