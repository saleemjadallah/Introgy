import { checkSiteUrl } from './checkSiteUrl';

// This will run the check and log the result
console.log('Checking Supabase Site URL configuration...');
checkSiteUrl().then(url => {
  console.log('Site URL check complete');
});
