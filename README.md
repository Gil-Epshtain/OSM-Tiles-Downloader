# OSM-Tiles-Downloader
Download Open-Street-Map Tiles from the OSM server

### Open Street Map Tiles usage policy
Before using this application please read the [OSM Tile usage policy][lnk1]. 
Downloading large amount of tiles is **forbidden** without prior consultation with a [OSM System Administrator][lnk2].

**Use this application at your own risk. I *Gil Epshtain*, will not be responsible to any damage to your system. And I will not be reliable if you violate the OSM tile policy or any other Tile usage policy!**

![preview](https://raw.githubusercontent.com/Gil-Epshtain/OSM-Tiles-Downloader/master/snapshot.png)

### Run application
You only want to use the application, and you don't care about debugging the application.
Then you should only download the `dist` folder to your machine, and open the `dist/index.html` in your browser.

### Development
You want to be part of the development. You want to debug and understand how things work under the hood, then you will need to follow these steps.

OSM-Tiles-Downloader requires [Node.js](https://nodejs.org/) to run.

 Download and install the dependencies.
```sh
$ npm install
```

Run dev server
```sh
$ npm start
```

Open your web browser and navigate to `http://localhost:4200/`

### License
MIT

**Free Software, Hell Yeah!**

  [lnk1]: <https://wiki.openstreetmap.org/wiki/Tile_usage_policy>
  [lnk2]: <https://wiki.openstreetmap.org/wiki/System_Administrators>
  