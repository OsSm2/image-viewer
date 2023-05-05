import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent {
  title = 'image-viewer';
  applyForm = new FormGroup({
    url: new FormControl('')
  });

  constructor() {

    console.log("In app.component constructor");

  }

  submitApplication() {
    let targetUrl = <string>this.applyForm.value.url;
    let url = "http://localhost:8080/" + targetUrl;
    let domain = new URL(targetUrl).hostname;
    
    console.log("url: " + url);

    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        let dom = new DOMParser().parseFromString(xhr.responseText, 'text/html')
        if (dom != null) {
          let links = dom.getElementsByTagName("a");
          for (let i = 0; i < links.length; i++) {
            let anchor = links[i];
            let href = anchor.getAttribute("href");
            if (href?.startsWith("/photo")) {
              console.log(domain + href);

            }

          }
        }
      }
    }

    xhr.send()
  }

}
