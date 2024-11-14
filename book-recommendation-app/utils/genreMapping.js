/*This file identifies which genre the user selects corresponds to which JSON file the data should be pulled from*/
import scifi from '/data/scifi-book-recs.json';
import hist from '/data/hist-book-recs.json';
import mystery from '/data/mystery-book-recs.json';
import fantasy from '/data/fantasy-book-recs.json';

const genreMapping = {
    "Science Fiction": scifi,
    "Historical Fiction": hist,
    "Mystery": mystery,
    "Fantasy": fantasy,
};
  
export default genreMapping;
  