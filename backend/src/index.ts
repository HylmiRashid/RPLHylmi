import app from "./app";
import { Env } from "./config/Env";

app.listen(Env.Port, () => {
  console.log(`DagangTrack API berjalan di http://localhost:${Env.Port}`);
});
