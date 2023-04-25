export const formatStars = (stars: number) => {
  if (stars < 1000) {
    return stars.toString();
  }

  const formattedStars = Math.floor(stars / 100) / 10;
  
  return formattedStars.toString() + 'K';

};