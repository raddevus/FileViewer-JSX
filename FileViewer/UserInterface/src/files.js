
import React from 'react';
import ReactDOM from 'react';
import * as ReactDOMClient from 'react-dom/client';

export let initPath = `{"Command":"getInitialPath","Data":null}`;
//let getPathData = `{"Command":"getPathData","Data":${this.fileSystemInfo[x].Name}}`;
let FST = null;

function initFiles(){
  // Registers the receive loop for the program
  window.external.receiveMessage(response => {
      //alert(response);
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
              alert(response.data)
              break;
          }
      }
    });
      
    let currentDir = window.external.sendMessage(initPath);
}

let folderIcon = [{xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", fill:"currentColor", class:"bi bi-folder2", viewBox:"0 0 16 16"},
    {d:"M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"}];
// NOTE: These ICONS (bootstrap icons v1.8.0) - I've altered the d object to contain both paths
// which are included in the svg data -- If I used two path sub-elements it would make rendering the 
// folder icon versus the file icon far more difficult.
let fileIcon = [{xmlns:"http://www.w3.org/2000/svg", width:"16", height:"16", fill:"currentColor", class:"bi bi-file-text", viewBox:"0 0 16 16"},
  {d:"M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"}];

function isDirectory(fsiType){
  if (fsiType == 'd'){
    return true;
  }
  return false;
}

class FSTable extends React.Component{
  constructor(props){
    super(props);
    this.fileSystemInfo = this.props.fsi;
  }

  render(){
    console.log("render...");
    
    return (
      this.FileSystemTable(this.fileSystemInfo)
    );
  }

  FileSystemTable(fileSystemInfo){
    console.log(fileSystemInfo[0]);
     let allItems = [];
  
    for (let x=0; x < fileSystemInfo.length;x++){
        allItems.push(
            <tr
            key={x}
            onClick = {() => {
              // alert(this.fileSystemInfo[x].Name);

              if (this.fileSystemInfo[x].Type == 'd'){
                // Click Event for DIRECTORIES
                let getPathData = {};
                getPathData.Command="getPathData";
                getPathData.Data = this.fileSystemInfo[x].FullName;
                window.external.sendMessage(JSON.stringify(getPathData));
                
              }
              else{
                // Click Event for FILES
                let getFileData = {};
                getFileData.Command = "getFileData";
                getFileData.Data = this.fileSystemInfo[x].FullName;
                window.external.sendMessage(JSON.stringify(getFileData));
              }
            }}
          >
            <td width="150px">
              <svg {...isDirectory(fileSystemInfo[x].Type) ? folderIcon[0]: fileIcon[0]}>
                <path {...isDirectory(fileSystemInfo[x].Type) ? folderIcon[1]: fileIcon[1]} />
              </svg>
            </td>
            <td className="filename">{fileSystemInfo[x].Name}</td>
            <td>{fileSystemInfo[x].Type}</td>
            <td className="filename">{fileSystemInfo[x].FullName}</td>
          </tr>
        );
    }
    return allItems;
  }

}

export function DisplayFileSystemTable(fsi, rootElement){
  if (FST == null){
  FST = ReactDOMClient.createRoot(document.querySelector(rootElement));

    FST
      .render(
        <FSTable fsi={fsi} />
    );

  }
  else{
    FST.render(new FSTable({fsi:fsi}).FileSystemTable(fsi));
  }
}

