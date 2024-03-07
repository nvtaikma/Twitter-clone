import reactLogo from "../assets/react.svg";
import "vidstack/styles/defaults.css";
import "vidstack/styles/community-skin/video.css";
import { useNavigate } from "react-router-dom";
import {
  MediaCommunitySkin,
  MediaOutlet,
  MediaPlayer,
  MediaPoster,
} from "@vidstack/react";
import axios from "axios";
import viteLogo from "/vite.svg";
import { useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("access_token");
  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate("/Login");
    // }

    const getUser = async () => {
      await axios
        .get("http://localhost:4000/users/me", {
          headers: {
            Authorization: `Bearer ${isAuthenticated}`,
          },
        })
        .then((res) => {
          localStorage.setItem("Users", JSON.stringify(res.data.result));
        });
    };

    getUser();
  }, [isAuthenticated, navigate]);
  return (
    <div>
      <div>
        <span>
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </span>
        <span>
          <img src={reactLogo} className="logo react" alt="React logo" />
        </span>
      </div>
      <h1>Google OAuth 2.0</h1>
      <div className="card">
        <>
          <span>Hello my friend is, you are logged in</span>
        </>
      </div>
      <h2>Video Stream</h2>
      <video controls width={300}>
        <source
          src="https://twiiter-2024.s3.ap-southeast-1.amazonaws.com/videos/30b0b8392d23d143ff7739500.mp4"
          type="video/mp4"
        />
      </video>
      <video controls width={300}>
        <source
          src="http://174.138.16.213:4000/static/video-stream/30b0b8392d23d143ff7739500.mp4"
          type="video/mp4"
        />
      </video>
      <h2>Video HLS</h2>
      <MediaPlayer
        title="Sprite Fight"
        src="http://localhost:4000/static/video-hls/Pdsu90xmdqFb3g76NABWr/master.m3u8"
        // poster='https://image.mux.com/VZtzUzGRv02OhRnZCxcNg49OilvolTqdnFLEqBsTwaxU/thumbnail.webp?time=268&width=980'
        // thumbnails='https://media-files.vidstack.io/sprite-fight/thumbnails.vtt'
        aspectRatio={16 / 9}
        crossorigin=""
      >
        <MediaOutlet>
          <MediaPoster alt="Girl walks into sprite gnomes around her friend on a campfire in danger!" />
          {/* <track
            src='https://media-files.vidstack.io/sprite-fight/subs/english.vtt'
            label='English'
            srcLang='en-US'
            kind='subtitles'
            default
          /> */}
          {/* <track
            src='https://media-files.vidstack.io/sprite-fight/chapters.vtt'
            srcLang='en-US'
            kind='chapters'
            default
          /> */}
        </MediaOutlet>
        <MediaCommunitySkin />
      </MediaPlayer>
    </div>
  );
};

export default HomePage;
