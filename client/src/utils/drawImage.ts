export const darwImage = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number): void => {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);
}