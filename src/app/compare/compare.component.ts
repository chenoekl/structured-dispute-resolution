import { Component, OnInit, Inject } from '@angular/core';
import { DataService } from '../data.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {  FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  private dataService;
  private state = "claimant";
  private lawIndex = 0;
  private submitIndex = null;

  animal: string;
  name: string;

  constructor(_data: DataService, public dialog: MatDialog) {
    this.dataService = _data;
  }

  ngOnInit() {
  }

  submitToDefendant() {
    this.state = "defendant";
    if(this.submitIndex === null) {
      this.submitIndex = this.lawIndex;
      this.lawIndex = 0;
    } else {
      var temp = this.lawIndex;
      this.lawIndex = this.submitIndex;
      this.submitIndex = temp;
    }
  }

  submitToClaimant() {
    this.state = "claimant";
    if(this.submitIndex === null) {
      this.submitIndex = this.lawIndex;
      this.lawIndex = 0;
    } else {
      var temp = this.lawIndex;
      this.lawIndex = this.submitIndex;
      this.submitIndex = temp;
    }
  }

  agreeToFact(lawelement: any) {
    lawelement.disputed = false;
    this.lawIndex++;
  }

  openDialogAdd() {
    this.lawIndex++;
    this.openDialog();
  }

  openDialog(): void {
    console.log(this.lawIndex);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '400px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(this.dataService.lawelementArray.length <= this.lawIndex) {
        this.dataService.lawelementArray.push({
          claimant: null,
          disputed: null,
          defendant: null
        })
      } else {
        this.dataService.lawelementArray[this.lawIndex].disputed = true;
      }
      if(this.state === "claimant") {
        this.dataService.lawelementArray[this.lawIndex].claimant = {
          fact: result.fact,
          time: result.time,
          proof: result.proof,
          legalOpinion: result.legalOpinion,
          creationDate: new Date(),
          attachments: result.attachments
        }
      }
      if(this.state === "defendant") {
        this.dataService.lawelementArray[this.lawIndex].defendant = {
          fact: result.fact,
          time: result.time,
          proof: result.proof,
          legalOpinion: result.legalOpinion,
          creationDate: new Date(),
          attachments: result.attachments
        }
      }
      this.lawIndex++;
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  public uploader: FileUploader = new FileUploader(null);

  private fact = "";
  private time = null;
  private proof = "";
  private legalOpinion = "";
  private att = [];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialog() {
    console.log(this.uploader);
    this.dialogRef.close({
      fact: this.fact,
      time: this.time,
      proof: this.proof,
      legalOpinion: this.legalOpinion,
      creationDate: Date(),
      attachments: this.att
    });
  }

  addItem(){
    this.att.push('pdf');
  }

}