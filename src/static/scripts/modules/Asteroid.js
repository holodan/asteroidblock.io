/* eslint-disable new-cap, no-unused-vars */
import Nexus from 'nexusui';

import Sequencer from './Sequencer';
import Controls from './Controls';
import Signal from './Signal';
import Effects from './Effects';
import Audio from './Audio';

import { fetchAsync } from '../utils/fetchAsync';

const Asteroid = {
  elem: document.querySelector('.intro__wrapper'),
  beginEl: document.querySelector('#begin'),
  asteroidDataElem: document.querySelector('#asteroid-data'),
  asteroids: [],
  selectedAsteroid: {},
  hasOpened: false,

  init() {
    this.render();
  },

  fetchData: async () => {
    const data = await fetchAsync(
      'https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-08&end_date=2015-09-08&api_key=MKsFWtbcBefGIcipiyBf36RE9qX31mrNnwQGoges'
    );

    Asteroid.asteroids = data.near_earth_objects['2015-09-08'];
    Asteroid.selectedAsteroid = Asteroid.asteroids[0];
    Asteroid.renderInfo();
    console.log('Asteroid.asteroids', Asteroid.asteroids);
    Asteroid.eventListener();
  },

  renderInfo(i) {
    Asteroid.asteroidDataElem.innerHTML = '';

    let html = `
      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Name:</span>
        </div>
        <div class="col-12">
          ${Asteroid.selectedAsteroid.name}
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Potentially Dangerous:</span>
        </div>
        <div class="col-12">
          ${Asteroid.selectedAsteroid.is_potentially_hazardous_asteroid.toString()}
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Close Approach Date:</span>
        </div>
        <div class="col-12">
          ${
            Asteroid.selectedAsteroid.close_approach_data[0].close_approach_date
          }
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Orbiting Body:</span>
        </div>
        <div class="col-12">
          ${Asteroid.selectedAsteroid.close_approach_data[0].orbiting_body}
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Est. Diamater (Kilometers):</span>
        </div>
        <div class="col-12">
          ${
            Asteroid.selectedAsteroid.estimated_diameter.kilometers
              .estimated_diameter_max
          }
        </div>
      </div>

      <div class="flex  flex-wrap  pb2">
        <div class="col-12">
          <span class="fw7">Miss Distance (Kilometers):</span>
        </div>
        <div class="col-12">
          ${
            Asteroid.selectedAsteroid.close_approach_data[0].miss_distance
              .kilometers
          }
        </div>
      </div>
    `;

    Asteroid.asteroidDataElem.insertAdjacentHTML('beforeend', html);
  },

  eventListener() {
    const select = new Nexus.Select('#asteroids', {
      size: [300, 30],
      options: Asteroid.asteroids.map(e => e.name)
    });

    select.on('change', e => {
      Asteroid.selectedAsteroid = Asteroid.asteroids[e.index];
      Asteroid.renderInfo();
    });

    Asteroid.beginEl.addEventListener(
      'click',
      () => {
        if (Asteroid.hasOpened) {
          return;
        }

        Asteroid.elem.style.display = 'none';
        Sequencer.elem.style.display = 'flex';

        Sequencer.renderNotes();
        Sequencer.renderSequence();
        Controls.renderControls();

        Asteroid.hasOpened = true;
      },
      false
    );
  },

  render() {
    Asteroid.fetchData();
  }
};

export default Asteroid;

/* eslint-enable */
