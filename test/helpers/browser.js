// TODO: Remove and Set to a setup file
// Since the purpose of this file is to set up the browser
// Perhaps we can instead point mocah to run a setupfile
// which then executes this file to set up the browser
require("dotenv").config({ path: "test.env" });

require("mock-local-storage");
global.window = {};

const enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

enzyme.configure({ adapter: new Adapter() });

require("@babel/register")();

const jsdom = require("jsdom").jsdom;

const exposedProperties = ["window", "navigator", "document"];

global.document = jsdom("");
const { document } = global;
global.window = document.defaultView;

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === "undefined") {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: "node.js",
};

window.sessionStorage = global.sessionStorage;
window.localStorage = global.localStorage;

const noop = () => {};
require.extensions[".png"] = noop;
