export const borderBound = ({ x, y, maxX, maxY, sizeX , sizeY }: { x: number, y: number, maxX: number, maxY: number, sizeX: number , sizeY: number }) => {
    return {
        x: x > 0 ? x < maxX - sizeX ? x : maxX - sizeX : 0,
        y: y > 0 ? y < maxY - sizeY ? y : maxY - sizeY : 0
    }
}