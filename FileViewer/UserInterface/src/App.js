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
    
    return (
        <div className="App">
            <h2>Files</h2>
            <div class="input-group mb-3">
                <input id="clearTextFilePath" type="text" class="form-control" placeholder="Clear-text file" aria-label="clear-text-file" aria-describedby="clearTextFileButton" />
                <button class="btn btn-outline-secondary" type="button" id="clearTextFileButton">Button</button>
            </div>
                <table id="fileSystem" class="table  table-striped table-hover">
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

            <h1 className="text-center">Hello to Photino.React</h1>
        
            <p className="text-center">
                This is a React App served from a local web root. Click on the button below to send a message to the backend. It will respond and send a message back to the UI.
            </p>

            <button className="primary center" onClick={callDotNet}>Call .NET</button>
        </div>
    );
}

export default App;
