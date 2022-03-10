import React, { useState, useEffect } from "react";
import { Switch } from "react-router-dom";
import { Link } from "react-router-dom";
import { Route } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import { helpHttp } from "../helpers/helpHttp";
import Error404 from "../pages/Error404";
import SongPage from "../pages/SongPage";
import Loader from "./Loader";
import SongDetails from "./SongDetails";
import SongForm from "./SongForm";
import SongTable from "./SongTable";

let mySongsInit = JSON.parse(localStorage.getItem("mySongs")) || [];
//guarda en el local storage, y obten el item mySongs y si no existe, crea el elemento y has un arreglo vacio

const SongSearch = () => {
  const [search, setSearch] = useState(null);
  const [lyric, setLyric] = useState(null);
  const [bio, setBio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mySongs, setMySongs] = useState(mySongsInit);

  useEffect(() => {
    if (search === null) return; // evita renderizados innecesarios

    const fetchData = async () => {
      const { artist, song } = search;
      let artistUrl = `https://theaudiodb.com/api/v1/json/2/search.php?s=${artist}`;
      let songUrl = `https://api.lyrics.ovh/v1/${artist}/${song}`;

      console.log("url");
      console.log(artistUrl, songUrl);

      setLoading(true);

      const [artistRes, songRes] = await Promise.all([
        helpHttp().get(artistUrl),
        helpHttp().get(songUrl),
      ]); // la respuesta de artisUrl se guarda en artistRes y la de songUrl en SongRes

      // console.log("res");
      // console.log(artistRes, songRes);

      setBio(artistRes);
      setLyric(songRes);
      // guardan informacion los sets
      setLoading(false);
    };

    fetchData();
    //Establecemos el valor del local storage, le ponemos el valor del estado mysongs
    localStorage.setItem("mySongs", JSON.stringify(mySongs));
  }, [search, mySongs]);

  const handleSearch = (data) => {
    //console.log(data);
    setSearch(data);
  };

  const handleSaveSong = () => {
    alert("Salvando canción en Favoritos");
    let currentSong = {
      search,
      lyric,
      bio,
    };

    let songs = [...mySongs, currentSong];
    setMySongs(songs);
    setSearch(null);
    localStorage.setItem("mySongs", JSON.stringify(songs));
  };

  const handleDeleteSong = (id) => {
    //alert(`Eliminando Canción con el ID:${id}`);
    let isDelete = window.confirm(
      `¿Estás seguro de eliminar la canción con el id:${id}`
    );
    if (isDelete) {
      let songs = mySongs.filter((el, index) => index !== id);
      setMySongs(songs);
      localStorage.setItem("mySongs", JSON.stringify(songs));
    }
  };

  return (
    <div>
      <HashRouter basename="canciones">
        <header>
          <h2 style={{ textAlign: "center" }}>
            Song Search, utilizando LocalStorage
          </h2>
          <div className="home" style={{ textDecoration: "nome" }}>
            <Link to="/">Home</Link>
          </div>
        </header>
        {loading && <Loader />}
        <article className="grid-1-2">
          <Switch>
            <Route exact path="/">
              <SongForm
                handleSearch={handleSearch}
                handleSaveSong={handleSaveSong}
              />
              <SongTable
                mySongs={mySongs}
                handleDeleteSong={handleDeleteSong}
              />
              {search && !loading && (
                <SongDetails search={search} lyric={lyric} bio={bio} />
              )}
            </Route>
            <Route
              exact
              path="/:id"
              children={<SongPage mySongs={mySongs} />}
            />
            <Route path="*" children={<Error404 />} />
          </Switch>
        </article>
      </HashRouter>
    </div>
  );
};

export default SongSearch;
