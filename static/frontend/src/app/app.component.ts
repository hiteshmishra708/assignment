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

	public filter: any;

	public isNew: boolean;

	public maxLength: any;

	public filterFields: any;

	public validationFields: any;

	public data: any;

	public idList: any;

	startDate = new Date(1990, 0, 1);

	constructor(private _TrackService : TrackService) { }

	ngOnInit() {
		this.idList = [];
		this.getTracks();
		this.maxLength = 5;
		this.filterFields = ["filter_artist_id", "filter_releaseDate"];
		this.validationFields = ["artistName", "trackName", "releaseDate"];
		this.filter = this.getFilterObject();
		this.new_Track = this.getTrackObject();
	}

	getFilterObject() {
		var obj = {
		"artist_id": null,
		"releaseDate": "",
		}
		return obj;
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
			data => {
				this.Tracks = data;
				this.Tracks.forEach(element => {
					if(this.idList.indexOf(element["artist"].artistId) == -1) {
					this.idList.push(element["artist"].artistId);
					}
				});
				console.log(this.Tracks)
			},
			// the second argument is a function which runs on error
			err => console.error(err),
			// the third argument is a function which runs on completion
			() => console.log('done loading Tracks')
		);
		this.clearTrack();
	}

	clearTrack() {
		this.idList = [];
		this.fields = {};
		this.isNew = true;
		// this.filter = this.getFilterObject();
		this.new_Track = this.getTrackObject();
	}

	clearFilter() {
		this.filter = this.getFilterObject();
		this.getTracks();
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

	checkValidations(type="form") {
		switch(type) {
		case "form":
			this.validationFields.forEach(field => {
			this.fields[field] = { required: this.isEmptyField(this.new_Track[field]), length: this.isValidLength(this.new_Track[field])}
			});
			break;
		case "filter":
			this.filterFields.forEach(field => {
			this.fields[field] = { required: this.isEmptyField(this.filter[field])}
			});
			break;
		}
	}

	isValidForm(type="form") {
		this.checkValidations(type);
		let isValid = true;
		switch(type) {
			case "form":
				this.validationFields.forEach(field => {
					if(this.fields[field].required || this.fields[field].length) {
						isValid = false;
						return;
					} 
				});
			break;
			case "filter":
				this.filterFields.forEach(field => {
					if(this.fields[field].required) {
						isValid = false;
						return;
					} 
				});
			break;
		}
		return isValid;
	}

	createTrack() {
		if(this.isValidForm()) {
			this._TrackService.create(this.new_Track).subscribe(
				data => {
					let res: any;
					res = data;
					if(res.message) {
						alert(res.message);
					}
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
					let res: any;
					res = data;
					if(res.message) {
						alert(res.message);
					}
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
					let res: any;
					res = data;
					if(res.message) {
						alert(res.message);
					}
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

	filterTrack() {
		if(this.isValidForm("filter")) {
			this._TrackService.filter(
				{"artist_id": this.filter["filter_artist_id"],
				"releaseDate": this.filter["filter_releaseDate"]
				}).subscribe(
				// the first argument is a function which runs on success
					data => {
						this.data = data;
						alert(this.data.message);
						if(this.data.records && this.data.records.length > 0) {
							this.Tracks = this.data.records;
						}
					},
					// the second argument is a function which runs on error
					err => console.error(err),
					// the third argument is a function which runs on completion
					() => console.log('done filtering Tracks')
				);
			}
		}
	}
