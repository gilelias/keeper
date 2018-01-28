# Keeper - tcp http logger + blocker 

This project allows you to log and block http request out of tcp. 
I've build it to monitor http connections my dvr at home, without interfering its tcp protocol.
I found out that my dvr had a backdoor allowing everyone to bypass its password and view my cams, moreover it has a backdoor allowing any hacker to get root access to my dvr without password.

It also was discovered by pentestpartners - https://www.pentestpartners.com/security-blog/pwning-cctv-cameras/


## Getting Started

This project tests on node 8.4.0, with npm 5.6.0, both ubuntu 16.4, and arm.
It has a server part, and panel built with react + redux (webpack). 

### Prerequisites

mongodb 

```
# sudo apt-get install mongodb
```
alternative - mongodb docker
```
# docker run -d -p 27017:27017 -p 28017:28017 tutum/mongodb
```

### Installing
To install its dependencies:
```
npm i
```

to build the client - you dont need to do this if didnt change the code:
```
npm run build
```


## Running the project
Make sure ./server/config.js file fits to your configurations.

to run the project: 
```
node server/index.js <localport> <remotehost> <remoteport>
```

## create a challenge
Challenges are regullar expressions, for example you can simply block all GET requests by:
Field | Test
--- | ---
request.method | GET 

### Development 
to run the client with hot module replacement - for development only:
```
npm run start
```

### Images
![Image 1](images/1.png?raw=true "View requests")
![Image 2](images/1.png?raw=true "View challenges")




### Built With
* [npm](https://www.npmjs.com/) - Dependency Management
* [react 16.2.0](https://reactjs.org/) - A JavaScript library for building user interfaces
* [redux](https://github.com/reactjs/react-redux) - Managing app state
* [mongodb](https://www.mongodb.com/) - Project db

### TODO
* requests pagination
* allow requests search + filter
* block specific ip location

### Contributing
You can contribute the project by submitting a pull request.



