import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import { saveAs } from 'file-saver';
import {Options} from "@angular-slider/ngx-slider";
import {SelectContainerComponent} from "ngx-drag-to-select";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  sliderValue: number = 0.25;
  sliderHighValue: number = 0.5;
  sliderOptions: Options = {
    floor: 0,
    ceil: 1,
    step: 0.001,
    hideLimitLabels: true,
    hidePointerLabels: true,
  };

  @ViewChild("selector") selector: SelectContainerComponent;

  @ViewChild("field") field: ElementRef;

  points: Point[] = [];
  selected: Point[] = [];
  uploadedFile: File = null;

  minX = -1;
  maxX = 8.5;
  minY = -2;
  maxY = 2;
  fieldHeight: 10;
  fieldWidth: 10;

  selectedUseIntake = false;
  selectedBackwards = false;
  selectedScalar = 1.0;

  async handleFileInput(files: FileList) {
    this.points = [];
    this.uploadedFile = files.item(0);
    console.log(this.uploadedFile.name);
    let text = await this.uploadedFile.text();
    let lines = text.split("\n")
    for(let line of lines){
      let vals = line.split(",");
      if(vals.length == 1){
        continue;
      }
      this.points.push({
        i: lines.indexOf(line),
        x: Number(vals[0]),
        y: Number(vals[1]),
        scalar: Number(vals[2]),
        intake: Number(vals[3]) == 1,
        backwards: Number(vals[4]) == 1
      });
    }
    console.log(this.points);
    this.updateField();
  }

  selectRange(){
    this.selected = [];
    let start = Math.floor(this.sliderValue * this.points.length);
    let end = Math.floor(this.sliderHighValue * this.points.length);
    this.selector.clearSelection();
    for(let i=start; i<=end; i++){
      this.selected.push(this.points[i]);
      // @ts-ignore
      console.log(this.selector.selectItems(item => item.i == i));
    }
  }

  movePoints(dir: number){
    let amount = 0.02;
    switch(dir){
      case 0:
        for(let point of this.selected){
          point.x -= amount;
        }
        break;
      case 1:
        for(let point of this.selected){
          point.y += amount;
        }
        break;
      case 2:
        for(let point of this.selected){
          point.y -= amount;
        }
        break;
      case 3:
        for(let point of this.selected){
          point.x += amount;
        }
        break;
    }
  }

  updateField(){
    this.fieldWidth = this.field.nativeElement.offsetWidth;
    this.fieldHeight = this.field.nativeElement.offsetHeight;
    console.log(this.fieldWidth, this.fieldHeight);
  }

  getStyle(p: Point){
    let xRange = this.maxX - this.minX;
    let yRange = this.maxY - this.minY;
    let x = (p.x - this.minX)/xRange * this.fieldWidth;
    let y = (1 -(p.y - this.minY)/yRange) * this.fieldHeight;
    let size = 2 + p.scalar * 4;

    return 'top: '+(y - size/2).toString()+'px; '
      +'left:'+(x-size/2).toString()+'px;'
      +'width:'+size.toString()+"px;height:"+size.toString()+"px;";
  }

  applyScalar(){
    for(let point of this.selected){
      point.scalar = this.selectedScalar;
    }
  }
  applyIntake(){
    for(let point of this.selected){
      point.intake = this.selectedUseIntake;
    }
  }

  applyBackwards(){
    for(let point of this.selected){
      point.backwards = this.selectedBackwards;
    }
  }

  saveFile() {
    let data = Object.keys(this.points).map((key:string) => {
      let p = this.points[key];
      return [p.x.toString(),p.y.toString(),p.scalar.toString(),p.intake ? "1" : "0", p.backwards ? "1" : "0"].join(",")
    }).join("\n");
    var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
    saveAs(blob, this.uploadedFile.name);
  }
}

export interface Point{
  i: number;
  x: number;
  y: number;
  scalar: number;
  intake: boolean;
  backwards: boolean;
}
