// Angular
import { Injectable } from '@angular/core';

@Injectable()
export class FileDownloaderService 
{  
  public constructor()
  {
    console.log("File-Downloader.service - ctor");
  }

  public downloadFile(fileUrl: string, saveFileName: string): Promise<any>
  {
    console.log(`File-Downloader.service - Downloading file ${ fileUrl }`);

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
}