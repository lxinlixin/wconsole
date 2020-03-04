import * as service from '@u51/weex-service';
import './components/wconsole/index.js';

const routes = [];

export default function create(App) {
    return service.create('#app', App, routes);
}
