# Social Networking Kata
This implementation is written in javascript for fun and experimentation.

The original specifications are available at [Social Networking kata](https://github.com/xpeppers/social_networking_kata_kata).

In this kata I "pushed" Javascript and used it as an OO language to explore this possibility.
So I tried to use a naive form of interfaces.
Javascript is not the perfect language for these tasks especially because it lacks static typing.

Futhermore it was an opportunity to use ES6 modules and check the status of compatibility in node.

## Prerequisites
- npm
- node (tested with v14.3.0)

The project has been tested only on Linux platform.

It should work also on other common platforms (Windows, macOS) but there hasn't been a throughly testing for incompatibilities on different platforms and different node versions.

## Installation
After cloning the repository you should execute:
```
npm install
```
This command will download all the packages needed for execution and testing.

## Run
Execute the following command to run the project:
```
npm start
```

## Running the tests
Execute the following command to run the tests:
```
npm test
```
It's possible to check the test coverage reports in the `coverage` directory after executing:
```
npm coverage
```
Unfortunately there are still some problems with coverage measurements, ES6 modules and caches. This problem hasn't been deeply addressed in current build.
If you get very low measurements please try running manually `npm run clean` before executing the coverage command.

## Author
Roberto Boati - [rboati](https://github.com/rboati)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details