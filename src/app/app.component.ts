import { Component, OnInit  } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import * as fabric from 'fabric';
import * as jsonData from '../assets/design-sample-1.json';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  canvas!: fabric.Canvas;
  data: any = jsonData;
  private canvasScale: number = 1;
  private canvwidth: any;
  private canvheigh: any;
  pageindex: number = -1;
  canvasarray = [];
  canvasindex: number = 0;
  currentcanvasid: number = 0;
  canvassize: any = {
    width: 1000,
    height: 1000 
  };
  color : string = "#000";
  font: any = 'Roboto';
  fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40]; // List of font sizes
  selectedFontSize = 16; // Default font size

  objProps = new Map < string,
    any > ();
    objPropKeys: Array < string > = ['canvasFill', 'canvasImage', 'id', 'hue', 'contrast', 'sharpen', 'blurimg', 'brightness', 'saturation', 'opacity', 'fill', 'fontSize', 'lineHeight', 'charSpacing', 'setrotate', 'fontWeight', 'fontStyle', 'textAlign', 'fontFamily', 'strokeWidth', 'TextDecoration', 'strokeDash', 'strokeGap', 'zoomPercent', 'textoffsetX', 'textBrightness', 'catg', 'catgname'];

  ngOnInit() {
     this.readJSONData();
  }

  openLeftNav() {
    $('#leftsidenav').css("width", "100px");
}

  openRightNav() {
      $('#rightsidenav').css("width", "100px");
  }

  changeFontSize(size: number) {
    this.selectedFontSize = size;
    console.log(this.selectedFontSize)
    this.setActiveProp('fontSize', this.selectedFontSize);
  }



  changeFontFamily(event: any) {
    this.font = event.family;
    this.setActiveProp('fontFamily', event.family);
  }

  changeTextColor(event: any) {
    this.color = event;
    this.setActiveProp('fill', event);
  }

  readJSONData() {
     console.log(this.data);
     const pKeysCount = Object.keys(this.data).filter((key) => key.startsWith("p")).length;
     this.addnewpage(pKeysCount);
     console.log(pKeysCount);
  }

  addnewpage(page: any) {
      for (var i = 0; i < page; i++) {
        this.pageindex = i;
        var style = "";
        $("#canvaspages").append("<div class='page' id='page" + this.pageindex + "'></div></br>");
        this.addCanvasToPage(false, i);
      }
  }

addCanvasToPage(dupflag, pageid) {
    let rows = 1,
        cols = 1;
    $('.deletecanvas').css('display', 'block');
    var rc = rows * cols * parseInt(pageid);
    var dupcount = 0;
    var jsonarrcount = 1;
    for (var i = 1; i <= rows; i++) {
        $("#page" + this.pageindex).append("<table><tr>");
        for (var j = 1; j <= cols; j++) {
            this.addNewCanvas();
            if (dupflag) {
                var currentcanvasjson = this.canvasarray[rc + dupcount].toDatalessJSON();
                this.canvas.loadFromJSON(currentcanvasjson);
                this.canvas.renderAll();
                dupcount++;
            }
            $("#page" + this.pageindex).append("</tr></table>");
        }
    }
    this.initEvents();
}

initEvents() {
  var self = this;
  $(".divcanvas").unbind('click').on('click', function(e) {
    e.preventDefault();
    self.selectCanvas('divcanvas' + $(this).data('id'));
});

}
initCanvasEvents() {
  var self = this;
  $('.canvas-container').unbind('click').on('click', function(e) {
      e.stopPropagation();
  });

  $(".divcanvas").mousedown(function(e) {
      e.stopImmediatePropagation();
      self.selectCanvas('divcanvas' + $(this).data('id'));
  });
}

setActiveProp(name, value) {
  var object = this.canvas.getActiveObject();
  if (!object) return;
  object.set(name, value).setCoords();
  this.canvas.renderAll();
}

selectCanvas(id: string) {
  
  id = id.replace("divcanvas", "");
  if (id) {
      var elem = document.getElementsByClassName('canvas-container')[id];
  }
  if (this.currentcanvasid == parseInt(id)) return;

  //this.savestateaction = true;

  for (var i = 0, j = 0; i < this.canvasindex; i++) {
      $("#canvas" + i).css("box-shadow", "");
  }
  $("#canvas" + id).css("box-shadow", "3px 3px 3px #888888");
  if (this.currentcanvasid == parseInt(id)) return;

  this.currentcanvasid = parseInt(id);
  var tempcanvas = this.canvasarray[parseInt(id)];
  if (tempcanvas) this.canvas = tempcanvas;

  var obj = this.canvas.getActiveObject();
  if (obj)
      this.canvas.setActiveObject(obj);

  this.canvas.renderAll();
}

addNewCanvas() {
  console.log(this.canvasindex)
    $("#page" + this.pageindex).append("<td style='background: white;border:1px solid #000000;' align='center' data-id='" + this.canvasindex + "' id='divcanvas" + this.canvasindex + "' (click)='selectCanvas(this.canvasindex);' (contextmenu)='selectCanvas(this.canvasindex);' (mousedown)='selectCanvas(this.canvasindex);' class='divcanvas'><div class='canvascontent' style='box-shadow:3px 3px 3px;'><canvas id='canvas" + this.canvasindex + "' class='canvas'></canvas></div></td>");
    this.canvas = new fabric.Canvas('canvas' + this.canvasindex), {
        selection: false
    };
    this.canvas.selectionBorderColor = 'rgba(0,153,255,0.1)';
    this.canvas.hoverCursor = 'pointer';
    this.canvasarray.push(this.canvas);

    let width = this.canvassize.width;
    let height = this.canvassize.height;

    $('#canWidth').text(Math.round(width));
    $('#canHeight').text(Math.round(height));

    $('#cantype').text("pixels");

    this.canvasindex++;
    this.setCanvasWidthHeight(width * this.canvasScale, height * this.canvasScale);
    this.initCanvasEvents();
    this.currentcanvasid = this.canvasindex;
    this.canvas.calcOffset();
    this.canvas.renderAll();
}

setCanvasWidthHeight(width, height) {
  if (width && height) {
      for (var i = 0; i <= this.canvasindex; i++) {
          if (!this.canvasarray[i]) continue;
          this.canvasarray[i].setDimensions({
              width: width,
              height: height
          });
          this.canvasarray[i].calcOffset();
          this.canvasarray[i].renderAll();
      }
  }
  $("#canvaswidth").val(Math.round(this.canvas.getWidth()));
  $("#canvasheight").val(Math.round(this.canvas.getHeight()));
}

  addTextToCanvas() {
    const text = new fabric.Textbox('Hello, Fabric.js!', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 30,
      fill: 'blue',
      width: 200, // Optional: sets width for wrapping text
      textAlign: 'center'  // Optional: text alignment
    });

    this.canvas.add(text);
  }

  // addImage(imageData: any) {
  //   //const imageUrl = "https://www.prettyorange.de/imgbase/img/?sid="+imageData;
  //       fabric.Image.fromURL('https://example.com/image.png', (img) => {
  //     img.scale(0.5); // Scale the image
  //     this.canvas.add(img);
  //   }, { crossOrigin: 'anonymous' }); // Pass options as the third argument
  //     }

  // loadImage(imageData: any) {
  //   const imageUrl = imageData;
  //   console.log("https://www.prettyorange.de/imgbase/img/?sid="+imageUrl);

  //   // Add image to canvas using Fabric.js
  //   fabric.Image.fromURL("https://www.prettyorange.de/imgbase/img/?sid="+imageUrl, (img) => {
  //     img.set({
  //       left: imageData.left,
  //       top: imageData.top,
  //       width: imageData.width,
  //       height: imageData.height,
  //       scaleX: 1,
  //       scaleY: 1
  //     });
  //     this.canvas.add(img);
  //   });
  // }
}
// export class AppComponent {
//   title = 'fabricjs-editor';
// }
