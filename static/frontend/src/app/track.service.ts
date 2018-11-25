import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class TrackService {

    // http options used for making any writing API calls
    private httpOptions: any;

    constructor(private http:HttpClient, private _cookieService:CookieService) {
        // CSRF token is needed to make API calls work when logged in
        let csrf = this._cookieService.get("csrftoken");
        // the Angular HttpHeaders class throws an exception if any of the values are undefined
        if (typeof(csrf) === 'undefined') {
          csrf = '';
        }
        this.httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'X-CSRFToken': csrf })
        };
    }

    // NOTE: all API calls in this file use simple endpoints served by
    // an Express app in the file app.js in the repo root. See that file
    // for all back-end code.

    // Uses http.get() to load data from a single API endpoint
    list() {
        return this.http.get('tracks/');
    }

    // send a POST request to the API to create a new data object
    create(track) {
        let body = JSON.stringify(track);
        return this.http.post('tracks/', body, this.httpOptions);
    }

    // send a PUT request to the API to update a data object
    update(track) {
        let body = JSON.stringify(track);
        return this.http.put('tracks/' + track.trackId + '/', body, this.httpOptions);
    }

    // send a DELETE request to the API to delete a data object
    delete(track) {
        console.log(track)
        return this.http.delete('tracks/' + track.trackId + '/', this.httpOptions);
    }

}
