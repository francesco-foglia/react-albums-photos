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
  const [error, setError] = useState<string | null>(null);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get<Album[]>('https://jsonplaceholder.typicode.com/albums');
      setAlbums(response.data);
    } catch (err: any) {
      setError(`Error loading albums: ${err.message}`);
    }
  }

  const fetchPhotos = async () => {
    try {
      const response = await axios.get<Photo[]>('https://jsonplaceholder.typicode.com/photos');
      setPhotos(response.data.map(photo => ({ ...photo, highResolution: false })));
    } catch (err: any) {
      setError(`Error loading photos: ${err.message}`);
    }
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

  const changePosition = (photoId: number) => {
    const photos = document.querySelectorAll('.photos-container-element span')[photoId - 1];
    photos.classList.toggle('z_index');
  }

  useEffect(() => {
    fetchAlbums();
    fetchPhotos();
  }, []);

  if (error) {
    return <h2>{error}</h2>;
  }
  if (!albums.length || !photos.length) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <h1>Albums</h1>
      {albums.map(album => (
        <div key={album.id} className="album-container">
          <h2>{album.title}</h2>
          <div className="photos-container">
            {photos
              .filter(photo => photo.albumId === album.id)
              .map(photo => (
                <div key={photo.id} className="photos-container-element">
                  <LazyLoadImage
                    effect="blur"
                    key={photo.id}
                    src={photo.highResolution ? photo.url : photo.thumbnailUrl}
                    alt={photo.title}
                    title={photo.title[0].toUpperCase() + photo.title.slice(1)}
                    onClick={() => {
                      changeResolution(photo.id);
                      changePosition(photo.id);
                    }}
                    placeholderSrc={logo}
                  />
                  <small>
                    {photo.title.length > 15 ? `${photo.title.slice(0, 15)}...` : photo.title.slice(0, 15)}
                  </small>
                </div>
              ))}
          </div>
        </div>
      ))
      }
    </div >
  );
}

export default App;
