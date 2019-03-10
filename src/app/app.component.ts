import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as mapboxSdk from '@mapbox/mapbox-sdk/umd/mapbox-sdk.min';
import { MapService } from './map.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import * as firebase from 'firebase';
import { firestore } from 'firebase';
import { environment } from '../environments/environment';

const config = environment.firebaseConfig;

const settings = { timestampsInSnapshots: true };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'app';

  @ViewChild('placeInput') placeInput: ElementRef;

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 37.75;
  lng = -122.41;
  message = 'Hello World!';

  // data
  source: any;
  markerCos: any[] = [];
  mapboxClient: any;
  options: string[] = [];
  searhTextSubject: Subject<string> = new Subject<string>();
  myControl = new FormControl();

  constructor(private mapService: MapService) {
    this.mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
    console.log("mapboxSdk", mapboxSdk, this.mapboxClient);
  }

  onSelect(option: any) {
    console.log("Option Selected", option);
  }

  ngOnInit() {
    firebase.initializeApp(config);
    firebase.firestore().settings(settings);
  }

  ngAfterViewInit() {
    setTimeout(()=>{

      this.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 10
      });
      window['map'] = this.map;
  
      // if (navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(position => {
      //     this.lat = position.coords.latitude;
      //     this.lng = position.coords.longitude;
      //     this.map.flyTo({
      //       center: [this.lng, this.lat]
      //     })
      //   });
      // }
  
      this.addMarker([115.16548, -8.744169], "Ngurah Rai International Airport (DPS), Jalan Airport Ngurah Rai, Badung, Bali 80361, Indonesia");
    }, 100);


    this.initPlaceFetch();
  }

  search() {
    this.searhTextSubject.next(this.placeInput.nativeElement.value);
  }

  initPlaceFetch() {

    this.searhTextSubject.pipe(debounceTime(500)).subscribe((val) => {
      console.log("Searh val", val);
      if (val && val.length) {
        this.options = [];
      } else {
        return;
      }
      this.mapboxClient.geocoding.forwardGeocode({
        query: val,
        autocomplete: false,
        limit: 10
      })
        .send()
        .then((response) => {
          if (response && response.body && response.body.features && response.body.features.length) {
            console.log("Search Respinse", response);

            response.body.features.forEach(f => {
              this.options.push(f);
            });
          }
        });
    });
  }

  addMarker(coOrdinates: number[], description: string) {
    var popup = new mapboxgl.Popup({ offset: 25 })
      .setText(description);

    var marker = new mapboxgl.Marker();

    marker.setLngLat(coOrdinates)
      .setPopup(popup)
      .addTo(this.map);

    this.map.flyTo({
      center: coOrdinates
    });

    this.markerCos.push({
      coordinates: coOrdinates,
      description: description
    });

    if(this.markerCos.length > 1){
      this.fetchDirections(this.markerCos.slice(this.markerCos.length - 2 , this.markerCos.length));
    }
  }

  addRouteLayer(coordinates: any[]) {
    this.map.addLayer({
      "id": "route" + new Date().getTime(),
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": coordinates
          }
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#888",
        "line-width": 8
      }
    });

    this.map.flyTo({
      center: coordinates[0]
    });
  }

  fetchDirections(coOrdinatesList){
    this.mapboxClient.directions.getDirections({
      profile: 'driving-traffic',
      geometries:'geojson',
      waypoints: coOrdinatesList
    })
      .send()
      .then(response => {
        const directions = response.body;
    console.log("directions",directions);
    this.addRouteLayer(directions.routes[0].geometry.coordinates);
      });
  }

  onSelectionChanged(feature: any) {
    console.log("onSelectionChanged", event);
    this.addMarker(feature.center, feature.place_name);
    this.options = [];
  }
}
