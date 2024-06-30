import { LazyLoadImage } from 'react-lazy-load-image-component';
import { thumbnails, thumbnailsProps } from '../../data/thumbs';
import React from 'react';
import { computeOriginalIndex } from '../../utils';

interface cardProps {
    type: keyof thumbnailsProps;
    title: string;
    showOverlayImage: (position:number) => void;
    chunkId: string;
    findChunkIndex: (id: string) => number;
    index: number;
}
function Card({type, title, showOverlayImage, findChunkIndex, chunkId, index}:cardProps) {
  const handleCardClick = (position:number) => {
    showOverlayImage(position);
  }
  console.log(findChunkIndex(chunkId))
  return (
    <div className='card' onClick={() => handleCardClick(computeOriginalIndex(3, findChunkIndex(chunkId), index))}>
      <p>{title}</p>
   <LazyLoadImage src={thumbnails[type]} width="100%" height={'100%'} alt={title} placeholder={<div className='loader-container'><div className="loader"></div></div>}/>
    </div>
  )
}

export default Card