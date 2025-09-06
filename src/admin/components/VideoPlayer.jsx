import React from 'react';

const VideoPlayer = (props) => {
  const { record } = props;
  const videoUrl = record.params.videoPath;

  if (!videoUrl) return <p>Nenhum vídeo enviado.</p>;

  return (
    <video width="100%" controls>
      <source src={videoUrl} type="video/mp4" />
      Seu navegador não suporta a tag de vídeo.
    </video>
  );
};

export default VideoPlayer;
