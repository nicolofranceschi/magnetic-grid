import { StageSize } from "../types"

export const borderBound = ({ x, y, width, height, sizeX , sizeY }: StageSize & { x: number, y: number, sizeX: number , sizeY: number }) => {
    return {
        x: x > 0 ? x < width - sizeX ? x : width - sizeX : 0,
        y: y > 0 ? y < height - sizeY ? y : height - sizeY : 0
    }
}