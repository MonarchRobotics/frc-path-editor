import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import { saveAs } from 'file-saver';

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  @ViewChild("field") field: ElementRef;

  points: Point[] = [];
  selected: Point[] = [];
  uploadedFile: File = null;

  minX = -0.5;
  maxX = 8.5;
  minY = -2;
  maxY = 2;
  fieldHeight: 10;
  fieldWidth: 10;

  selectedUseIntake = false;
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
        intake: Number(vals[3]) == 1
      });
    }
    console.log(this.points);
    this.updateField();
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
    let size = 6 + p.scalar * 4;

    return 'top: '+y.toString()+'px; '
      +'left:'+x.toString()+'px;'
      +'width:'+size.toString()+"px;height:"+size.toString()+"px;";
  }

  applyScalar(){
    for(let point of this.selected){
      point.scalar = this.selectedScalar;
    }
    console.log(this.points);
  }
  applyIntake(){
    for(let point of this.selected){
      point.intake = this.selectedUseIntake;
    }
    console.log(this.points);
  }

  saveFile() {
    let data = Object.keys(this.points).map((key:string) => {
      let p = this.points[key];
      return [p.x.toString(),p.y.toString(),p.scalar.toString(),p.intake ? "1" : "0"].join(",")
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
}
