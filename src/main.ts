import './ui/css/base.css';
import './ui/css/screens.css';
import './ui/screens';
import { boot } from './ui/stage';

const app = document.getElementById('app');
if (app) boot(app);
