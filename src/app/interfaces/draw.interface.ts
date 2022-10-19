export interface DrawInterface {
  drawBySoftware(): void;

  drawByHardware(): void;

  isInBounds(x: number, y: number): boolean;

  drawVertex(): void;
}
