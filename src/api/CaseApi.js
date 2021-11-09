// TODO: import backend url from env to replace localhost
const backend = "localhost";
const PORT = "8888";

export async function createCase(Case, Samples) {
  try {
    let response = await fetch(`http://${backend}:${PORT}/cases`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ case: Case, sampleList: Samples }),
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
