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
  // DPI = 300;
  // DPIMultiplier = 1;
  // A6
  canvassize: any = {
    width: 1000,
    height: 1000
  };
  color: string = "red";
  font: any = 'Roboto';
  //font: { family: string } = { family: 'Roboto' };

  fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40]; // List of font sizes
  selectedFontSize = 16; // Default font size

  objProps = new Map<string,
    any>();
  objPropKeys: Array<string> = ['canvasFill', 'canvasImage', 'id', 'hue', 'contrast', 'sharpen', 'blurimg', 'brightness', 'saturation', 'opacity', 'fill', 'fontSize', 'lineHeight', 'charSpacing', 'setrotate', 'fontWeight', 'fontStyle', 'textAlign', 'fontFamily', 'strokeWidth', 'TextDecoration', 'strokeDash', 'strokeGap', 'zoomPercent', 'textoffsetX', 'textBrightness', 'catg', 'catgname'];

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

  selectFontFamily(event: any) {
    this.font = event.family;
    this.setActiveProp('fontFamily', event.family);
  }

  changeFontFamily() {
    // this.selectedFontSize = size;
    //console.log(this.selectedFontSize)
    // this.setActiveProp('fontSize', this.selectedFontSize);
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
            console.log(textValue.textSpans[k].text);
            const text = new fabric.Textbox(textValue.textSpans[k].text, {
              left: 100,
              top: 100,
              fontFamily: textValue.textSpans[k].font,
              fontSize: textValue.textSpans[k].fontSize,
              fill: textValue.textSpans[k].color,
              width: 200, 
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
  
  // addImage(imageData: any) {
  //   //const imageUrl = "https://www.prettyorange.de/imgbase/img/?sid="+imageData;
  //       fabric.Image.fromURL('https://example.com/image.png', (img) => {
  //     img.scale(0.5); // Scale the image
  //     this.canvas.add(img);
  //   }, { crossOrigin: 'anonymous' }); // Pass options as the third argument
  //     }

  loadImage(imageData: any) {
    //console.log(imageData.type);
    const imageUrl = imageData.sid;
    if(!imageUrl) return;
    var lcanvas = this.canvas;


  /*  console.log("https://www.prettyorange.de/imgbase/img/?sid="+imageUrl);
    
  //   fabric.Image.fromURL('http://fabricjs.com/assets/pug_small.jpg', (myImg: any) => {
  //     //i create an extra var for to change some image properties
  //     var img1 = myImg.set({ left: 0, top: 0 ,width:150,height:150});
  //     this.canvas.add(img1); 
  //    }, {
  //     crossOrigin: 'anonymous',
  //  });

    const img = new Image()

    img.onload = () => { 
        const imgObj = new fabric.Image(img, {
            centeredRotation: true,
            centeredScaling: true,
            scaleX: imageData.aspect / 3,
            scaleY: imageData.aspect / 3,
            perPixelTargetFind: false,
            left: imageData.left,
            top: imageData.top
        });        
        imgObj.scaleToWidth(imageData.size);
        lcanvas.add(imgObj);
    }

    // if (crossOrigin) { 
        img.crossOrigin = "anonymous";
    // }

    img.src = "https://www.prettyorange.de/imgbase/img/?sid="+imageUrl;
*/
    // Add image to canvas using Fabric.js
    
    
    
    /*fabric.FabricImage.fromURL("https://www.prettyorange.de/imgbase/img/?sid="+imageUrl).then(function (img) {
      img.set({
        centeredRotation: true,
        centeredScaling: true,
        scaleX: imageData.aspect / 3,
        scaleY: imageData.aspect / 3,
        // perPixelTargetFind: false,
        left: imageData.left,
        top: imageData.top
      });
      img.scaleToWidth(imageData.size);
      lcanvas.add(img);
      //lcanvas.moveTo(img, imageData.order);
      lcanvas.renderAll();
    });*/

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
          //this.canvas.loadFromJSON(currentcanvasjson);
          //this.canvas.renderAll();
          this.canvas.loadFromJSON(currentcanvasjson, () => {
            this.canvas.renderAll(); // Ensure the canvas updates after loading
            console.log("Canvas loaded successfully!");
          });
          dupcount++;
        }
        $("#page" + this.pageindex).append("</tr></table>");
      }
    }
    this.initEvents();
  }

  initEvents() {
    var self = this;
    // $(".divcanvas").unbind('click').on('click', function (e) {
    //   e.preventDefault();
    //   self.selectCanvas('divcanvas' + $(this).data('id'));
    // });

  }
  initCanvasEvents() {
    var self = this;
    $('.canvas-container').unbind('click').on('click', function (e) {
      e.stopPropagation();
    });

    // $(".divcanvas").mousedown(function (e) {
    //   e.stopImmediatePropagation();
    //   self.selectCanvas('divcanvas' + $(this).data('id'));
    // });
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.objProps.get('fontFamily'));
    $('#fontselect').css('color', 'white');
  }

  setFontSize() {
    this.setActiveProp('fontSize', this.objProps.get('fontSize'));
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

  // initCanvas() {
  //   //console.log(imageUrl.sid)
  //    //const zipcode = data.address?.details?.zipcode; // Using optional chaining to handle null/undefined safely
  //    //console.log(zipcode);  // Output: 10001
  //   this.canvas = new fabric.Canvas('canvas', {
  //     width: 800,
  //     height: 600,
  //     backgroundColor: '#f0f0f0'
  //   });
  //   this.addCircle();
  //   console.log('Data', this.data.p1);
  //    const images = this.data.p1;
  //    console.log(images);
  //    const imageUrl = images.images;
  //    for (const imageData of imageUrl) {
  //     console.log(imageData.sid);
  //     //this.loadImage(imageData.sid);
  //     //this.addImage(imageData.sid);
  //   }
  // }



  addCircle() {
    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      fill: 'blue',
      radius: 50
    });
    this.canvas.add(circle);

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
// export class AppComponent {
//   title = 'fabricjs-editor';
// }
