import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

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
    console.log("right arrow key pressed. count: " + this.imageUrls.length.toString());
    if (this.pointer + 1 < this.imageUrls.length) {
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

  constructor() {
    console.log("In app.component constructor");
  }

  title = 'image-viewer';
  imageUrl: string = "";
  pointer = 0;
  private imageUrls = new Array<string>();

  applyForm = new FormGroup({
    urlForm: new FormControl('')
  });

  submitApplication() {
    let targetUrl = <string>this.applyForm.value.urlForm;
    let appendUrl = "http://localhost:8080/";
    let url = appendUrl + targetUrl;
    let domain = new URL(targetUrl).hostname;

    console.log("url: " + url);

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    // xhr.onreadystatechange = () => {
    xhr.onloadend = () => {
      // if (xhr.readyState === 4) {
      let dom = new DOMParser().parseFromString(xhr.responseText, 'text/html');

      if (dom != null) {
        let links = dom.getElementsByTagName("a");
        console.log("anchors: " + links.length);
        let found1 = false;
        for (let i = 0; i < links.length; i++) {
          let anchor = links[i];
          let href = anchor.getAttribute("href");
          if (href?.startsWith("/photo")) {
            // found1 = true;
            console.log("href1: " + href);
            let exp = /photo\/(.*)\//;
            let matches = exp.exec(href);
            if (matches != null) {
              let photoId = matches[1];
              console.log("photoId: " + photoId.toString());
              let level2Url = "https://" + domain + href;
              // console.log("level2: " + level2Url);
              let xhr2 = new XMLHttpRequest();
              xhr2.open('GET', appendUrl + level2Url, true);
              xhr2.onreadystatechange = () => {
                // console.log("readystate: " + xhr2.readyState);
                if (xhr2.readyState === 4) {
                  let dom2 = new DOMParser().parseFromString(xhr2.responseText, 'text/html');
                  if (dom2 != null) {
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
                        // first image
                        this.imageUrls.push(href2);
                        if (this.imageUrls.length === 1) {
                          this.setImage()
                        }
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
          }
          if (found1) {
            break;
          }
        }
      }
      // }
    }

    xhr.send();

  }

  setImage() {
    this.imageUrl = this.imageUrls[this.pointer];
  }
}