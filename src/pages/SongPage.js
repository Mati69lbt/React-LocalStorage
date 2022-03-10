import { useParams } from "react-router";
import SongDetails from "../components/SongDetails";

const SongPage = ({ mySongs }) => {
  let { id } = useParams();
  // console.log(id, mySongs, mySongs[id]);
  let currentSong = mySongs[id];
  let { search, lyric, bio } = currentSong;
  return (
    <div>
      <h3>Pagina de canciones</h3>
      <SongDetails search={search} lyric={lyric} bio={bio} />;
    </div>
  );
};

export default SongPage;
