
import * as mongoose from 'mongoose';
import app from './app'
import config from './config/config'
let server: any;
mongoose.connect(
    `mongodb+srv://m001-student:${config.mongoose.password}@sandbox.xoirp7n.mongodb.net/${config.mongoose.name}?retryWrites=true&w=majority`)
    .then((con) => {
        console.log(con.connections);
        console.log('connection established successfully');
        server = app.listen(config.port, () => {
            console.log(`[server]: Server is running at http://localhost:${config.port}`);
          });
      })
      .catch((err) => {
        console.log(err);
        console.log('connection established failure');
      });

      process.on('SIGTERM', () => {
        console.log('SIGTERM received');
        if (server) {
          server.close();
        }
      });