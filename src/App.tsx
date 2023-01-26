import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import logo from './logo.svg';
import './App.css';

interface Album {
  id: number;
  title: string;
}

interface Photo {
  id: number;
  albumId: number;
  title: string;
  thumbnailUrl: string;
  url: string;
  highResolution: boolean;
}

const App: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);

  const fetchAlbums = async () => {
    const response = await axios.get<Album[]>('https://jsonplaceholder.typicode.com/albums');
    setAlbums(response.data);
  }

  const fetchPhotos = async () => {
    const response = await axios.get<Photo[]>('https://jsonplaceholder.typicode.com/photos');
    setPhotos(response.data.map(photo => ({ ...photo, highResolution: false })));
  }

  const changeResolution = (photoId: number) => {
    setPhotos(prevState => prevState.map(photo => {
      if (photo.id === photoId) {
        return {
          ...photo,
          highResolution: !photo.highResolution
        }
      }
      return photo;
    }));
  }

  useEffect(() => {
    fetchAlbums();
    fetchPhotos();
  }, []);

  if (!albums.length || !photos.length) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>Albums</h1>
      {albums.map(album => (
        <div key={album.id}>
          <h2>{album.title}</h2>
          {photos
            .filter(photo => photo.albumId === album.id)
            .map(photo => (
              <LazyLoadImage
                effect="blur"
                key={photo.id}
                src={photo.highResolution ? photo.url : photo.thumbnailUrl}
                alt={photo.title}
                onClick={() => changeResolution(photo.id)}
                placeholderSrc={logo}
              />
            ))}
        </div>
      ))}
    </div>
  );
}

export default App;
