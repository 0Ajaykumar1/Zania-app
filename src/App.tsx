import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import data from "./data/mock.json";
import Card from "./components/card/card";
import {
  DragDropContext,
  Draggable,
  Droppable,
} from "@hello-pangea/dnd";
import { thumbnails, thumbnailsProps } from "./data/thumbs";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Chunk, DragAndDropResult, computeOriginalIndex, computeOriginalIndexAfterDrop, mapAndInvoke, splitItems } from "./utils";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [cardsData, setCardsData] = useState(data);
  const [overlayImg, setOverlayImg] = useState<{
    type: string;
    title: string;
    position: number;
    image: string;
  }|undefined>();

  const itemsPerRow = 3;

  useEffect(() => {
    fetch('/cards').then(res => res.json).then((r) => console.log("some",r))
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        setOverlayImg(undefined);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const sortItems = (items: typeof data) => {
    return items
      .slice()
      .sort((first: any, second: any) => first.position - second.position);
  };

  
  const chunks = useMemo(() => splitItems(itemsPerRow, cardsData, uuidv4),[cardsData]);

  const findChunkIndex = useCallback((id: string): number => {
    return chunks.findIndex((chunk: Chunk) => chunk.id === id);
  },[chunks]);

  const onDragEnd = (result: DragAndDropResult) => {
    const {source, destination} = result;
    
    let sourceIndex = source.index;
    let destinationIndex = destination.index;

    if (destination) {
      const { index: indexInSourceChunk, id: sourceChunkId } = source;
      const { index: indexInDestinationChunk, id: destinationChunkId } = destination;
      const sourceChunkIndex: number = findChunkIndex(sourceChunkId);
      const destinationChunkIndex: number = findChunkIndex(destinationChunkId);
      sourceIndex = computeOriginalIndex(itemsPerRow, sourceChunkIndex, indexInSourceChunk);
      destinationIndex = computeOriginalIndexAfterDrop(
        itemsPerRow,
        sourceChunkIndex,
        destinationChunkIndex,
        indexInDestinationChunk
      );
    }

    const items = Array.from(cardsData);

    if (destinationIndex === 0) {
      items[sourceIndex].position = items[0].position - 1;
      const newList = sortItems(items);
      setCardsData(newList);
      return;
    }

    if (destinationIndex === items.length - 1) {
      items[sourceIndex].position = items[items.length - 1].position + 1;
      const newList = sortItems(items);
      setCardsData(newList);
      return;
    }

    if (destinationIndex < sourceIndex) {
      items[sourceIndex].position =
        (items[destinationIndex].position + items[destinationIndex - 1].position) / 2;
        const newList = sortItems(items);
        setCardsData(newList);
      return;
    }

    items[sourceIndex].position =
      (items[destinationIndex].position + items[destinationIndex + 1].position) / 2;
      const newList = sortItems(items);
      setCardsData(newList);

  };

  const showOverlayImage = useCallback((position: number) => {
    setOverlayImg({
      ...cardsData[position],
      image: thumbnails[cardsData[position]["type"] as keyof thumbnailsProps],
    });
  },[cardsData]);


  return (
    <div className="App">
      <div>
      {overlayImg && <div className="backdrop">
        <LazyLoadImage
          src={overlayImg?.image}
          width="100%"
          height={"100%"}
          alt={overlayImg?.title}
          placeholder={
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          }
        />
      </div>}
      <DragDropContext onDragEnd={mapAndInvoke(onDragEnd)}>
      {chunks.map(({ id: droppableId, items }: Chunk) => (
        <Droppable  key={droppableId} droppableId={droppableId} direction="horizontal">
          {(provided) => (
            <div
              className="cards-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {items.map((item, idx) => (
                <Draggable
                  key={item.id}
                  draggableId={item.title}
                  index={idx}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card
                        {...item}
                        type={item.type as keyof thumbnailsProps}
                        showOverlayImage={showOverlayImage}
                        chunkId={droppableId}
                        findChunkIndex={findChunkIndex}
                        index={idx}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        ))}
      </DragDropContext>
      </div>
    </div>
  );
}

export default App;
