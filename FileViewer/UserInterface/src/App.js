import photinoLogo from './photino-logo.svg';
import './App.css';
import {DisplayFileSystemTable, initPath} from "./files";

function App() {
    // Make sure that sendMessage and receiveMessage exist
    // when the frontend is started without the Photino context.
    // I.e. using React's `npm run start` command and hot reload.
    if (typeof(window.external.sendMessage) !== 'function') {
        window.external.sendMessage = (message) => console.log("Emulating sendMessage.\nMessage sent: " + message);
    }

    if (typeof(window.external.receiveMessage) !== 'function') {
        window.external.receiveMessage = (delegate) => {
            let message = 'Simulating message from backend.';
            delegate(message);
        };

        window.external.receiveMessage((message) => console.log("Emulating receiveMessage.\nMessage received: " + message));
    } else {
        // Registers the receive loop for the program
        window.external.receiveMessage(response => {
            response = JSON.parse(response);
            
            //alert(response.command);
            switch (response.command){
                case "getInitialPath":{
                    document.querySelector("#clearTextFilePath").value = response.data;
                    //alert(`${response.fsi[0].Name} | ${response.fsi[0].Type} | ${response.fsi[0].FullName}`);
                    DisplayFileSystemTable(response.fsi, "#fileSystemItems");
                    break;
                }
                case "getPathData":{
                    //alert(`response.data : ${response.data}`);
                    if (response.fsi.length == 0){
                    alert("Can't get path.");
                    return;
                    }
                    document.querySelector("#clearTextFilePath").value = response.data;
                    //alert(`${response.fsi[0].Name} | ${response.fsi[0].Type} | ${response.fsi[0].FullName}`);
                    DisplayFileSystemTable(response.fsi, "#fileSystemItems");
                    break;
                } 
                default:{
                    alert(response.data);
                    break;
                }
            }
        });
        let currentDir = window.external.sendMessage(initPath);
    }

    function callDotNet() {
        // Command & Data have to begin with uppercase letter 
        // to get serialized properly on the receiving side.
        window.external.sendMessage(`{"Command":"testMsg","Data":"Hi .NET! 🤖"}`);
        //window.external.sendMessage('Hi .NET! 🤖');

    }

    function goToDirectory(){
        // Click Event for DIRECTORIES
        let getPathData = {};
        getPathData.Command="getPathData";
        getPathData.Data = document.querySelector("#clearTextFilePath").value;
        window.external.sendMessage(JSON.stringify(getPathData));
    }
    
    return (
        <div className="App">

<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Select File
</button>


<div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Files</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="input-group mb-3">
            <input id="clearTextFilePath" type="text" class="form-control" placeholder="Clear-text file" aria-label="clear-text-file" aria-describedby="clearTextFileButton" />
            <button onClick={goToDirectory} class="btn btn-outline-secondary" type="button" id="clearTextFileButton">Go</button>
        </div>
        <div class="table-responsive-sm">
            <table id="fileSystem" class="table table-sm  table-striped table-hover">
            <thead class="table-success">
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>FullName</th>
                </tr>
            </thead>
            <tbody id="fileSystemItems">
            </tbody>
            </table>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
            
            <button className="primary center" onClick={callDotNet}>Call .NET</button>
        </div>
    );
}

export default App;
