export type Direction = "NW" | "N" | "NE" | "W" | "E" | "SW" | "S" | "SE"

export const getDirectionFromString = (dir: string): Direction => {
    switch (dir) {
        case "NW":  return "NW";
        case "N":   return "N";
        case "NE":  return "NE";
        case "W":   return "W";
        case "E":   return "E";
        case "SW":  return 'SW';
        case "S":   return "S";
        case "SE":  return "SE";
    }
}

export const getDirectionVector = (dir: Direction): [number, number] => {
    switch (dir) {
        case "NW":  return [-1, -1];
        case "N":   return [ 0, -1];
        case "NE":  return [ 1, -1];
        case "W":   return [-1,  0];
        case "E":   return [ 1,  0];
        case "SW":  return [-1, 1];
        case "S":   return [ 0, 1];
        case "SE":  return [ 1, 1];
        default:    return [ 0, 0];
    }
}
