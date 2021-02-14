import { Socket } from "socket.io-client/build/socket";
import { SocketDrawObj } from "../interface/socket";
import { darwImage } from "../utils/drawImage";
import { Tool } from "./Tool";

export class Circle extends Tool {
  private mouseDown!: boolean;
  private startX!: number;
  private startY!: number;
  private radius!: number;
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

  static drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill: string | CanvasGradient | CanvasPattern, strokeColor: string | CanvasGradient | CanvasPattern, lineWidth: number): void {
    const currentStrokeColor = ctx!.strokeStyle;
    const currentFillStyle = ctx!.fillStyle;
    const currentLineWidth = ctx!.lineWidth;
    ctx!.beginPath();

    ctx!.fillStyle = fill;
    ctx!.strokeStyle = strokeColor;
    ctx!.lineWidth = lineWidth;
    ctx!?.arc(x, y, radius, 0, 2 * Math.PI);
    ctx!?.fill();
    ctx!?.stroke();

    ctx!.beginPath();
    ctx!.strokeStyle = currentStrokeColor;
    ctx!.fillStyle = currentFillStyle;
    ctx!.lineWidth = currentLineWidth;
  }

  draw(x: number, y: number): void {
    const image = new Image();
    image.src = this.saved;
    image.onload = () => {
      darwImage(this.ctx!, image, this.canvas.width, this.canvas.height);
      this.ctx!.beginPath();
      this.ctx!.arc(x, y, this.radius, 0, 2 * Math.PI);
      this.ctx?.fill();
      this.ctx?.stroke();
    }
  }

  mouseUpHandler(event: any): void {
    this.mouseDown = false;
    const msg: SocketDrawObj = {
      method: 'draw',
      session: this.session,
      figure: {
        type: 'circle',
        x: this.startX,
        y: this.startY,
        radius: this.radius,
        fill: this.ctx?.fillStyle,
        strokeColor: this.ctx?.strokeStyle,
        lineWidth: this.ctx?.lineWidth
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
      const currentX = event.pageX - event?.target.offsetLeft;
      this.radius = Math.abs(currentX - this.startX);
      this.draw(this.startX, this.startY);
    }
  }
}