
var app = (function()
{
  'use strict';

  console.log("Tile Downloader");

  // -------------------------------------------
  // ** Private **

  let _serverUrl = "http://tile.openstreetmap.org";
  let _downloadType = "latlng";

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
  const tilePreviewElement  = document.getElementById('tilePreview'),
        inputZoomElement    = document.getElementById('inputZoom'),
        inputNorthElement   = document.getElementById('inputNorth'),
        inputWestElement    = document.getElementById('inputWest'),
        inputEastElement    = document.getElementById('inputEast'),
        inputSouthElement   = document.getElementById('inputSouth'),
        inputXStartElement  = document.getElementById('xStart'),
        inputXEndElement    = document.getElementById('xEnd'),
        inputYStartElement  = document.getElementById('yStart'),
        inputYEndElement    = document.getElementById('yEnd');
        
  function _readInput()
  {
    let inputData, isInputValid;
    if (_downloadType === "latlng")
    {
      inputData = _readInputLatLng();
      isInputValid = _validateInputLatLng(inputData);
    }
    else if (_downloadType === "xy")
    {
      inputData = _readInputXY();
      isInputValid = _validateInputXY(inputData);
    }

    return isInputValid ? inputData : null;
  }

  function _readInputLatLng()
  {
    return {
      zoom: parseFloat(inputZoomElement.value),
      boundingBox:
      {
        north: parseFloat(inputNorthElement.value),
        west:  parseFloat(inputWestElement.value),
        east:  parseFloat(inputEastElement.value),
        south: parseFloat(inputSouthElement.value)
      }
    };
  }

  function _readInputXY()
  {
    return {
      zoom: parseFloat(inputZoomElement.value),
      X:
      {        
        start:  parseFloat(inputXStartElement.value),
        end:    parseFloat(inputXEndElement.value)
      },
      Y:
      {        
        start:  parseFloat(inputYStartElement.value),
        end:    parseFloat(inputYEndElement.value)
      }
    };
  }

  function _validateInputLatLng(inputData)
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

  function _validateInputXY(inputData)
  {
    let isInputValid = true;

    let max = Math.pow(2, inputData.zoom) - 1;

    if (MIN_ZOOM <= inputData.zoom && inputData.zoom < MAX_ZOOM &&
        0 <= inputData.X.start && inputData.X.start <= max &&
        0 <= inputData.X.end   && inputData.X.end   <= max &&
        0 <= inputData.Y.start && inputData.Y.start <= max &&
        0 <= inputData.Y.end   && inputData.Y.end   <= max &&
        inputData.X.start <= inputData.X.end && 
        inputData.Y.start <= inputData.Y.end)
    {
      isInputValid = true;
    }
    else
    {
      _writeToLog("Input is illegal:", "red");
      _writeToLog((inputData.zoom < MIN_ZOOM || MAX_ZOOM < inputData.zoom ? `Zoom Level value need to be in the range [${ MIN_ZOOM }-${ MAX_ZOOM }].` : ""), "red");      
      
      _writeToLog((inputData.X.end < inputData.X.start ? "X-End value need to be bigger/equal than X-Start value." : ""), "red");
      _writeToLog((inputData.Y.end < inputData.Y.start ? "Y-End value need to be bigger/equal than Y-Start value." : ""), "red");
      
      _writeToLog((inputData.X.start < 0 || max < inputData.X.start ? `X-Start value need to be in the range [0-${ max }].` : ""), "red");
      _writeToLog((inputData.X.end   < 0 || max < inputData.X.end   ? `X-End value need to be in the range [0-${ max }].`   : ""), "red");
      _writeToLog((inputData.Y.start < 0 || max < inputData.Y.start ? `Y-Start value need to be in the range [0-${ max }].` : ""), "red");
      _writeToLog((inputData.Y.end   < 0 || max < inputData.Y.end   ? `Y-End value need to be in the range [0-${ max }].`   : ""), "red");

      isInputValid = false;
    }

    return isInputValid;
  }

  // -------------------------------------------
  // Utils
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
  function _analyzeTiles(inputData)
  {
    let tilesData;
    if (_downloadType === "latlng")
    {
      tilesData =
      {
        xStart: _lng2tile(inputData.boundingBox.west,  inputData.zoom),
        xEnd  : _lng2tile(inputData.boundingBox.east,  inputData.zoom),
        yStart: _lat2tile(inputData.boundingBox.north, inputData.zoom),
        yEnd  : _lat2tile(inputData.boundingBox.south, inputData.zoom)
      }; 
    }
    else if (_downloadType === "xy")
    {
      tilesData =
      {
        xStart: inputData.X.start,
        xEnd  : inputData.X.end,
        yStart: inputData.Y.start,
        yEnd  : inputData.Y.end
      };
    }    

    let xCount = Math.abs(tilesData.xEnd - tilesData.xStart) + 1,
        yCount = Math.abs(tilesData.yEnd - tilesData.yStart) + 1;

    tilesData.tilesCount = xCount * yCount;

    _writeToLog(`Tiles count: ${ tilesData.tilesCount }. Tiles Range [X: ${ tilesData.xStart }-${ tilesData.xEnd }, Y: ${ tilesData.yStart }-${ tilesData.yEnd }].`);

    return tilesData;
  }

  async function _downloadTiles(inputData)
  {
    const tilesData = _analyzeTiles(inputData);

    if(confirm(`You are about to download ${ tilesData.tilesCount } Tiles, are you sure?`))
    {
      let index = 0;
      let errorCount = 0;
      let startTime = new Date().getTime();

      for (let x = tilesData.xStart; x <= tilesData.xEnd; x++)
      {
        for (let y = tilesData.yStart; y <= tilesData.yEnd; y++)
        {
          let tileUrl = `${ _serverUrl }/${ inputData.zoom }/${ x }/${ y }.png`;
          let fileName = `tile_${ inputData.zoom }_${ x }_${ y }.png`;
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
      tilePreviewElement.src = `${ _serverUrl }/7/63/42.png`      
    },
    setDownloadType: function(type)
    {
      _downloadType = type;

      if (type === 'latlng')
      {
        inputNorthElement.disabled  = false;
        inputEastElement.disabled   = false;
        inputWestElement.disabled   = false;
        inputSouthElement.disabled  = false;

        inputXStartElement.disabled = true;
        inputXEndElement.disabled   = true;
        inputYStartElement.disabled = true;
        inputYEndElement.disabled   = true;
      }
      else if (type === 'xy')
      {
        inputNorthElement.disabled  = true;
        inputEastElement.disabled   = true;
        inputWestElement.disabled   = true;
        inputSouthElement.disabled  = true;

        inputXStartElement.disabled = false;
        inputXEndElement.disabled   = false;
        inputYStartElement.disabled = false;
        inputYEndElement.disabled   = false;
      }
    },
    analyze: function()
    {
      _clearLog();
      _writeToLog("Tiles analysis:");

      let inputData = _readInput();
      if (inputData)
      {
        _analyzeTiles(inputData);
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
      if (inputData)
      {
        _downloadTiles(inputData);
      }
      else
      {
        _writeToLog("Download flow canceled, due to illegal Input!");
      }
    }
  };

})();