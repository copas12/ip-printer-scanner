const {v4} = require("internal-ip");
const qjobs = require("qjobs");
const isPortReachable = require('is-port-reachable');

const scan = async () => {
  return new Promise(async (resolve) => {
    const result = [];
    const range = 2;
    const ip = await v4();
    const arrayIP = ip.split('.');
    const subnet = parseInt(arrayIP[2]);
    const fromSubnet = ((subnet-range) > 0) ? (subnet - range) : 0;
    const toSubnet = ((subnet+range) < 225) ? (subnet + range) : 225;
    const jobs = new qjobs({ maxConcurrency: 1000 });
    
    const job = async (args, next) => {
      const checkResult = await isPortReachable(9100, {host: args.ip});
      if (checkResult) result.push(args.ip);
      next();
    }
    for (let h=fromSubnet; h<=toSubnet; h++) {
      for (let i=0; i<=225; i++) {
        const ipToCheck = arrayIP[0] + '.' + arrayIP[1] + '.' + h.toString() + '.' + i.toString();
        jobs.add(job,{ip: ipToCheck});
      }
    }
    jobs.on('end', () => {
      resolve(result);
    });
    jobs.run();
})
}


// scan().then(console.log)
// checkIndivualIP('192.168.99.10').then(console.log);



module.exports = { scan };
