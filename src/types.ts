export interface Vector2D {
    x: number;
    y: number;
};

export interface ImageData {
    image: File | Blob | Uint8Array;
    quadPoints: Vector2D[];
};

export interface DrawArgs {
    crossLength: number;
    crossThickness: number;
    lineThickness: number;
    color: string;
    topleftColor: string;
};