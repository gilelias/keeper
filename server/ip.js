var maxmind = require('maxmind');

const stripAnyPrefix = ip => ip.replace(/^.*:/, '');

const getUserLocationByIP = (ip) => {
    return new Promise((res, rej) => {
        maxmind.open(__serverDir + '/resources/geoDB/GeoLite2-City.mmdb', (err, cityLookup) => {
            try {
                var city;

                if (err) {
                    throw err;
                }

                ip = stripAnyPrefix(ip);
                city = cityLookup.get(ip);
                res(city);
            } catch (err) {
                rej(err);
            }
        });
    });
};


module.exports = {
    getUserLocationByIP
}