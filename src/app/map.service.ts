import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../environments/environment';
import { GeoJson } from './map';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  markers:any[];

  constructor() {
    mapboxgl.accessToken = environment.mapbox.accessToken
  }


  getMarkers(): any[] {
    return this.markers;
  }

  createMarker(data: GeoJson) {
    return this.markers
                  .push(data)
  }

  removeMarker($key: string) {
    // return this.db.object('/markers/' + $key).remove()
  }
}
