// TODO: import backend url from env to replace localhost 
const backend = "localhost"
const PORT = "8888"

export async function getAllBatchesByStages() {
  try {
    let url = `http://${backend}:${PORT}/stages/batches`;
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

export async function getAllStages() {
  try {
    let url = `http://${backend}:${PORT}/stages`;
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
export async function getAllExtractionMethods() {
  try {
    let url = `http://${backend}:${PORT}/extractionMethods`;
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
export async function getAllScreeningMethods() {
  try {
    let url = `http://${backend}:${PORT}/screeningMethods`;
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
export async function getAllKitType() {
  try {
    let url = `http://${backend}:${PORT}/kitTypes`;
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
