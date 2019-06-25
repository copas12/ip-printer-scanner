const portscanner = require("portscanner");

const checkIndivualIP = async ip => {
  return new Promise(resolve => {
    portscanner.checkPortStatus(9100, ip, function(error, status) {
      if (error) {
        resolve({ ip, open: false });
      }
      status === "open" ? resolve({ ip, open: true }) : resolve({ ip, open: false });
    });
  });
};

const scan = async (ipV4) => {
  const ip = ipV4.split(".");
  const prefixIP = ip[0] + "." + ip[1] + "." + ip[2];
  const classes = prefixIP.split(".");
  const x = parseInt(classes[2]);
  const arrayOfPrefix = [prefixIP];
  if (x > 0) {
    arrayOfPrefix.push(classes[0] + "." + classes[1] + "." + (x - 1).toString());
  }
  if (x < 255) {
    arrayOfPrefix.push(classes[0] + "." + classes[1] + "." + (x + 1).toString());
  }
  const arrayOfPromises = [];
  for (const pref of arrayOfPrefix) {
    for (let i = 0; i <= 255; i++) {
      arrayOfPromises.push(checkIndivualIP(`${pref}.${i}`));
    }
  }

  const result = (await Promise.all(arrayOfPromises)).filter(r => r.open);
  return result.map(r => r.ip);
};

module.exports = { scan };
