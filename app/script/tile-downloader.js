
var app = (function()
{
  'use strict';

  console.log("Tile Downloader");

  // -------------------------------------------
  // ** Private **

  let _serverUrl = "http://tile.openstreetmap.org";

  const MIN_ZOOM = 0,
        MAX_ZOOM = 19,
        MIN_LAT = -85.0511,
        MAX_LAT = 85.0511,
        MIN_LNG = -180,
        MAX_LNG = 180;

  // -------------------------------------------
  // Log 
  const _logElement = document.getElementById('appLog');
  function _clearLog()
  {
    _logElement.innerText = "";    
  }
  function _writeToLog(message, color)
  {
    _logElement.innerHTML += `<div ${ color ? `style="color: ${ color };"` : "" }>${ message }</div>`;
    _logElement.scrollTop = _logElement.scrollHeight; // scroll to bottom
  }

  // -------------------------------------------
  // Input
  function _readInput()
  {
    return {
      zoom: parseFloat(document.getElementById("inputZoom").value),
      boundingBox:
      {
        north: parseFloat(document.getElementById("inputNorth").value),
        west:  parseFloat(document.getElementById("inputWest").value),
        east:  parseFloat(document.getElementById("inputEast").value),
        south: parseFloat(document.getElementById("inputSouth").value)
      }
    };
  }

  function _validateInput(inputData)
  {
    let isInputValid = true;

    if (MIN_ZOOM <= inputData.zoom && inputData.zoom < MAX_ZOOM &&
        MIN_LAT <= inputData.boundingBox.north && inputData.boundingBox.north <= MAX_LAT &&
        MIN_LAT <= inputData.boundingBox.south && inputData.boundingBox.south <= MAX_LAT &&
        MIN_LNG <= inputData.boundingBox.west  && inputData.boundingBox.west  <= MAX_LNG &&
        MIN_LNG <= inputData.boundingBox.east  && inputData.boundingBox.east  <= MAX_LNG &&
        inputData.boundingBox.south < inputData.boundingBox.north && 
        inputData.boundingBox.west  < inputData.boundingBox.east)
    {
      isInputValid = true;
    }
    else
    {
      _writeToLog("Input is illegal:", "red");
      _writeToLog((inputData.zoom < MIN_ZOOM || MAX_ZOOM < inputData.zoom ? `Zoom Level value need to be in the range [${ MIN_ZOOM }-${ MAX_ZOOM }].` : ""), "red");
      _writeToLog((inputData.boundingBox.north <= inputData.boundingBox.south ? "North value need to be bigger than South value." : ""), "red");
      _writeToLog((inputData.boundingBox.east  <= inputData.boundingBox.west  ? "East value need to be bigger than West value." : ""), "red");
      _writeToLog((inputData.boundingBox.north < MIN_LAT || MAX_LAT < inputData.boundingBox.north ? `North value need to be in the range [${ MIN_LAT }-${ MAX_LAT }].` : ""), "red");
      _writeToLog((inputData.boundingBox.south < MIN_LAT || MAX_LAT < inputData.boundingBox.south ? `South value need to be in the range [${ MIN_LAT }-${ MAX_LAT }].` : ""), "red");
      _writeToLog((inputData.boundingBox.west  < MIN_LNG || MAX_LNG < inputData.boundingBox.west  ? `West value need to be in the range [${ MIN_LNG }-${ MAX_LNG }].`  : ""), "red");
      _writeToLog((inputData.boundingBox.east  < MIN_LNG || MAX_LNG < inputData.boundingBox.east  ? `East value need to be in the range [${ MIN_LNG }-${ MAX_LNG }].`  : ""), "red");

      isInputValid = false;
    }

    return isInputValid;
  }

  // -------------------------------------------
  function _getTimeString(time)
  {
    let ms = time % 1000;
    time = parseInt(time / 1000);

    let sec = time % 60;
    sec = sec < 10 ? '0' + sec : sec;
    time = parseInt(time / 60);    

    let min = time % 60;
    min = min < 10 ? '0' + min : min;
    time = parseInt(time / 60);

    let hour = time;

    return `${ hour }:${ min }:${ sec }`;
  }

  // -------------------------------------------
  // Download Tiles 
  function _analyzeTiles(zoom, boundingBox)
  {
    let tilesData =
    {
      xStart: _lng2tile(boundingBox.west,  zoom),
      xEnd  : _lng2tile(boundingBox.east,  zoom),
      yStart: _lat2tile(boundingBox.north, zoom),
      yEnd  : _lat2tile(boundingBox.south, zoom)
    };

    let xCount = Math.abs(tilesData.xEnd - tilesData.xStart) + 1,
        yCount = Math.abs(tilesData.yEnd - tilesData.yStart) + 1;

    tilesData.tilesCount = xCount * yCount;

    _writeToLog(`Tiles count: ${ tilesData.tilesCount }. Tiles Range [X: ${ tilesData.xStart }-${ tilesData.xEnd }, Y: ${ tilesData.yStart }-${ tilesData.yEnd }].`);

    return tilesData;
  }

  async function _downloadTiles(zoom, boundingBox)
  {
    const tilesData = _analyzeTiles(zoom, boundingBox);

    if(confirm(`You are about to download ${ tilesData.tilesCount } Tiles, are you sure?`))
    {
      let index = 0;
      let errorCount = 0;
      let startTime = new Date().getTime();

      for (let x = tilesData.xStart; x <= tilesData.xEnd; x++)
      {
        for (let y = tilesData.yStart; y <= tilesData.yEnd; y++)
        {
          let tileUrl = `${ _serverUrl }/${ zoom }/${ x }/${ y }.png`;
          let fileName = `tile_${ zoom }_${ x }_${ y }.png`;
          _writeToLog(`Download tile [${ ++index }/${ tilesData.tilesCount }] - ${ tileUrl }`);

          try
          {
            let result = await _downloadFile(tileUrl, fileName);
            _writeToLog(result, "lime");
          }
          catch(e)
          {
            _writeToLog(e, "red");
            errorCount++;
          }
        }
      }

      let tilesDownloaded =  tilesData.tilesCount - errorCount;
      let downloadSuccessRate = (tilesDownloaded * 100 / tilesData.tilesCount).toFixed(2); 
      let duration = _getTimeString(((new Date().getTime()) - startTime));

      _writeToLog(`Download flow has ended - ${ downloadSuccessRate }% Success rate [${ tilesDownloaded } out of ${ tilesData.tilesCount } tiles downloaded in ${ duration }].`, (downloadSuccessRate == 100) ? "lime" : "yellow");
    } 
    else
    {
      _writeToLog("Download was aborted by the user.");
    }
  }

  // Black Magic - Don't Touch!!! - Read more at https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Zoom_levels
  function _lng2tile(lng, zoom) { return (Math.floor((lng + 180) / 360 * Math.pow(2, zoom))); }
  function _lat2tile(lat, zoom) { return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1/ Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))); }
  
  function _downloadFile(fileUrl, saveFileName)
  {
    console.log(`Downloading file ${ fileUrl }`);

    const promise = new Promise((resolve, reject) =>
    {
      const XHR = new XMLHttpRequest();

      XHR.onreadystatechange = function()
      {
        if (XHR.readyState == 4)
        { 
          if (XHR.status == 200)
          {
            // Save downloaded file to disk
            let aElement = document.createElement('a');
            let objectUrl = window.URL.createObjectURL(XHR.response); // XHR.response is a blob
            aElement.href = objectUrl;
            aElement.download = saveFileName // Set the file name.
            aElement.style.display = 'none';
            document.body.appendChild(aElement);
            aElement.click();
            setTimeout(() =>
            {
              document.body.removeChild(aElement);
              window.URL.revokeObjectURL(objectUrl);
            });

            resolve(`File Downloaded Successfully [${ fileUrl }]`);
          }
          else // ERROR
          {
            reject(`Error Downloading File [${ fileUrl }]`);
          }
        }
      }
  
      XHR.responseType = 'blob';
      XHR.open('GET', fileUrl, true);
      XHR.send();
    });

    return promise;
  }

  // -------------------------------------------
  // ** Public **

  return {  
    selectServer: function(server)
    {
      _serverUrl = server;
      document.getElementById('tileExample').src = `${ _serverUrl }/7/63/42.png`      
    },
    analyze: function()
    {
      _clearLog();
      _writeToLog("Tiles analysis:");

      let inputData = _readInput();
      let isInputValid = _validateInput(inputData);  
      if (isInputValid)
      {
        _analyzeTiles(inputData.zoom, inputData.boundingBox);
      }
      else
      {
        _writeToLog("Tiles Analysis canceled, due to illegal Input!");
      }
    },
    download: function()
    {
      _clearLog();
      _writeToLog("Starting download flow...");

      let inputData = _readInput();
      let isInputValid = _validateInput(inputData);  
      if (isInputValid)
      {
        _downloadTiles(inputData.zoom, inputData.boundingBox);
      }
      else
      {
        _writeToLog("Download flow canceled, due to illegal Input!");
      }
    }
  };

})();