require('dotenv').config({ path: './.env' });
const app = require('./app');

// check running environment
console.log(app.get('env'));
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listen on port ${port}`);
});
