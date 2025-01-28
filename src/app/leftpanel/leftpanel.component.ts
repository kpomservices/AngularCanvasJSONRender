import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
declare var $: any;

@Component({
  selector: 'app-leftpanel',
  templateUrl: './leftpanel.component.html',
  styleUrls: ['./leftpanel.component.css']
})
export class LeftpanelComponent implements OnInit {

  constructor(public mainComponent : AppComponent) { }

  ngOnInit() {}

  closeLeftNav() {
    $('#leftsidenav').css("width", "0");
  }
  addText() {
    this.mainComponent.addTextToCanvas();
  }

  
}
