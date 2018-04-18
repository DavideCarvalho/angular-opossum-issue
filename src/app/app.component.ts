import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';
import circuitBreaker from 'opossum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(private http: HttpClient) {}

  private makeRequest(): Promise<any> {
    return this.http.get(`https://jsonplaceholder.typicode.com/posts/1`).toPromise();
  }

  ngOnInit() {
    this.makeRequest()
    .then((data) => {
      console.log(data);
    });
    const circuitBreakerOptions = {};
    const circuit = circuitBreaker(() => axios.get(`https://jsonplaceholder.typicode.com/posts/1`), circuitBreakerOptions);

    circuit.fallback(() => `unavailable right now. Try later.`);
    circuit
      .fire()
      .then(data => console.log(data))
      .catch((e) => console.error(e));
  }
}
