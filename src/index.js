import "./styles.css";

const addressInput = document.getElementById("addressInput");
const addressOutput = document.getElementById("addressOutput");

addressInput.addEventListener("keyup", (e) => {
  prepareRequest(e.target.value);
});

const prepareRequest = async (lookupValue) => {
  if (!lookupValue) {
    addressOutput.innerHTML = "";
    return;
  }

  const SmartySDK = require("smartystreets-javascript-sdk");
  const SmartyCore = SmartySDK.core;
  const Lookup = SmartySDK.usAutocompletePro.Lookup;

  // US Autocomplete Pro only supports using Embedded Keys
  let key = "136624217952425694";
  const credentials = new SmartyCore.SharedCredentials(key);

  // The appropriate license values to be used for your subscriptions
  // can be found on the Subscription page of the account dashboard.
  // https://www.smarty.com/docs/cloud/licensing
  let clientBuilder = new SmartyCore.ClientBuilder(credentials).withLicenses([
    "us-autocomplete-pro-cloud"
  ]);
  // .withBaseUrl("");
  let client = clientBuilder.buildUsAutocompleteProClient();

  // Documentation for input fields can be found at:
  // https://www.smarty.com/docs/cloud/us-autocomplete-api#pro-http-request-input-fields

  // *** Simple Lookup ***
  let lookup = new Lookup(lookupValue);

  await handleRequest(lookup, "Simple Lookup");

  function logSuggestions(response, message) {
    const suggestionList = response.result.map((suggestion) => {
      const el = document.createElement("div");
      el.innerText = `${suggestion.streetLine}, ${suggestion.city}, ${suggestion.state}, ${suggestion.zipcode}`;
      return el;
    });
    addressOutput.innerHTML = "";
    addressOutput.append(...suggestionList);
  }

  async function handleRequest(lookup, lookupType) {
    try {
      const results = await client.send(lookup);
      logSuggestions(results, lookupType);
    } catch (err) {
      console.log(err);
    }
  }
};
