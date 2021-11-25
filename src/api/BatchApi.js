// TODO: import backend url from env to replace localhost
const backend = "localhost";
const PORT = "8888";

export async function getAllBatches() {
  try {
    let url = `http://${backend}:${PORT}/batches/`;
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

/**
 *
 * @param {*} Batch
 * @param {*} Samples
 * @returns
 */
export async function createBatch(batchObj) {
  try {
    let response = await fetch(`http://${backend}:${PORT}/batches`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchObj),
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

export async function updateBatchStage(batchId, stageId) {
  try {
    let response = await fetch(`http://${backend}:${PORT}/batches/${batchId}/stages/${stageId}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
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

export async function pullOutSamplesFromBatch(batchObj) {
  try {
    let batchId = batchObj.BatchId;
    let response = await fetch(`http://${backend}:${PORT}/batches/${batchId}/samples`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchObj),
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

export async function updateBatchInfo(batchObj) {
  try {
    let batchId = batchObj.BatchId;
    let response = await fetch(`http://${backend}:${PORT}/batches/${batchId}/samples`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchObj),
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

export async function updateBatchReady(batchObj) {
  try {
    let batchId = batchObj.BatchId;
    let response = await fetch(`http://${backend}:${PORT}/batches/${batchId}/ready`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batchObj),
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

export async function markBatchCompleted(batchId) {
  try {
    let response = await fetch(`http://${backend}:${PORT}/batches/${batchId}/completed`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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


export async function deleteBatch(batchId) {
  try {
    let response = await fetch(`http://${backend}:${PORT}/batches/${batchId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
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