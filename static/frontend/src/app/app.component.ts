import {Component} from '@angular/core';
import {TrackService} from './track.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  /**
   * An array of all the Track objects from the API
   */
  public Tracks;

  /**
   * An object representing the data in the "add" form
   */
  public new_Track: any;

  public fields: any;

  public isNew: boolean;

  public maxLength: any;

  public validationFields: any;

  startDate = new Date(1990, 0, 1);

  constructor(private _TrackService : TrackService) { }

  ngOnInit() {
    this.getTracks();
    this.fields = {}
    this.maxLength = 5;
    this.validationFields = ["artistName", "trackName", "releaseDate"];
    this.new_Track = this.getTrackObject();
  }

  getTrackObject() {
    var obj = {
      "artistName": "",
      "trackName": "",
      "genreName": "",
      "country": "",
      "releaseDate": "",
    }
    return obj;
  }

  getTracks() {
    this._TrackService.list().subscribe(
      // the first argument is a function which runs on success
      data => { this.Tracks = data; console.log(this.Tracks)},
      // the second argument is a function which runs on error
      err => console.error(err),
      // the third argument is a function which runs on completion
      () => console.log('done loading Tracks')
    );
    this.clearTrack();
  }

  clearTrack() {
    this.fields = {}
    this.isNew = true;
    this.new_Track = this.getTrackObject();
  }

  editTrack(Track) {
    this.new_Track = {
      "artistName": Track["artist"].artistName,
      "artist_id": Track["artist"].artistId,
      "trackName": Track["trackName"],
      "genreName": Track["genreName"],
      "country": Track["country"],
      "releaseDate": Track["releaseDate"],
      "trackId": Track["trackId"]
    }
    this.isNew = false;
  }

  isEmptyField(value) {
    return value == "" || value == null || value == undefined;
  }

  isValidLength(value) {
    if(this.isEmptyField(value)) return true;
    return value.length < this.maxLength;
  }

  checkValidations() {
    this.validationFields.forEach(field => {
      this.fields[field] = { required: this.isEmptyField(this.new_Track[field]), length: this.isValidLength(this.new_Track[field])}
    });
  }

  isValidForm() {
    this.checkValidations();
    let isValid = true;
    this.validationFields.forEach(field => {
      console.log(field, this.fields[field].required || this.fields[field].length)
      if(this.fields[field].required || this.fields[field].length) {
          isValid = false;
          return;
      } 
    });
    return isValid;
  }

  createTrack() {
    if(this.isValidForm()) {
      this._TrackService.create(this.new_Track).subscribe(
        data => {
          // refresh the list
          this.getTracks();
          return true;
        },
        error => {
          console.error("Error saving!");
          return Observable.throw(error);
        }
     );
    }
  }

  updateTrack() {
    if(this.isValidForm()) {
      this._TrackService.update(this.new_Track).subscribe(
        data => {
          // refresh the list
          this.getTracks();
          return true;
        },
        error => {
          console.error("Error saving!");
          return Observable.throw(error);
        }
      );
    }
  }

  deleteTrack(Track) {
    if (confirm("Are you sure you want to delete " + Track.trackName + "?")) {
      this._TrackService.delete(Track).subscribe(
         data => {
           // refresh the list
           this.getTracks();
           return true;
         },
         error => {
           console.error("Error deleting!");
           return Observable.throw(error);
         }
      );
    }
  }
}
