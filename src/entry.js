import * as service from 'weex-service';
import './components/wconsole/index.js';

const routes = [];

export default function create(App) {
    return service.create('#app', App, routes);
}
