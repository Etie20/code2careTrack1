import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { registerLicense } from '@syncfusion/ej2-base'; // ✅ Import de la fonction de licence

// ✅ Enregistre ta clé de licence ici
registerLicense('Ngo9BigBOggjHTQxAR8/V1JEaF5cXmRCd0xzWmFZfVtgfV9FYlZVRmYuP1ZhSXxWdk1jX39XdHdWQGRcVUR9XEI=');


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

