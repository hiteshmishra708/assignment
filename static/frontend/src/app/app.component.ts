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

  public isNew: boolean;

  startDate = new Date(1990, 0, 1);

  constructor(private _TrackService : TrackService) { }

  ngOnInit() {
    this.getTracks();
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
    this.isNew = true;
    this.clearTrack();
  }

  clearTrack() {
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

  createTrack() {
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

  updateTrack() {
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
