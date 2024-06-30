import { DropResult } from "@hello-pangea/dnd";

export interface Chunk {
    id: string;
    items: any[];
  }

  export interface DragAndDropResult {
    source: Location;
    destination: Location;
  }
  interface Location {
    id: string;
    index: number;
  }

export function splitItems(maxItems: number, items: any[], createId: () => string): Chunk[] {
    const slicedItems: any[][] = sliceIntoItems(maxItems, items);
    return slicedItems.map(mapToChunk(createId));
  }
  
  function sliceIntoItems(maxItems: number, items: any[]): any[][] {
    const numberOfSlices: number = Math.ceil(items.length / maxItems);
    const sliceIndexes: number[] = Array.apply(null, Array(numberOfSlices)).map((_, index: number) => index);
    return sliceIndexes.map((index: number) => items.slice(index * maxItems, index * maxItems + maxItems));
  }
  
  function mapToChunk(createId: () => string) {
    return function(items: any[]): Chunk {
      return {
        id: createId(),
        items
      };
    };
  }

  export function mapAndInvoke(onDragEnd: (result: DragAndDropResult) => void) {
    return function({ source, destination }: DropResult): void {
      if (destination !== undefined && destination !== null) {
        const result: DragAndDropResult = {
          source: {
            id: source.droppableId,
            index: source.index
          },
          destination: {
            id: destination.droppableId,
            index: destination.index
          }
        };
        onDragEnd(result);
      }
    };
  }

  export function computeOriginalIndex(maxItems: number, chunkIndex: number, indexInChunk: number): number {
    return chunkIndex * maxItems + indexInChunk;
  }
  
  export function computeOriginalIndexAfterDrop(
    maxItems: number,
    sourceChunkIndex: number,
    destinationChunkIndex: number,
    indexInChunk: number
  ): number {
    return destinationChunkIndex * maxItems + indexInChunk + (sourceChunkIndex < destinationChunkIndex ? -1 : 0);
  }
  