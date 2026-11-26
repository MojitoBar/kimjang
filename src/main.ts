import '@fontsource/black-and-white-picture/400.css';
import '@fontsource/nanum-gothic/400.css';
import '@fontsource/nanum-gothic/700.css';
import '@fontsource/nanum-gothic/800.css';
import './ui/css/base.css';
import './ui/css/screens.css';
import './ui/screens';
import { boot } from './ui/stage';

const app = document.getElementById('app');
if (app) boot(app);
