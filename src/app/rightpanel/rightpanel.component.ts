import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
declare var $: any;

@Component({
  selector: 'app-rightpanel',
  templateUrl: './rightpanel.component.html',
  styleUrls: ['./rightpanel.component.css']
})
export class RightpanelComponent implements OnInit {

  constructor(public mainComponent : AppComponent) { }

  ngOnInit() {}

  closeRightNav() {
      $('#rightsidenav').css("width", "0");
  }

  
}
