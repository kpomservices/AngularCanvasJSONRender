import { Component, OnInit } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
//import * as fabric from 'fabric';
import { fabric } from 'fabric';
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
  color: string = "#000";
  font: any = 'Roboto';
  fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40]; // List of font sizes
  selectedFontSize = 16; // Default font size

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
    //console.log(this.selectedFontSize)
    this.setActiveProp('fontSize', this.selectedFontSize);
  }

  changeFontFamily(event: any) {
    this.font = event.family;
    this.setActiveProp('fontFamily', event.family);
  }

  changeTextColor(event: any) {
    //console.log(event);
    this.changeObjectColor('fill', event);
  }

  changeObjectColor(style: any, hex: any) {
    let lthis = this;
    let obj = lthis.canvas.getActiveObject();
    if (obj) {
      if (obj && 'paths' in obj) {
            for (let i = 0; i < (obj.paths as fabric.Object[]).length; i++) {
                this.setActiveStyle(style, hex, obj.paths[i]);
            }
        } else if (obj.type === "group") {
            let objects = (obj as fabric.Group).getObjects();
            for (let i = 0; i < objects.length; i++) {
                this.setActiveStyle(style, hex, objects[i]);
            }
        } else this.setActiveStyle(style, hex, obj);
    } else {
        let grpobjs = lthis.canvas.getActiveObjects();
        if (grpobjs) {
          grpobjs.forEach(function(object) {
            if (object && 'paths' in object) {
                for (let i = 0; i < (object.paths as fabric.Object[]).length; i++) {
                    lthis.setActiveStyle(style, hex, object.paths[i]); // Use 'object.paths[i]'
                }
            } else {
                lthis.setActiveStyle(style, hex, object); // Use 'object' instead of 'obj'
            }
        });
        }
    }
    lthis.canvas.renderAll();
    //lthis.saveState();
  }

  setActiveStyle(styleName: any, value: any, object: any) {
    object = object || this.canvas.getActiveObject();
    if (!object) return;
    if (object.setSelectionStyles && object.isEditing) {
        var style = {};
        style[styleName] = value;
        object.setSelectionStyles(style);
        object.setCoords();
    } else {
        object.set(styleName, value);
    }
    object.setCoords();
    this.canvas.renderAll();
  }

  readJSONData() {
    //console.log(this.data);
    const pKeysCount = Object.keys(this.data).filter((key) => key.startsWith("p")).length;
    this.addnewpage(pKeysCount);
    //console.log(pKeysCount);
  }

  addnewpage(pagecount: any) {
    for (var i = 0; i < pagecount; i++) {
      this.pageindex = i;
      var style = "";
      $("#canvaspages").append("<div class='page' id='page" + this.pageindex + "'></div></br>");
      this.addCanvasToPage(false, i);
      this.addImage(i);
    }
  }

  addImage(pagenumber: any) {
    var pagedata = this.data["p"+(pagenumber+1)];
    var images = pagedata.images;
    for (var i = 0; i < images.length; i++) {
      this.loadImage(images[i]);
      this.loadText(images[i])
    }
  }

  loadText(textData: any) {
    if(textData.type == 'rich_text') {
      for (let i = 0; i < textData.text.length; i++) {
        const textObj = textData.text[i];
        
        for (let j = 0; j < textObj.lines.length; j++) {
          const textValue = textObj.lines[j];
      
          for (let k = 0; k < textValue.textSpans.length; k++) {
            //console.log(textValue.textSpans[k]);
            const text = new fabric.Textbox(textValue.textSpans[k].text, {
              left: 100,
              top: 100,
              fontFamily: textValue.textSpans[k].font,
              fontSize: textValue.textSpans[k].fontSize,
              fill: textValue.textSpans[k].color,
              width: 200, 
              opacity:textValue.textSpans[k].opacity,
              textAlign: 'center'
            });
        
            this.canvas.add(text);
            this.canvas.setActiveObject(text);
            this.canvas.renderAll();
          }
        }
      }
    }
  }

loadImage(imageData: any) {
    //console.log(imageData.type);
    const imageUrl = imageData.sid;
    if(!imageUrl) return;
    var lcanvas = this.canvas;

    fabric.Image.fromURL("https://www.prettyorange.de/imgbase/img/?sid="+imageUrl, (img) => {
      img.set({
        left:  imageData.x,
        top: imageData.y,
        scaleX: imageData.aspect / 3,
        scaleY: imageData.aspect / 3,
        selectable: true // Allow selection and movement
      });
      img.scaleToWidth(imageData.size);
      lcanvas.add(img);
      lcanvas.moveTo(img, imageData.order);
      lcanvas.renderAll();
    }, { crossOrigin: 'anonymous' }); // Ensure cross-origin compatibility
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
          this.canvas.loadFromJSON(currentcanvasjson, () => {
            this.canvas.renderAll(); // Ensure the canvas updates after loading
            //console.log("Canvas loaded successfully!");
          });
          dupcount++;
        }
        $("#page" + this.pageindex).append("</tr></table>");
      }
    }
  }

  initCanvasEvents() {
    var self = this;
    $('.canvas-container').unbind('click').on('click', function (e) {
      e.stopPropagation();
    });

    $(".divcanvas").mousedown(function (e) {
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
    $("#page" + this.pageindex).append("<td style='background: white;border:1px solid #000000;' align='center' data-id='" + this.canvasindex + "' id='divcanvas" + this.canvasindex + "' (click)='selectCanvas(this.canvasindex);' (contextmenu)='selectCanvas(this.canvasindex);' (mousedown)='selectCanvas(this.canvasindex);' class='divcanvas'><div class='canvascontent' style='box-shadow:3px 3px 3px;'><canvas id='canvas" + this.canvasindex + "' class='canvas'></canvas></div></td>");
    this.canvas = new fabric.Canvas('canvas' + this.canvasindex), {
      selection: false,
      preserveObjectStacking: true
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
    this.canvas.setActiveObject(text);
    this.canvas.renderAll();
  }
}
