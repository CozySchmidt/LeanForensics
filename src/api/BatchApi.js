// TODO: import backend url from env to replace localhost 
const backend = "localhost"
const PORT = "8888"

export async function getAllBatches() {
    try {
        let url = `http://${backend}:${PORT}/batches/`;
        let response = await fetch(url);
        let json = await response.json();
        if (json.success) {
            return json.body.results[0];
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export async function getBatchById(BatchId) {
    try {
        let url = `http://${backend}:${PORT}/batches/${BatchId}`;
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


export async function createBatch(Batch, Samples) {
  try {
      let response = await fetch(`http://${backend}:${PORT}/batches`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({batch: Batch, samples: Samples})
      });
      let json = await response.json();
      if (json.success) {
          return true;
      } else {
          return false;
      }
  } catch (error) {
      return false;
  }
}