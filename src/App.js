import './App.css';
import { useEffect, useRef, useState } from 'react';

const MAX_FILE_SIZE_BYTES = 5000000; // 5 mb
const getBase64 = (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = ev => resolve(ev.target.result.replace(/^data:(.*,)?/, ''));  
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })
}

function App() {
  let [accepted, setAccepted] = useState("");
  let uploadInput = useRef();

  async function getAccepted() {
    let acceptedResponse = await fetch("http://localhost/api/upload/supported");
    let acceptedJson = await acceptedResponse.json();
    setAccepted(acceptedJson.map(fileType => "." + fileType).join(", "));
  }

  async function uploadFile() {
    if (uploadInput.current.files.length === 0) return;

    let file = uploadInput.current.files[0];
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert("File size too large! Maximum is " + (MAX_FILE_SIZE_BYTES/1000000) + " mb.");
      return;
    }

    let fileType = file.type.split("/").pop();
    let fileContent = await getBase64(file);
    let userId = prompt("Enter user UUID.");
    let params = {
      "type": fileType,
      "userId": userId
    };
    let uploadResponse = await fetch("http://localhost/api/upload?" + new URLSearchParams(params), {
      method: "POST",
      body: fileContent
    });
    console.log(uploadResponse);
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
