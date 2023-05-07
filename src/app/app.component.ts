import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) { }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @HostListener('window:keydown.enter', ['$event'])
  enterHandler(event: any) {
    console.log("key pressed");
  }

  @HostListener('window:keydown.arrowright', ['$event'])
  rightHandler(event: any) {
    console.log("right arrow key pressed. count: " + this.photoPages.length.toString());
    if (this.pointer + 1 < this.photoPages.length) {
      this.pointer++;
      this.setImage();
    }
  }

  @HostListener('window:keydown.arrowleft', ['$event'])
  leftHandler(event: any) {
    console.log("left key pressed");
    if (this.pointer > 0) {
      this.pointer--;
      this.setImage();
    }
  }

  constructor(http: HttpClient) {
    console.log("In app.component constructor");
    this.httpClient = http;
    this.processFile();
  }

  title = 'image-viewer';
  imageUrl: string = "";
  pointer = 20;
  log = "";
  private photoPages = new Array<HTMLElement>();
  // private imageUrls = new Array<string>();
  private httpClient: HttpClient;

  applyForm = new FormGroup({
    urlForm: new FormControl('')
  });

  processFile() {

    this.httpClient.get('assets/source.txt', { responseType: 'text' })
      .subscribe((data) => {
        // console.log(data);
        let dom = new DOMParser().parseFromString(data, 'text/html');

        if (dom != null) {
          let links = dom.getElementsByTagName("a");
          console.log("anchors: " + links.length);

          for (let i = 0; i < links.length; i++) {
            let anchor = <HTMLAnchorElement>links[i];
            let href = anchor.getAttribute("href");
            if (href?.startsWith("/photo")) {
              // console.log("href1: " + href);
              let exp = /photo\/(.*)\//;
              let matches = exp.exec(href);
              if (matches != null) {
                let photoId = matches[1];
                // console.log("photoId: " + photoId.toString());
                if (anchor != null && !this.hasAlready(anchor)) {
                  this.photoPages.push(anchor);

                }

              }
            }
          }
          console.log("photo pages: " + this.photoPages.length);
          this.setImage();
        }
      });

  }




  setImage() {
    let appendUrl = "http://localhost:8080/";
    let domain = "www.imagefap.com";
    let href = this.photoPages[this.pointer].getAttribute("href");
    let photoId = this.photoPages[this.pointer].getAttribute("name");

    let url = "https://" + domain + href;
    console.log("level2: " + url);
    let xhr2 = new XMLHttpRequest();
    xhr2.open('GET', appendUrl + url, true);
    xhr2.onreadystatechange = () => {
      // console.log("readystate: " + xhr2.readyState);
      if (xhr2.readyState === 4) {
        let dom2 = new DOMParser().parseFromString(xhr2.responseText, 'text/html');
        if (dom2 != null && photoId != null) {
          let links2 = dom2.getElementsByTagName("a");
          let found2 = false;
          for (let i2 = 0; i2 < links2.length; i2++) {
            let anchor2 = links2[i2];
            let href2 = anchor2.getAttribute("href");
            if (href2?.includes("full") &&
              href2?.includes(photoId)) {
              console.log("href2: " + href2);
              found2 = true;
              console.log("anchor2: " + href2);
              this.imageUrl = href2;
              
            }
            if (found2) {

              break;
            }
          }
        }
      }
    }
    xhr2.send();

  }

  hasAlready(elNeedle: HTMLAnchorElement): boolean {
    let name = elNeedle.getAttribute("name");
    for (let elHaystack of this.photoPages) {
      if (elHaystack.getAttribute("name") === name) {
        return true;
      }
    }

    return false;
  }
}