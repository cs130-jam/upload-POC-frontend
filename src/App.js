import './App.css';
import { useEffect, useRef, useState } from 'react';

const MAX_FILE_SIZE_BYTES = 5000000; // 5 mb

function App() {
  let [accepted, setAccepted] = useState("");
  let uploadInput = useRef();

  async function getAccepted() {
    let acceptedResponse = await fetch("http://localhost/api/upload/supported");
    let acceptedJson = await acceptedResponse.json();
    setAccepted(acceptedJson.join(", "));
  }

  async function uploadFile() {
    if (uploadInput.current.files.length === 0) return;

    let file = uploadInput.current.files[0];
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert("File size too large! Maximum is " + (MAX_FILE_SIZE_BYTES/1000000) + " mb.");
      return;
    }

    let formData = new FormData();
    formData.append("image", uploadInput.current.files[0]);
    let userId = prompt("Enter user UUID.");
    let uploadResponse = await fetch("http://localhost:8080/api/upload?" + new URLSearchParams({"userId": userId}), {
      method: "POST",
      body: formData
    });
    if (!uploadResponse.ok) {
      alert("Failed to upload!");
    }
  }

  useEffect(() => getAccepted(), []);

  return (
    <div className="App">
      {accepted.length === 0 
      ? <p>Loading...</p>
      : <input 
          type="file" 
          accept={accepted}
          ref={uploadInput}
          />}
        <button onClick={uploadFile}>Upload</button>
    </div>
  );
}

export default App;
