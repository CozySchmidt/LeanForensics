
// TODO: import backend url from env to replace localhost 
const backend = "localhost"
const PORT = "8888"

export async function getAllSamples() {
  try {
      let url = `http://${backend}:${PORT}/samples`;
      let response = await fetch(url);
      let json = await response.json();
      if (json.success) {
          return json.body;
      } else {
          return null;
      }
  } catch (error) {
      return null;
  }
}

export async function getSamplesByBatchId(BatchId) {
  try {
      let url = `http://${backend}:${PORT}/batches/${BatchId}/samples`;
      let response = await fetch(url);
      let json = await response.json();
      if (json.success) {
          return json.body;
      } else {
          return null;
      }
  } catch (error) {
      return null;
  }
}